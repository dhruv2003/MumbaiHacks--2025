"""
FastAPI server for the AI Relationship Manager
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Union
import uvicorn
import os
import tempfile
from pathlib import Path
import pandas as pd

from agent.manager import get_agent_manager
from agent.config import Config
from agent.tools import optimize_spending
from services import get_aa_client, AATransformer

# Initialize FastAPI app
app = FastAPI(
    title="AI Financial Relationship Manager",
    description="Personalized financial guidance through conversational AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (frontend)
app.mount("/static", StaticFiles(directory="public"), name="static")


# Request/Response models
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"
    agent_id: Optional[str] = "personal_advisor"
    user_id: Optional[str] = "personal_user"  # New field for user selection


class ChatResponse(BaseModel):
    response: str
    session_id: str
    agent_id: str
    user_id: str


class OptimizeSpendingRequest(BaseModel):
    product_name: str
    price: Optional[Union[float, str]] = None
    category: Optional[str] = None
    website: Optional[str] = None


# Routes
@app.get("/")
async def root():
    """Serve the main HTML page"""
    return FileResponse("public/index.html")


@app.get("/api/users")
async def get_users():
    """Get list of available users"""
    from agent.user_manager import get_user_manager
    return get_user_manager().get_all_users()


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint for interacting with the financial AI agent
    """
    try:
        # Get agent manager
        manager = get_agent_manager()
        
        # Process message via manager
        response = manager.chat(request.message, request.agent_id, request.user_id)
        
        return ChatResponse(
            response=response,
            session_id=request.session_id,
            agent_id=manager.active_agent_id,
            user_id=manager.user_manager.active_user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reset")
async def reset_conversation():
    """Reset the conversation history"""
    try:
        manager = get_agent_manager()
        # Reset active agent
        manager.get_active_agent().reset_conversation()
        return {"status": "success", "message": "Conversation reset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Financial Relationship Manager",
        "version": "1.0.0"
    }


@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and index a policy document (PDF or TXT file)
    """
    try:
        from agent.knowledge_base import get_knowledge_base
        from agent.document_processor import process_document
        
        # Check file type
        filename = file.filename
        if not filename.lower().endswith(('.pdf', '.txt')):
            raise HTTPException(
                status_code=400,
                detail="Only PDF and TXT files are supported"
            )
        
        # Save uploaded file temporarily
        temp_dir = Path(tempfile.gettempdir())
        temp_path = temp_dir / filename
        
        with open(temp_path, 'wb') as f:
            content = await file.read()
            f.write(content)
        
        try:
            # Process the document (extract text and chunk)
            full_text, chunks = process_document(str(temp_path), filename)
            
            # Add to knowledge base
            kb = get_knowledge_base()
            
            # Copy file to knowledge base storage
            kb_doc_path = kb.documents_dir / filename
            with open(kb_doc_path, 'wb') as f:
                f.write(content)
            
            # Index the chunks
            kb.add_document(filename, chunks, str(kb_doc_path))
            
            return {
                "status": "success",
                "message": f"Document '{filename}' uploaded and indexed successfully",
                "filename": filename,
                "chunks": len(chunks),
                "size_bytes": len(content)
            }
            
        finally:
            # Clean up temp file
            if temp_path.exists():
                temp_path.unlink()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/documents")
async def list_documents():
    """
    Get list of all uploaded documents in the knowledge base
    """
    try:
        from agent.knowledge_base import get_knowledge_base
        
        kb = get_knowledge_base()
        documents = kb.list_documents()
        
        return {
            "status": "success",
            "count": len(documents),
            "documents": documents
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {str(e)}")


@app.delete("/api/documents/{filename}")
async def delete_document(filename: str):
    """
    Delete a document from the knowledge base
    """
    try:
        from agent.knowledge_base import get_knowledge_base
        
        kb = get_knowledge_base()
        success = kb.delete_document(filename)
        
        if not success:
            raise HTTPException(status_code=404, detail=f"Document '{filename}' not found")
        
        return {
            "status": "success",
            "message": f"Document '{filename}' deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")


@app.get("/api/portfolio")
async def get_portfolio(user_id: Optional[str] = None):
    """Get portfolio holdings and summary"""
    try:
        # Check if we should use mock data
        use_mock = os.getenv("USE_MOCK_DATA", "false").lower() == "true"
        
        if not use_mock:
            try:
                aa_client = get_aa_client()
                if not user_id:
                    user_id = aa_client.get_first_user_id()
                investments = aa_client.get_investments(user_id=user_id)
                
                # Transform data
                transformed = AATransformer.transform_investments(investments)
                
                # Format for frontend
                stocks = []
                for s in transformed['stocks']:
                    gain = s['current_value'] - (s['quantity'] * s['purchase_price'])
                    stocks.append({
                        "ticker": s['ticker'],
                        "company": s['company'],
                        "shares": s['quantity'],
                        "avgCost": s['purchase_price'],
                        "current": s['current_price'],
                        "value": s['current_value'],
                        "gain": gain,
                        "gain_pct": (gain / (s['quantity'] * s['purchase_price']) * 100) if s['quantity'] > 0 else 0
                    })
                    
                funds = []
                for m in transformed['mutual_funds']:
                    gain = m['current_value'] - m['cost_basis']
                    funds.append({
                        "name": m['fund_name'],
                        "category": m['category'],
                        "units": m['units'],
                        "purchaseNAV": m['purchase_nav'],
                        "currentNAV": m['current_nav'],
                        "value": m['current_value'],
                        "gain": gain,
                        "gain_pct": (gain / m['cost_basis'] * 100) if m['cost_basis'] > 0 else 0
                    })
                    
                return {
                    "status": "success",
                    "stocks": stocks,
                    "funds": funds,
                    "fixed_deposits": transformed['fixed_deposits'],
                    "recurring_deposits": transformed['recurring_deposits'],
                    "cash": transformed['cash'],
                }
            except Exception as e:
                print(f"Error fetching AA portfolio: {e}")
                use_mock = True
        
        if use_mock:
            from data.mock_portfolio import STOCK_HOLDINGS, MUTUAL_FUND_HOLDINGS, CASH_POSITION, FIXED_DEPOSITS, RECURRING_DEPOSITS
            
            # Convert DataFrames to list of dicts
            stocks = STOCK_HOLDINGS.to_dict(orient='records')
            funds = MUTUAL_FUND_HOLDINGS.to_dict(orient='records')
            
            # Calculate current values for stocks
            for stock in stocks:
                # Use enriched current_price if available, else calculate
                if 'current_price' in stock:
                    stock['current'] = stock['current_price']
                else:
                    stock['current'] = stock['purchase_price'] * 1.12
                    
                stock['value'] = stock['quantity'] * stock['current']
                stock['gain'] = stock['value'] - (stock['quantity'] * stock['purchase_price'])
                
                # Frontend compatibility
                stock['shares'] = stock['quantity']
                stock['avgCost'] = stock['purchase_price']

            for fund in funds:
                if 'current_nav' in fund:
                    fund['currentNAV'] = fund['current_nav']
                else:
                    fund['currentNAV'] = fund['purchase_nav'] * 1.08
                    
                fund['value'] = fund['units'] * fund['currentNAV']
                fund['gain'] = fund['value'] - (fund['units'] * fund['purchase_nav'])
                fund['purchaseNAV'] = fund['purchase_nav']
                fund['name'] = fund['fund_name']

            return {
                "status": "success",
                "stocks": stocks,
                "funds": funds,
                "fixed_deposits": FIXED_DEPOSITS,
                "recurring_deposits": RECURRING_DEPOSITS,
                "cash": CASH_POSITION,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/transactions")
async def get_transactions(user_id: Optional[str] = None):
    """Get transaction history"""
    try:
        # Check if we should use mock data
        use_mock = os.getenv("USE_MOCK_DATA", "false").lower() == "true"
        
        if not use_mock:
            try:
                aa_client = get_aa_client()
                if not user_id:
                    user_id = aa_client.get_first_user_id()
                
                # Fetch last 90 days
                from datetime import datetime, timedelta
                end_date = datetime.now()
                start_date = end_date - timedelta(days=90)
                
                aa_txns = aa_client.get_transactions(
                    user_id=user_id,
                    from_date=start_date.strftime("%Y-%m-%d"),
                    to_date=end_date.strftime("%Y-%m-%d"),
                    limit=200
                )
                
                # Transform to DataFrame then to dict for consistency
                df = AATransformer.transform_transactions(aa_txns)
                
                # Sort by date desc
                if not df.empty:
                    df = df.sort_values('date', ascending=False)
                    # Convert timestamps to string for JSON
                    df['date'] = df['date'].dt.strftime('%Y-%m-%d')
                    
                    # Replace NaN with None
                    df = df.astype(object).where(pd.notnull(df), None)
                    transactions = df.to_dict(orient='records')
                else:
                    transactions = []
                
                return {
                    "status": "success",
                    "transactions": transactions
                }
            except Exception as e:
                print(f"Error fetching AA transactions: {e}")
                use_mock = True

        if use_mock:
            from data.mock_transactions import TRANSACTION_HISTORY
            
            # Convert DataFrame to list of dicts
            # Sort by date desc
            df = TRANSACTION_HISTORY.sort_values('date', ascending=False)
            
            # Replace NaN with None for JSON serialization
            # Must cast to object first to allow None in float columns
            df = df.astype(object).where(pd.notnull(df), None)
            
            transactions = df.to_dict(orient='records')
            
            return {
                "status": "success",
                "transactions": transactions
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/notifications")
async def get_notifications():
    """Get unread proactive notifications from the agent"""
    try:
        manager = get_agent_manager()
        messages = manager.get_unread_messages()
        return {
            "status": "success",
            "count": len(messages),
            "messages": messages
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/optimize-spending")
async def optimize_spending_endpoint(request: OptimizeSpendingRequest):
    """
    Optimize spending for a specific transaction
    """
    try:
        # optimize_spending is a LangChain StructuredTool, so we must call .run()
        result = optimize_spending.run({
            "product_name": request.product_name,
            "price": request.price,
            "category": request.category,
            "website": request.website
        })
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run the server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=Config.PORT,
        reload=True
    )
