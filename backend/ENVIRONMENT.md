# Environment Setup Guide

This document details the complete environment setup for the AI Financial Relationship Manager project.

## System Requirements

### Python Version
- **Python 3.11.9** (tested and confirmed working)
- Minimum: Python 3.10+
- Recommended: Python 3.11.x

### Operating System
- **Tested on**: macOS
- **Compatible with**: Linux, Windows (with minor path adjustments)

## Python Dependencies

### Core Framework
```
fastapi>=0.109.0          # Web framework for REST API
uvicorn>=0.27.0           # ASGI server
pydantic>=2.5.3           # Data validation
python-dotenv>=1.0.0      # Environment variable management
python-multipart>=0.0.6   # File upload support
httpx>=0.26.0             # HTTP client
```

### AI/ML Stack
```
langchain>=0.1.20                  # LLM orchestration framework
langchain-google-genai>=1.0.3      # Google Gemini integration
langchain-openai>=0.1.3            # OpenAI integration
langchain-community>=0.0.10        # Community tools
langchain-text-splitters>=0.0.1    # Text processing
```

### Memory & Embeddings
```
faiss-cpu>=1.7.4                   # Vector similarity search (CPU version)
sentence-transformers>=2.2.0       # Local embeddings (offline capable)
```

### Data Processing
```
pandas>=2.2.0             # Data manipulation
numpy>=1.26.3             # Numerical computing
```

### Financial Data
```
yfinance>=0.2.35          # Yahoo Finance API for stock/fund data
```

### Document Processing
```
pypdf2>=3.0.0             # PDF parsing for knowledge base
```

### Search & Discovery
```
duckduckgo-search>=6.2.0  # Web search tool
```

## Environment Variables

### Required Variables

#### LLM API Keys (One Required)
```bash
# Google Gemini (Primary)
GOOGLE_API_KEY=your_google_api_key_here

# OR OpenAI (Alternative)
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: You need at least ONE of the above API keys. The system will automatically detect which is available.

### Optional Variables

#### Pinecone (For Advanced Features)
```bash
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=financial-data
```

**When to use**: Only needed if you want to replace in-memory FAISS with cloud-based Pinecone for:
- Persistent vector storage
- Multi-user deployments
- Production-scale applications

#### Server Configuration
```bash
# Server host and port (defaults shown)
HOST=0.0.0.0
PORT=8000

# CORS settings
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

## Virtual Environment Setup

### Create Virtual Environment
```bash
# Using venv (recommended)
python3 -m venv .venv

# Activate on macOS/Linux
source .venv/bin/activate

# Activate on Windows
.venv\Scripts\activate
```

### Install Dependencies
```bash
# Install all required packages
pip install -r requirements.txt

# Verify installation
pip list
```

## Project Structure
```
.
├── agent/                  # AI agent modules
│   ├── base_agent.py      # Base agent class
│   ├── financial_agent.py # Main financial advisor
│   ├── gig_agent.py       # Gig worker specialist
│   ├── tools.py           # Financial tools
│   ├── gig_tools.py       # Gig worker tools
│   ├── memory.py          # Hybrid memory system
│   ├── config.py          # Configuration
│   └── prompts.py         # System prompts
├── data/                   # Mock data
│   ├── mock_user.py       # User profile (Madhav)
│   ├── mock_gig_data.py   # Gig worker profile (Raju)
│   ├── mock_portfolio.py  # Investment portfolio
│   └── mock_transactions.py# Transaction history
├── public/                 # Frontend
│   ├── index.html         # Web UI
│   └── app.js             # Frontend logic
├── main.py                # FastAPI server
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (gitignored)
└── .env.example           # Example environment file
```

## Configuration Files

### .env (Create this file)
```bash
# Copy from example
cp .env.example .env

# Edit with your API keys
nano .env  # or use your preferred editor
```

### .gitignore
Ensure these are ignored:
```
.env
__pycache__/
*.pyc
.venv/
venv/
.DS_Store
```

## Running the Application

### Development Mode
```bash
# Activate virtual environment
source .venv/bin/activate

# Run the server
python3 main.py
```

### Access the Application
- **Web UI**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## API Keys Setup

### Google Gemini (Recommended)
1. Visit: https://aistudio.google.com/app/apikey
2. Create new API key
3. Add to `.env`: `GOOGLE_API_KEY=your_key_here`

