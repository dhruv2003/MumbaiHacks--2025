"""
Local Embeddings using Sentence Transformers
Provides offline, quota-free embeddings for the memory system.
"""

from typing import List
from langchain_core.embeddings import Embeddings


class LocalEmbeddings(Embeddings):
    """
    Local embeddings using sentence-transformers.
    No API calls, no quota limits, completely offline.
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize local embeddings model.
        
        Args:
            model_name: HuggingFace model name. Default is all-MiniLM-L6-v2
                       (lightweight, ~80MB, 384 dimensions, good quality)
        """
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(model_name)
            self.dimension = self.model.get_sentence_embedding_dimension()
            print(f"✓ Loaded local embeddings model: {model_name} ({self.dimension}D)")
        except ImportError:
            raise ImportError(
                "sentence-transformers not installed. "
                "Install with: pip install sentence-transformers"
            )
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of documents."""
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()
    
    def embed_query(self, text: str) -> List[float]:
        """Embed a single query."""
        embedding = self.model.encode([text], convert_to_numpy=True)
        return embedding[0].tolist()
