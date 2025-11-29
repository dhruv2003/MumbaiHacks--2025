
import sys
import os

# Add current directory to path so we can import agent modules
sys.path.append(os.getcwd())

try:
    from agent.tools import generate_insights
    
    print("Running generate_insights()...")
    
    try:
        # Try running as a tool
        print(generate_insights.run({}))
    except Exception as e:
        print(f"Error calling .run(): {e}")
        # Try calling the underlying function directly if possible
        if hasattr(generate_insights, 'func'):
             print(generate_insights.func())
        
    print("\nSUCCESS: No TypeError encountered.")
    
except Exception as e:
    print(f"\nFAILURE: {e}")
    import traceback
    traceback.print_exc()
