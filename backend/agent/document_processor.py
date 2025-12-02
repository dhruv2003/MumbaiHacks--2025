"""
Document Processing Utilities
Handles PDF text extraction and intelligent text chunking for knowledge base indexing.
"""

import re
from typing import List, Tuple
from datetime import datetime


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text content from a PDF file.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Extracted text as a single string
        
    Raises:
        Exception: If PDF cannot be read or processed
    """
    try:
        from PyPDF2 import PdfReader
        
        reader = PdfReader(file_path)
        text_parts = []
        
        for page_num, page in enumerate(reader.pages, 1):
            text = page.extract_text()
            if text.strip():
                text_parts.append(text)
        
        full_text = "\n\n".join(text_parts)
        print(f"✓ Extracted {len(full_text)} characters from {len(reader.pages)} pages")
        return full_text
        
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")


def extract_text_from_txt(file_path: str) -> str:
    """
    Read text content from a TXT file.
    
    Args:
        file_path: Path to the TXT file
        
    Returns:
        File content as a string
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        print(f"✓ Read {len(text)} characters from text file")
        return text
    except Exception as e:
        raise Exception(f"Failed to read text file: {str(e)}")


def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> List[Tuple[str, dict]]:
    """
    Split text into overlapping chunks for better context retrieval.
    
    Uses RecursiveCharacterTextSplitter from LangChain for intelligent splitting
    that respects sentence boundaries.
    
    Args:
        text: The text to chunk
        chunk_size: Target size for each chunk (characters)
        chunk_overlap: Number of characters to overlap between chunks
        
    Returns:
        List of tuples: (chunk_text, metadata)
    """
    try:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        
        # Create splitter that respects paragraph and sentence boundaries
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        
        chunks = splitter.split_text(text)
        
        # Add metadata to each chunk
        chunks_with_metadata = []
        for i, chunk in enumerate(chunks):
            metadata = {
                "chunk_id": i,
                "total_chunks": len(chunks),
                "chunk_size": len(chunk)
            }
            chunks_with_metadata.append((chunk, metadata))
        
        print(f"✓ Split text into {len(chunks)} chunks (avg {len(text) // len(chunks)} chars each)")
        return chunks_with_metadata
        
    except Exception as e:
        # Fallback to simple splitting if LangChain splitter fails
        print(f"⚠ LangChain splitter failed, using simple chunking: {e}")
        return _simple_chunk_text(text, chunk_size, chunk_overlap)


def _simple_chunk_text(text: str, chunk_size: int, chunk_overlap: int) -> List[Tuple[str, dict]]:
    """
    Fallback simple text chunking without dependencies.
    
    Args:
        text: The text to chunk
        chunk_size: Target size for each chunk
        chunk_overlap: Overlap between chunks
        
    Returns:
        List of tuples: (chunk_text, metadata)
    """
    chunks = []
    start = 0
    chunk_id = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        
        metadata = {
            "chunk_id": chunk_id,
            "chunk_size": len(chunk)
        }
        
        chunks.append((chunk, metadata))
        start = end - chunk_overlap
        chunk_id += 1
    
    return chunks


def process_document(file_path: str, filename: str) -> Tuple[str, List[Tuple[str, dict]]]:
    """
    Process a document: extract text and chunk it.
    
    Args:
        file_path: Path to the document file
        filename: Original filename (used to determine type)
        
    Returns:
        Tuple of (full_text, chunks_with_metadata)
    """
    # Determine file type and extract text
    if filename.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    elif filename.lower().endswith('.txt'):
        text = extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {filename}")
    
    # Chunk the text
    chunks = chunk_text(text)
    
    return text, chunks
