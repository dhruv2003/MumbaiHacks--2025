"""
Agent Manager for handling multiple agents (Personal Advisor vs Gig Worker Agent).
"""

from agent.financial_agent import get_agent as get_personal_agent
from agent.gig_agent import get_gig_agent
from agent.user_manager import get_user_manager

class AgentManager:
    """
    Manages multiple agents and routes messages to the active one.
    Also handles User Context switching.
    """
    
    def __init__(self):
        self.agents = {
            "personal_advisor": get_personal_agent(),
            "gig_accountant": get_gig_agent()
        }
        self.active_agent_id = "personal_advisor"
        self.user_manager = get_user_manager()
        
    def get_active_agent(self):
        """Returns the currently active agent instance"""
        return self.agents.get(self.active_agent_id, self.agents["personal_advisor"])
    
    def set_active_agent(self, agent_id: str):
        """Switches the active agent"""
        if agent_id in self.agents:
            self.active_agent_id = agent_id
            return True
        return False
    
    def chat(self, message: str, agent_id: str = None, user_id: str = None) -> str:
        """
        Routes chat to the specified agent or the active one.
        Updates user context if user_id changes.
        """
        # 1. Handle User Switch
        if user_id and user_id != self.user_manager.active_user_id:
            print(f"🔄 Switching User to: {user_id}")
            if self.user_manager.set_active_user(user_id):
                # Update ALL agents with new user profile
                # new_profile = self.user_manager.get_active_user_profile() # Legacy
                
                for agent in self.agents.values():
                    # Re-initialize memory with new user_id to trigger AA fetch if needed
                    from agent.memory import StaticUserProfileMemory
                    
                    # We need to update the static memory instance
                    # Passing user_id triggers the fetch in __init__
                    agent.memory_manager.static_memory = StaticUserProfileMemory(user_id=user_id)
                    
                    # Clear short-term memory on user switch to avoid context leak
                    agent.memory_manager.short_term_memory.clear()

        # 2. Handle Agent Switch
        if agent_id and agent_id in self.agents:
            self.active_agent_id = agent_id
            
        agent = self.get_active_agent()
        return agent.chat(message)
        
    def get_unread_messages(self):
        """Collects unread messages from ALL agents"""
        all_messages = []
        for agent in self.agents.values():
            all_messages.extend(agent.get_unread_messages())
        return all_messages

# Singleton
_manager_instance = None

def get_agent_manager() -> AgentManager:
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = AgentManager()
    return _manager_instance
