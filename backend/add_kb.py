
from agent.knowledge_base import get_knowledge_base
from agent.document_processor import process_document
import os

def add_only():
    print("Initializing Knowledge Base...")
    kb = get_knowledge_base()
    
    filename = "credit_card_rewards.txt"
    filepath = f"data/knowledge_base/documents/{filename}"
    
    print(f"Processing '{filename}'...")
    if os.path.exists(filepath):
        full_text, chunks = process_document(filepath, filename)
        
        print(f"Adding '{filename}' to index ({len(chunks)} chunks)...")
        kb.add_document(filename, chunks, filepath)
        print("Done!")
    else:
        print(f"Error: File {filepath} not found.")

    # Verify
    print("\n--- Verifying Query ---")
    results = kb.query("Axis Magnus travel benefits")
    if results:
        print(f"Found {len(results)} results.")
        print(f"Top result: {results[0]['content'][:100]}...")
    else:
        print("No results found.")

if __name__ == "__main__":
    add_only()
