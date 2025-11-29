
import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

try:
    from agent.memory import StaticUserProfileMemory
    from data.mock_user import USER_PROFILE
    
    print("Testing StaticUserProfileMemory...")
    memory = StaticUserProfileMemory(USER_PROFILE)
    context = memory.get_profile_context()
    
    print("\nGenerated Context:")
    print(context)
    
    print("\nSUCCESS: No TypeError encountered.")
    
except Exception as e:
    print(f"\nFAILURE: {e}")
    import traceback
    traceback.print_exc()
