#!/bin/bash
# Quick Setup Script for AI Financial Relationship Manager
# Run this script to set up a new environment

set -e  # Exit on error

echo "🚀 AI Financial Relationship Manager - Environment Setup"
echo "========================================================"

# Check Python version
echo ""
echo "📋 Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "   Found: Python $PYTHON_VERSION"

if ! python3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)"; then
    echo "   ❌ Error: Python 3.10+ required"
    exit 1
fi
echo "   ✅ Python version compatible"

# Create virtual environment
echo ""
echo "🔧 Creating virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "   ✅ Virtual environment created"
else
    echo "   ℹ️  Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "🔌 Activating virtual environment..."
source .venv/bin/activate
echo "   ✅ Virtual environment activated"

# Upgrade pip
echo ""
echo "📦 Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1
echo "   ✅ pip upgraded"

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
echo "   This may take a few minutes..."
pip install -r requirements.txt > /dev/null 2>&1
echo "   ✅ Dependencies installed"

# Create .env file if it doesn't exist
echo ""
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "   ✅ .env file created"
    echo "   ⚠️  IMPORTANT: Edit .env and add your API key(s)"
else
    echo "ℹ️  .env file already exists"
fi

# Verify installation
echo ""
echo "🧪 Verifying installation..."
python3 -c "import langchain, fastapi, pandas; print('   ✅ Core packages loaded successfully')" || {
    echo "   ❌ Package verification failed"
    exit 1
}

# Check for API keys
echo ""
echo "🔑 Checking API keys..."
python3 << EOF
import os
from dotenv import load_dotenv
load_dotenv()

google_key = os.getenv('GOOGLE_API_KEY')
openai_key = os.getenv('OPENAI_API_KEY')

if google_key and google_key != 'your_google_api_key_here':
    print('   ✅ Google API key found')
elif openai_key and openai_key != 'your_openai_api_key_here':
    print('   ✅ OpenAI API key found')
else:
    print('   ⚠️  No API key configured in .env')
    print('   Please edit .env and add your GOOGLE_API_KEY or OPENAI_API_KEY')
EOF

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API key (if not done already)"
echo "2. Activate the virtual environment: source .venv/bin/activate"
echo "3. Run the server: python3 main.py"
echo "4. Open http://localhost:8000 in your browser"
echo ""
echo "For more details, see ENVIRONMENT.md"
