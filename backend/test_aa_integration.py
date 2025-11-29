"""
Test script for Account Aggregator Integration
Verifies that the AA Client, Transformer, and Agent Tools work correctly.
"""
import os
import sys
import json
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Force use of AA API (disable mock fallback for testing)
os.environ["USE_MOCK_DATA"] = "false"

def test_aa_client():
    print("\n--- Testing AA Client ---")
    try:
        from services import get_aa_client
        client = get_aa_client()
        
        # Test 1: List Users
        print("1. Listing users...")
        users = client.list_users(force_refresh=True)
        print(f"   Found {len(users)} users")
        if not users:
            print("   FAIL: No users found")
            return False
            
        first_user_id = client.get_first_user_id()
        print(f"   Target User ID: {first_user_id}")
        
        # Test 2: Get Profile
        print("2. Fetching profile...")
        profile = client.get_profile(user_id=first_user_id)
        print(f"   Name: {profile.get('name')}")
        
        # Test 3: Get Accounts
        print("3. Fetching accounts...")
        accounts = client.get_accounts(user_id=first_user_id)
        print(f"   Account Count: {accounts.get('count')}")
        
        return True
    except Exception as e:
        print(f"   FAIL: {e}")
        return False

def test_transformer():
    print("\n--- Testing Data Transformer ---")
    try:
        from services import AATransformer, get_aa_client
        client = get_aa_client()
        user_id = client.get_first_user_id()
        
        # Fetch raw data
        aa_profile = client.get_profile(user_id=user_id)
        aa_accounts = client.get_accounts(user_id=user_id)
        
        # Transform
        profile = AATransformer.transform_profile(aa_profile)
        accounts = AATransformer.transform_accounts(aa_accounts)
        
        print(f"   Transformed Name: {profile['name']}")
        print(f"   Transformed Accounts: {len(accounts)}")
        
        if 'financial_goals' in profile and len(accounts) > 0:
            print("   PASS: Transformation successful")
            return True
        else:
            print("   FAIL: Transformation incomplete")
            return False
            
    except Exception as e:
        print(f"   FAIL: {e}")
        return False

def test_agent_memory():
    print("\n--- Testing Agent Memory ---")
    try:
        from agent.memory import StaticUserProfileMemory
        
        memory = StaticUserProfileMemory()
        context = memory.get_profile_context()
        
        print("   Context Preview:")
        print("\n".join(context.split("\n")[:10]))
        
        if "USER PROFILE (STATIC)" in context and "Bank Accounts:" in context:
            print("   PASS: Memory context generated")
            return True
        else:
            print("   FAIL: Invalid context format")
            return False
            
    except Exception as e:
        print(f"   FAIL: {e}")
        return False

if __name__ == "__main__":
    print("Starting Integration Tests...")
    
    if test_aa_client():
        if test_transformer():
            test_agent_memory()
            
    print("\nTests Completed.")
