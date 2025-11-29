
from agent.knowledge_base import get_knowledge_base

def debug_kb():
    print("Initializing Knowledge Base...")
    kb = get_knowledge_base()
    
    print("\n--- Listed Documents ---")
    docs = kb.list_documents()
    for doc in docs:
        print(f"- {doc.get('filename')} (Chunks: {doc.get('chunk_count')})")
        
    if not docs:
        print("No documents found!")
        
    print("\n--- Testing Query ---")
    query = "Axis Bank Magnus travel benefits"
    results = kb.query(query)
    
    if results:
        print(f"Found {len(results)} results for '{query}':")
        for i, res in enumerate(results):
            print(f"\nResult {i+1} (Score: {res['relevance_score']:.4f}):")
            print(res['content'][:200] + "...")
    else:
        print(f"No results found for '{query}'")

if __name__ == "__main__":
    debug_kb()
