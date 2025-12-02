"""
User Manager for handling multiple user profiles.
"""

from data.mock_user import USER_PROFILE as PERSONAL_PROFILE
from data.mock_gig_data import GIG_USER_PROFILE

class UserManager:
    """
    Manages available user profiles.
    """
    
    def __init__(self):
        self.users = {
            "personal_user": {
                "id": "personal_user",
                "name": "Madhav Patel",
                "role": "IT Professional",
                "profile": PERSONAL_PROFILE
            },
            "gig_user": {
                "id": "gig_user",
                "name": "Raju Kumar",
                "role": "Delivery Partner",
                "profile": GIG_USER_PROFILE
            }
        }
        self.active_user_id = "personal_user"
        self._load_aa_users()
        
    def _load_aa_users(self):
        """Fetch users from AA API and add to internal list"""
        try:
            import os
            from services import get_aa_client
            
            # Check if we should use mock data
            if os.getenv("USE_MOCK_DATA", "false").lower() == "true":
                return

            client = get_aa_client()
            aa_users = client.list_users()
            
            for u in aa_users:
                # Add to local users dict
                # Map _id to id for internal consistency
                user_id = u.get('_id', u.get('id'))
                if not user_id:
                    continue
                    
                self.users[user_id] = {
                    "id": user_id,
                    "name": f"{u.get('name', 'Unknown')} (AA)",
                    "role": "AA User",
                    "profile": None # Will be fetched on demand
                }
        except Exception as e:
            print(f"Failed to load AA users: {e}")
        
    def get_user(self, user_id: str):
        """Returns the user object for the given ID"""
        return self.users.get(user_id, self.users["personal_user"])
    
    def get_active_user_profile(self):
        """Returns the profile of the currently active user"""
        user = self.get_user(self.active_user_id)
        if user.get("profile"):
            return user["profile"]
        
        # If profile is None (AA user), we might need to fetch it dynamically
        # But for now, the agent/memory.py handles fetching.
        # This method is mainly used by legacy code.
        return PERSONAL_PROFILE # Fallback
        
    def set_active_user(self, user_id: str):
        """Sets the active user"""
        if user_id in self.users:
            self.active_user_id = user_id
            
            # Update AA Client context if it's an AA user
            # (This is a bit of a hack, ideally passed via context)
            try:
                from services import get_aa_client
                # If it looks like an AA ID (24 chars hex usually, or just not our mock IDs)
                if user_id not in ["personal_user", "gig_user"]:
                    # We don't strictly need to set it on the client if we pass it in methods
                    # But we can store it in the manager for other components to access
                    pass
            except:
                pass
                
            return True
        return False
        
    def get_all_users(self):
        """Returns list of all users for UI"""
        # Refresh AA users list on request to pick up new ones
        self._load_aa_users()
        
        return [
            {"id": u["id"], "name": u["name"], "role": u["role"]} 
            for u in self.users.values()
        ]

# Singleton
_user_manager_instance = None

def get_user_manager() -> UserManager:
    global _user_manager_instance
    if _user_manager_instance is None:
        _user_manager_instance = UserManager()
    return _user_manager_instance