### OpenAI (Alternative)
1. Visit: https://platform.openai.com/api-keys
2. Create new API key
3. Add to `.env`: `OPENAI_API_KEY=your_key_here`

### Pinecone (Optional)
1. Visit: https://www.pinecone.io/
2. Create account and project
3. Create index with:
   - **Dimension**: 384 (for local embeddings) or 768 (for Google) or 1536 (for OpenAI)
   - **Metric**: cosine
4. Add to `.env`:
   ```
   PINECONE_API_KEY=your_key_here
   PINECONE_INDEX=your_index_name
   ```

## Memory System

### Default (FAISS + Local Embeddings)
- **Storage**: In-memory (resets on restart)
- **Embeddings**: sentence-transformers (offline, no API calls)
- **Model**: all-MiniLM-L6-v2 (384 dimensions)
- **Performance**: Fast, no quota limits
- **Best for**: Development, single-user, testing

### Optional (Pinecone)
- **Storage**: Cloud-based (persistent)
- **Embeddings**: Google or OpenAI (requires API keys)
- **Performance**: Scalable, production-ready
- **Best for**: Production, multi-user, deployment

## Troubleshooting

### Common Issues

#### 1. Module Not Found
```bash
# Solution: Ensure virtual environment is activated
source .venv/bin/activate
pip install -r requirements.txt
```

#### 2. API Key Errors
```bash
# Solution: Check .env file exists and contains valid keys
cat .env
# Ensure format is: GOOGLE_API_KEY=xxxxx (no quotes, no spaces)
```

#### 3. Port Already in Use
```bash
# Solution: Kill existing process or use different port
# Find process using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>
# Or change port in code
```

#### 4. FAISS Installation Issues
```bash
# On macOS with M1/M2
pip install faiss-cpu --no-cache-dir

# On Linux
apt-get install libopenblas-dev
pip install faiss-cpu
```

## Replication Guide

To replicate this environment for a new project:

### 1. Clone Environment Files
```bash
cp requirements.txt /path/to/new/project/
cp .env.example /path/to/new/project/
cp ENVIRONMENT.md /path/to/new/project/
```

### 2. Set Up New Project
```bash
cd /path/to/new/project
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

### 3. Verify Setup
```bash
# Test Python version
python3 --version

# Test package installation
python3 -c "import langchain, fastapi, pandas; print('All packages loaded successfully')"

# Test API key
python3 -c "from dotenv import load_dotenv; import os; load_dotenv(); print('API Key loaded:', bool(os.getenv('GOOGLE_API_KEY') or os.getenv('OPENAI_API_KEY')))"
```

## Performance Considerations

### Memory Usage
- **Base**: ~200MB (application only)
- **With FAISS**: ~300MB (includes embeddings)
- **With Large KB**: ~500MB+ (depends on document size)

### Recommended Resources
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 500MB for dependencies
- **CPU**: Any modern CPU (local embeddings benefit from multiple cores)

## Security Best Practices

1. **Never commit .env** to version control
2. **Rotate API keys** regularly
3. **Use environment-specific** .env files (.env.dev, .env.prod)
4. **Limit API key permissions** to required scopes only
5. **Monitor API usage** to detect anomalies

## Production Deployment

### Environment Setup
```bash
# Use production-grade ASGI server
pip install gunicorn

# Run with multiple workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Environment Variables (Production)
```bash
# Set in production environment (not in .env file)
export GOOGLE_API_KEY=xxx
export PINECONE_API_KEY=xxx
export HOST=0.0.0.0
export PORT=8000
```

## Version Compatibility

| Component | Version | Status |
|-----------|---------|--------|
| Python | 3.11.9 | ✅ Tested |
| Python | 3.10.x | ✅ Compatible |
| Python | 3.9.x | ⚠️ Not tested |
| macOS | Sonoma+ | ✅ Tested |
| Linux | Ubuntu 22+ | ✅ Compatible |
| Windows | 10/11 | ⚠️ Not tested |

## Maintenance

### Updating Dependencies
```bash
# Check for updates
pip list --outdated

# Update specific package
pip install --upgrade langchain

# Update all (carefully)
pip install --upgrade -r requirements.txt
```

### Freezing Exact Versions
```bash
# Create exact version file
pip freeze > requirements.lock

# Install from exact versions
pip install -r requirements.lock
```

---

**Last Updated**: 2025-11-29  
**Python Version**: 3.11.9  
**Project**: AI Financial Relationship Manager
