"""
Data Transformer for AA API Responses

Transforms Account Aggregator API responses into the internal data format
used by the application. This provides a clean separation between the AA
schema and our internal schema.
"""

import pandas as pd
from typing import Dict, Any, List
from datetime import datetime


class AATransformer:
    """Transform AA API responses to internal data structures"""
    
    @staticmethod
    def transform_profile(aa_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform AA profile data to internal USER_PROFILE format
        
        Args:
            aa_data: Response from /api/v1/auth/profile
            
        Returns:
            Dict matching USER_PROFILE structure
        """
        return {
            "name": aa_data.get("name", ""),
            "age": aa_data.get("age", 0),
            "email": aa_data.get("email", ""),
            "pan": aa_data.get("pan", ""),
            "kyc_status": "Verified" if aa_data.get("kycCompleted") else "Pending",
            "mobile": aa_data.get("mobile", ""),
            "aa_handle": aa_data.get("aaHandle", ""),
            "dob": aa_data.get("dob", ""),
            
            # Financial goals - may not be in AA data, use defaults or extract
            "financial_goals": aa_data.get("financialGoals", [
                "Build emergency fund",
                "Save for retirement",
                "Invest regularly"
            ]),
            
            "risk_tolerance": aa_data.get("riskTolerance", "moderate"),
            "investment_horizon": aa_data.get("investmentHorizon", "long-term"),
        }
    
    @staticmethod
    def transform_accounts(aa_accounts: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Transform AA accounts data to internal bank_accounts format
        
        Args:
            aa_accounts: Response from /api/v1/accounts
            
        Returns:
            List of bank account dicts
        """
        accounts = aa_accounts.get("accounts", [])
        transformed = []
        
        for account in accounts:
            # Only process DEPOSIT type accounts (savings/current)
            if account.get("type") != "DEPOSIT":
                continue
                
            transformed.append({
                "account_number": account.get("maskedAccNumber", "XXXXXXXX"),
                "type": account.get("accountType", "Savings"),
                "bank_name": account.get("fipName", "Unknown Bank"),
                "ifsc": account.get("ifscCode", ""),
                "branch": account.get("branch", ""),
                "opening_date": account.get("openingDate", ""),
                "status": account.get("status", "Active"),
                "balance_details": {
                    "current_balance": account.get("currentBalance", 0.0),
                    "available_balance": account.get("currentBalance", 0.0),
                    "amb": account.get("currentBalance", 0.0),  # Approximate
                    "min_balance_req": 0.0
                },
                "nominee_registered": "Yes"  # Assume yes
            })
        
        return transformed
    
    @staticmethod
    def transform_liabilities(aa_liabilities: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform AA liabilities data to internal format
        
        Args:
            aa_liabilities: Response from /api/v1/aggregated/liabilities
            
        Returns:
            Dict with 'loans' and 'credit_cards' keys
        """
        # API returns a flat list of liabilities
        liabilities_list = aa_liabilities.get("liabilities", [])
        
        loans_data = []
        cards_data = []
        
        for item in liabilities_list:
            l_type = item.get("type", "").upper()
            if l_type == "CREDIT_CARD":
                cards_data.append(item)
            else:
                # Assume everything else is a loan (HOME_LOAN, PERSONAL_LOAN, etc.)
                loans_data.append(item)
        
        # Transform loans
        transformed_loans = []
        for loan in loans_data:
            transformed_loans.append({
                "type": loan.get("type", "Personal Loan").replace("_", " ").title(),
                "provider": loan.get("provider", "Unknown"),
                "account_number": loan.get("id", "XXXX"), # Using ID as account number proxy
                "sanction_amount": loan.get("outstandingAmount", 0), # Using outstanding as proxy if sanction missing
                "principal_outstanding": loan.get("outstandingAmount", 0),
                "interest_rate": loan.get("interestRate", 0),
                "interest_type": "Floating", # Default
                "tenure_months": loan.get("tenure", 0),
                "emi_amount": loan.get("emiAmount", 0),
                "next_emi_date": "", # Missing
                "repayment_history": "Regular"
            })
        
        # Transform credit cards
        total_cc_balance = sum(card.get("outstandingAmount", 0) for card in cards_data)
        # Total limit not in sample, assume utilization based on some heuristic or just show balance
        # For now, let's assume limit is 2x balance if not provided, or just 0
        total_cc_limit = 0 
        utilization = 0 # Cannot calculate accurately without limit
        
        transformed_cards = []
        for card in cards_data:
            transformed_cards.append({
                "name": f"{card.get('provider', 'Unknown')} Card",
                "bank": card.get("provider", "Unknown"),
                "type": "Credit Card",
                "network": "Visa", # Default
                "card_number_masked": f"XXXX-{card.get('id', 'XXXX')[-4:]}",
                "limits": {
                    "total_limit": 0, # Missing
                    "available_limit": 0, # Missing
                    "cash_limit": 0
                },
                "billing": {
                    "cycle_date": 15,
                    "payment_due_date": 5,
                    "last_statement_balance": card.get("outstandingAmount", 0),
                    "min_amount_due": card.get("outstandingAmount", 0) * 0.05 # Est 5%
                },
                "fees": {
                    "joining_fee": 0,
                    "annual_fee": 0,
                    "apr": card.get("interestRate", 36.0)
                },
                "rewards": {
                    "points_balance": 0
                },
                "current_balance": card.get("outstandingAmount", 0)
            })
        
        return {
            "loans": transformed_loans,
            "credit_cards": {
                "total_balance": total_cc_balance,
                "utilization_rate": utilization,
                "cards": transformed_cards
            }
        }
    
    @staticmethod
    def transform_transactions(aa_transactions: Dict[str, Any]) -> pd.DataFrame:
        """
        Transform AA transactions to internal DataFrame format
        
        Args:
            aa_transactions: Response from /api/v1/aggregated/transactions
            
        Returns:
            pandas DataFrame with transaction history
        """
        transactions = aa_transactions.get("transactions", [])
        
        if not transactions:
            return pd.DataFrame()
        
        # Transform to list of dicts
        transformed = []
        for txn in transactions:
            transformed.append({
                "date": txn.get("date", ""),
                "category": txn.get("category", "Other"),
                "merchant": txn.get("merchantName", "Unknown"),
                "amount": txn.get("amount", 0.0) * (-1 if txn.get("type") == "DEBIT" else 1),
                "type": "debit" if txn.get("type") == "DEBIT" else "credit",
                "mode": txn.get("mode", "OTHER"),
                "reference_id": txn.get("referenceId", ""),
                "narrative": txn.get("narration", ""),
                "balance_after_txn": txn.get("currentBalance"),
                "account": txn.get("accountId", "")  # API returns accountId, not account object
            })
        
        # Convert to DataFrame
        df = pd.DataFrame(transformed)
        
        # Convert date column to datetime
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"])
        
        return df
    
    @staticmethod
    def transform_investments(aa_investments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform AA investments to internal format
        
        Args:
            aa_investments: Response from /api/v1/aggregated/investments
            
        Returns:
            Dict with stocks, mutual_funds, fixed_deposits, etc.
        """
        result = {
            "stocks": [],
            "mutual_funds": [],
            "fixed_deposits": [],
            "recurring_deposits": [],
            "ppf": [],
            "cash": {}
        }
        
        # The API returns a list of investments under the 'investments' key
        investments_list = aa_investments.get("investments", [])
        
        for inv in investments_list:
            inv_type = inv.get("type", "").upper()
            
            if inv_type == "MUTUAL_FUNDS":
                result["mutual_funds"].append({
                    "ticker": inv.get("id", ""), # Using ID as ticker if ISIN not present
                    "fund_name": inv.get("schemeName", ""),
                    "units": inv.get("units", 0), # Note: API sample didn't show units, might need calculation or it's missing
                    "purchase_nav": 0, # Missing in sample
                    "current_nav": 0, # Missing in sample
                    "current_value": inv.get("currentValue", 0),
                    "cost_basis": inv.get("investedAmount", 0),
                    "fund_house": inv.get("provider", ""),
                    "category": "Mutual Fund",
                    "returns_pct": inv.get("returnsPercentage", 0)
                })
                
            elif inv_type == "EQUITIES":
                result["stocks"].append({
                    "ticker": inv.get("schemeName", ""), # Using scheme name as ticker/company
                    "company": inv.get("schemeName", ""),
                    "quantity": inv.get("quantity", 0), # Missing in sample
                    "purchase_price": 0, # Missing in sample
                    "current_price": 0, # Missing in sample
                    "current_value": inv.get("currentValue", 0),
                    "cost_basis": inv.get("investedAmount", 0),
                    "exchange": "NSE",
                    "returns_pct": inv.get("returnsPercentage", 0)
                })
                
            elif inv_type == "PPF":
                result["ppf"].append({
                    "account_number": inv.get("id", ""),
                    "bank_name": inv.get("provider", ""),
                    "current_value": inv.get("currentValue", 0),
                    "invested_amount": inv.get("investedAmount", 0),
                    "returns_pct": inv.get("returnsPercentage", 0),
                    "status": inv.get("status", "ACTIVE")
                })
                
            elif inv_type == "FIXED_DEPOSITS":
                result["fixed_deposits"].append({
                    "fd_number": inv.get("id", ""),
                    "bank_name": inv.get("provider", ""),
                    "principal_amount": inv.get("investedAmount", 0),
                    "current_value": inv.get("currentValue", 0),
                    "maturity_amount": 0, # Missing
                    "interest_rate": inv.get("returnsPercentage", 0), # Using returns as proxy
                    "start_date": "",
                    "maturity_date": "",
                    "payout_type": "Cumulative"
                })

        return result
    
    @staticmethod
    def transform_net_worth(aa_net_worth: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transform AA net worth data
        
        Args:
            aa_net_worth: Response from /api/v1/aggregated/net-worth
            
        Returns:
            Dict with net worth breakdown
        """
        return {
            "net_worth": aa_net_worth.get("netWorth", 0),
            "total_assets": aa_net_worth.get("breakdown", {}).get("assets", {}).get("total", 0),
            "total_liabilities": aa_net_worth.get("breakdown", {}).get("liabilities", {}).get("total", 0),
            "breakdown": aa_net_worth.get("breakdown", {})
        }
