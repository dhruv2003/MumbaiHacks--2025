"""
Base Agent class for the multi-agent system.
Encapsulates common logic for LLM initialization, memory management, and tool execution.
"""

from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from agent.config import Config
from agent.memory import MemoryManager
from datetime import datetime

class BaseAgent:
    """
    Base class for all financial agents.
    """
    
    def __init__(self, tools, system_prompt, profile=None):
        """
        Initialize the agent with specific tools and system prompt.
        """
        # Get LLM from config
        self.llm = Config.get_llm()
        self.tools = tools
        
        # Initialize Hybrid Memory Manager
        self.memory_manager = MemoryManager(profile)
        
        # Create prompt for Tool Calling Agent
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"""{system_prompt}

{{static_profile}}

RELEVANT PAST CONVERSATIONS:
{{long_term_history}}"""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        # Create the agent
        self.agent = create_tool_calling_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )
        
        # Create agent executor
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=15,
            max_execution_time=60,
            return_intermediate_steps=False
        )
        
        # Message Queue for Proactive Notifications (available to all agents)
        self.message_queue = []

    def chat(self, message: str) -> str:
        """
        Process a user message and return the agent's response
        """
        try:
            # 1. Retrieve Context from Hybrid Memory
            context = self.memory_manager.get_combined_context(message)
            
            # 2. Invoke Agent with Input + Context
            inputs = {"input": message, **context}
            response = self.agent_executor.invoke(inputs)
            output = response.get("output", "I apologize, but I encountered an error processing your request.")
            
            # Handle list output (common with Gemini/Tool Calling)
            if isinstance(output, list):
                # Extract text from content blocks
                text_parts = []
                for item in output:
                    if isinstance(item, dict) and 'text' in item:
                        text_parts.append(item['text'])
                    elif isinstance(item, str):
                        text_parts.append(item)
                output = "".join(text_parts)
            
            # 3. Save Context (Short-term & Long-term)
            self.memory_manager.save_context({"input": message}, {"output": output})
            
            return output
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"

    def trigger_proactive_message(self, prompt: str, topic: str = "Notification"):
        """
        Triggers the agent to generate a message based on a system prompt.
        Stores the result in the message queue for the frontend to poll.
        """
        print(f"⚡ Triggering proactive message: {topic}")
        try:
            # Use the chat method but with the system prompt
            response = self.chat(prompt)
            
            # Check for "NO_ALERT" signal
            if "NO_ALERT" in response:
                print("  → No alert generated.")
                return

            # Add to queue
            message_obj = {
                "id": f"notif-{len(self.message_queue)}",
                "timestamp": datetime.now().isoformat(),
                "topic": topic,
                "content": response,
                "read": False
            }
            self.message_queue.append(message_obj)
            print(f"  → Notification queued: {topic}")
            
        except Exception as e:
            print(f"Error generating proactive message: {e}")

    def get_unread_messages(self) -> list:
        """Return and clear unread messages from the queue"""
        messages = [m for m in self.message_queue if not m['read']]
        # Mark as read
        for m in messages:
            m['read'] = True
        return messages

    def reset_conversation(self):
        """Clear the conversation memory"""
        self.memory_manager.short_term_memory.clear()
