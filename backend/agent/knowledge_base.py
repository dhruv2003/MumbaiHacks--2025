"""
Document Knowledge Base
Manages uploaded policy documents using FAISS vector store for semantic search.
"""

import os
import json
import pickle
from typing import List, Dict, Tuple, Optional
from datetime import datetime
from pathlib import Path

import faiss
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore

from agent.local_embeddings import LocalEmbeddings


class DocumentKnowledgeBase:
    """
    Manages a knowledge base of uploaded documents using FAISS vector store.
    Documents are chunked, embedded, and indexed for semantic search.
    """
    
    def __init__(self, storage_dir: str = "data/knowledge_base"):
        """
        Initialize the document knowledge base.
        
        Args:
            storage_dir: Directory to store documents and FAISS index
        """
        self.storage_dir = Path(storage_dir)
        self.documents_dir = self.storage_dir / "documents"
        self.index_dir = self.storage_dir / "faiss_index"
        self.metadata_file = self.storage_dir / "metadata.json"
        
        # Create directories if they don't exist
        self.documents_dir.mkdir(parents=True, exist_ok=True)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize embeddings model
        self.embeddings = LocalEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # Initialize or load FAISS vector store
        self.vectorstore: Optional[FAISS] = None
        self.metadata: Dict = {}
        
        self._load_or_create_index()
    
    def _load_or_create_index(self):
        """Load existing FAISS index or create a new one."""
        index_path = self.index_dir / "index.faiss"
        
        if index_path.exists():
            try:
                # Load existing index
                self.vectorstore = FAISS.load_local(
                    str(self.index_dir),
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                print(f"✓ Loaded existing knowledge base index from {self.index_dir}")
            except Exception as e:
                print(f"⚠ Failed to load index: {e}. Creating new index...")
                self._create_new_index()
        else:
            self._create_new_index()
        
        # Load metadata
        if self.metadata_file.exists():
            with open(self.metadata_file, 'r') as f:
                self.metadata = json.load(f)
        else:
            self.metadata = {"documents": {}}
            # Save initial empty metadata
            with open(self.metadata_file, 'w') as f:
                json.dump(self.metadata, f, indent=2)
        
        # Auto-index sample policy documents if knowledge base is empty
        self._auto_index_sample_documents()
    
    def _create_new_index(self):
        """Create a new empty FAISS index."""
        # Create empty FAISS index
        dimension = self.embeddings.dimension
        index = faiss.IndexFlatL2(dimension)
        
        self.vectorstore = FAISS(
            embedding_function=self.embeddings,
            index=index,
            docstore=InMemoryDocstore({}),
            index_to_docstore_id={}
        )
        print(f"✓ Created new knowledge base index ({dimension}D)")
    
    def add_document(
        self,
        filename: str,
        chunks: List[Tuple[str, dict]],
        original_path: str
    ) -> None:
        """
        Add a document to the knowledge base.
        
        Args:
            filename: Name of the document
            chunks: List of (chunk_text, metadata) tuples
            original_path: Path to the original uploaded file
        """
        try:
            # Prepare texts and metadatas for FAISS
            texts = []
            metadatas = []
            
            for chunk_text, chunk_meta in chunks:
                texts.append(chunk_text)
                
                # Combine document metadata with chunk metadata
                full_metadata = {
                    "source": filename,
                    "upload_date": datetime.now().isoformat(),
                    **chunk_meta
                }
                metadatas.append(full_metadata)
            
            # Add to FAISS vectorstore
            if len(self.vectorstore.index_to_docstore_id) == 0:
                # First document - create from documents
                self.vectorstore = FAISS.from_texts(
                    texts=texts,
                    embedding=self.embeddings,
                    metadatas=metadatas
                )
            else:
                # Add to existing vectorstore
                self.vectorstore.add_texts(
                    texts=texts,
                    metadatas=metadatas
                )
            
            # Update metadata registry
            self.metadata["documents"][filename] = {
                "filename": filename,
                "upload_date": datetime.now().isoformat(),
                "chunk_count": len(chunks),
                "original_path": original_path
            }
            
            # Persist to disk
            self.save_to_disk()
            
            print(f"✓ Added '{filename}' to knowledge base ({len(chunks)} chunks)")
            
        except Exception as e:
            raise Exception(f"Failed to add document to knowledge base: {str(e)}")
    
    def query(self, question: str, k: int = 3) -> List[Dict]:
        """
        Query the knowledge base for relevant document chunks.
        
        Args:
            question: The question to search for
            k: Number of top results to return
            
        Returns:
            List of dictionaries with 'content' and 'metadata' keys
        """
        try:
            if not self.vectorstore or len(self.vectorstore.index_to_docstore_id) == 0:
                return []
            
            # Search for similar documents
            results = self.vectorstore.similarity_search_with_score(question, k=k)
            
            # Format results
            formatted_results = []
            for doc, score in results:
                formatted_results.append({
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                    "relevance_score": float(score)
                })
            
            return formatted_results
            
        except Exception as e:
            print(f"⚠ Knowledge base query failed: {e}")
            return []
    
    def list_documents(self) -> List[Dict]:
        """
        Get list of all documents in the knowledge base.
        
        Returns:
            List of document metadata dictionaries
        """
        return list(self.metadata.get("documents", {}).values())
    
    def delete_document(self, filename: str) -> bool:
        """
        Remove a document from the knowledge base.
        
        Note: FAISS doesn't support deletion easily, so we rebuild the index
        without the deleted document's chunks.
        
        Args:
            filename: Name of the document to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if filename not in self.metadata.get("documents", {}):
                return False
            
            # Get all documents except the one to delete
            all_docs_data = []
            
            if self.vectorstore:
                # Iterate through all documents in the vectorstore
                for doc_id in self.vectorstore.index_to_docstore_id.values():
                    doc = self.vectorstore.docstore.search(doc_id)
                    if doc and doc.metadata.get("source") != filename:
                        all_docs_data.append((doc.page_content, doc.metadata))
            
            # Rebuild the index without the deleted document
            if all_docs_data:
                texts = [text for text, _ in all_docs_data]
                metadatas = [meta for _, meta in all_docs_data]
                
                self.vectorstore = FAISS.from_texts(
                    texts=texts,
                    embedding=self.embeddings,
                    metadatas=metadatas
                )
            else:
                # No documents left, create empty index
                self._create_new_index()
            
            # Remove from metadata
            del self.metadata["documents"][filename]
            
            # Delete original file if it exists
            doc_path = self.documents_dir / filename
            if doc_path.exists():
                doc_path.unlink()
            
            # Save changes
            self.save_to_disk()
            
            print(f"✓ Deleted '{filename}' from knowledge base")
            return True
            
        except Exception as e:
            print(f"⚠ Failed to delete document: {e}")
            return False
    
    def _auto_index_sample_documents(self):
        """
        Automatically index sample policy documents if knowledge base is empty.
        Looks for .txt files in data/knowledge_base/documents/ folder.
        """
        # Only auto-index if no documents exist yet
        if len(self.metadata.get("documents", {})) > 0:
            return
        
        # Check if documents folder has any .txt files
        txt_files = list(self.documents_dir.glob("*.txt"))
        
        if not txt_files:
            print("ℹ️ No sample policy documents found in documents/ folder")
            return
        
        print(f"📚 Auto-indexing {len(txt_files)} sample policy documents...")
        
        from agent.document_processor import process_document
        
        for txt_file in txt_files:
            try:
                # Process the document
                full_text, chunks = process_document(str(txt_file), txt_file.name)
                
                # Add to knowledge base
                self.add_document(txt_file.name, chunks, str(txt_file))
                
            except Exception as e:
                print(f"⚠ Failed to auto-index {txt_file.name}: {e}")
    
    def save_to_disk(self):
        """Persist the FAISS index and metadata to disk."""
        try:
            if self.vectorstore:
                self.vectorstore.save_local(str(self.index_dir))
            
            with open(self.metadata_file, 'w') as f:
                json.dump(self.metadata, f, indent=2)
            
        except Exception as e:
            print(f"⚠ Failed to save knowledge base: {e}")


# Global knowledge base instance
_knowledge_base = None

def get_knowledge_base() -> DocumentKnowledgeBase:
    """Get or create the global knowledge base instance."""
    global _knowledge_base
    if _knowledge_base is None:
        _knowledge_base = DocumentKnowledgeBase()
    return _knowledge_base
