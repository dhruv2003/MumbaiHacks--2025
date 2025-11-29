"""
Account Aggregator API Client Service

This service handles all communication with the AA API, including:
- User listing and selection
- Fetching financial data (accounts, transactions, investments, liabilities)
- Error handling and retries

UPDATED for No-Auth Mode (v2.1.0)
"""

import httpx
import os
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class AAAPIError(Exception):
    """Base exception for AA API errors"""
    pass


class AARateLimitError(AAAPIError):
    """Rate limit exceeded"""
    pass


class AAClient:
    """
    Account Aggregator API Client
    
    Handles data fetching from the AA API in No-Auth mode.
    """
    
    def __init__(self, base_url: Optional[str] = None):
        """
        Initialize AA Client
        
        Args:
            base_url: Base URL of AA API (defaults to env var AA_BASE_URL)
        """
        self.base_url = base_url or os.getenv("AA_BASE_URL", "http://localhost:3000")
        self.timeout = int(os.getenv("AA_TIMEOUT_SECONDS", "30"))
        self.max_retries = int(os.getenv("AA_MAX_RETRIES", "3"))
        
        # User cache
        self._users_cache: Optional[List[Dict]] = None
        self._users_cache_time: Optional[datetime] = None
        self._cache_ttl = timedelta(minutes=5)
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """
        Make HTTP request with retries and error handling
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint (e.g., '/api/v1/accounts')
            **kwargs: Additional arguments for httpx request
            
        Returns:
            Parsed JSON response
            
        Raises:
            AAAPIError: On API errors
        """
        url = f"{self.base_url}{endpoint}"
        kwargs.setdefault("timeout", self.timeout)
        
        for attempt in range(self.max_retries):
            try:
                with httpx.Client() as client:
                    response = client.request(method, url, **kwargs)
                    
                    # Handle error responses
                    if response.status_code == 429:
                        raise AARateLimitError("Rate limit exceeded. Please try again later.")
                    elif response.status_code >= 500:
                        if attempt < self.max_retries - 1:
                            logger.warning(f"Server error (attempt {attempt + 1}/{self.max_retries})")
                            continue
                        raise AAAPIError(f"Server error: {response.status_code}")
                    elif response.status_code >= 400:
                        try:
                            error_data = response.json() if response.text else {}
                        except:
                            error_data = {}
                        error_msg = error_data.get("error", f"HTTP {response.status_code}")
                        raise AAAPIError(f"API Error: {error_msg}")
                    
                    # Parse and return successful response
                    try:
                        data = response.json()
                    except Exception as e:
                        raise AAAPIError(f"Invalid JSON response from {endpoint}: {str(e)}")
                        
                    if not data.get("success"):
                        raise AAAPIError(data.get("error", "Unknown error"))
                    
                    return data.get("data", {})
                    
            except httpx.RequestError as e:
                if attempt < self.max_retries - 1:
                    logger.warning(f"Request failed (attempt {attempt + 1}/{self.max_retries}): {e}")
                    continue
                raise AAAPIError(f"Network error: {str(e)}")
        
        raise AAAPIError("Max retries exceeded")
    
    def list_users(self, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """
        Get list of all users
        
        Args:
            force_refresh: Force refresh cache
            
        Returns:
            List of user dicts with '_id', 'name', 'aaHandle', etc.
        """
        # Check cache
        if not force_refresh and self._users_cache and self._users_cache_time:
            if datetime.now() - self._users_cache_time < self._cache_ttl:
                logger.debug("Returning cached users list")
                return self._users_cache
        
        logger.info("Fetching users list from API")
        response = self._make_request("GET", "/api/v1/auth/users")
        
        # New response format: {"success": true, "data": {"count": 11, "users": [...]}}
        # Or sometimes just {"users": [...]} depending on implementation, but README says data.users
        
        users = response.get("users", [])
        
        # Cache results
        self._users_cache = users
        self._users_cache_time = datetime.now()
        
        logger.info(f"Found {len(users)} users")
        return users
    
    def get_first_user_id(self) -> str:
        """
        Convenience method to get the first user's _id
        
        Returns:
            User's _id (MongoDB ObjectId as string)
        """
        users = self.list_users()
        
        if users:
            return users[0]["_id"]
        
        raise AAAPIError("No users found")
    
    def get_profile(self, user_id: str) -> Dict[str, Any]:
        """
        Get user profile
        
        Args:
            user_id: User's _id (required)
            
        Returns:
            User profile data
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        return self._make_request("GET", "/api/v1/auth/profile", params={"user_id": user_id})
    
    def get_accounts(self, user_id: str) -> Dict[str, Any]:
        """
        Get all bank accounts
        
        Args:
            user_id: User's _id (required)
            
        Returns:
            Dict with 'count' and 'accounts' list
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        return self._make_request("GET", "/api/v1/accounts", params={"user_id": user_id})
    
    def get_net_worth(self, user_id: str) -> Dict[str, Any]:
        """
        Get net worth summary
        
        Args:
            user_id: User's _id (required)
            
        Returns:
            Net worth breakdown with assets and liabilities
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        return self._make_request("GET", "/api/v1/aggregated/net-worth", params={"user_id": user_id})
    
    def get_transactions(
        self,
        user_id: str,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        Get transactions
        
        Args:
            user_id: User's _id (required)
            from_date: Start date (YYYY-MM-DD)
            to_date: End date (YYYY-MM-DD)
            category: Filter by category
            limit: Results per page
            offset: Pagination offset
            
        Returns:
            Dict with transactions list and metadata
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        params = {"user_id": user_id, "limit": limit, "offset": offset}
        if from_date:
            params["from"] = from_date
        if to_date:
            params["to"] = to_date
        if category:
            params["category"] = category
        
        return self._make_request("GET", "/api/v1/aggregated/transactions", params=params)
    
    def get_investments(self, user_id: str) -> Dict[str, Any]:
        """
        Get all investments
        
        Args:
            user_id: User's _id (required)
            
        Returns:
            Investment portfolio data
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        return self._make_request("GET", "/api/v1/aggregated/investments", params={"user_id": user_id})
    
    def get_liabilities(self, user_id: str) -> Dict[str, Any]:
        """
        Get all liabilities
        
        Args:
            user_id: User's _id (required)
            
        Returns:
            Liabilities data (loans, credit cards)
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        return self._make_request("GET", "/api/v1/aggregated/liabilities", params={"user_id": user_id})
    
    def get_monthly_spending(self, user_id: str, months: int = 6) -> Dict[str, Any]:
        """
        Get monthly spending breakdown
        
        Args:
            user_id: User's _id (required)
            months: Number of months to analyze
            
        Returns:
            Monthly spending data
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        params = {"user_id": user_id}
        if months:
            params["months"] = months
        
        return self._make_request("GET", "/api/v1/aggregated/monthly-spending", params=params)
    
    def get_income_sources(self, user_id: str) -> Dict[str, Any]:
        """
        Get income sources breakdown
        
        Args:
            user_id: User's _id (required)
            
        Returns:
            Income sources data
        """
        if not user_id:
            raise AAAPIError("user_id is required")
            
        return self._make_request("GET", "/api/v1/aggregated/income-sources", params={"user_id": user_id})


# Singleton instance
_aa_client_instance: Optional[AAClient] = None


def get_aa_client(token: Optional[str] = None) -> AAClient:
    """
    Get or create the singleton AA client instance
    
    Args:
        token: Ignored in No-Auth mode, kept for compatibility
        
    Returns:
        AAClient instance
    """
    global _aa_client_instance
    
    if _aa_client_instance is None:
        _aa_client_instance = AAClient()
    
    return _aa_client_instance


def reset_aa_client():
    """Reset the singleton instance (useful for testing)"""
    global _aa_client_instance
    _aa_client_instance = None
