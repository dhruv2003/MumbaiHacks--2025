"""
Mock transaction history data adapted for Indian market with Account Aggregator richness
"""

import pandas as pd
from datetime import datetime, timedelta
import random
import uuid

from data.mock_user import USER_PROFILE

# -------------------------------
# INDIAN MARKET TRANSACTION GENERATOR (AA Enriched)
# -------------------------------

def generate_transactions():
    """Generate realistic Indian transaction data for the past 120 days with AA richness"""

    transactions = []
    current_date = datetime.now()
    
    # Get user's cards and accounts
    user_cards = [card['name'] for card in USER_PROFILE['liabilities']['credit_cards']['cards']]
    bank_accounts = [acc['bank_name'] + " - " + acc['account_number'][-4:] for acc in USER_PROFILE['bank_accounts']]
    
    # Starting balance simulation
    running_balance = 245000.00 

    # Indian spending templates with AA specific modes
    transaction_templates = [
        # Food Delivery
        {
            "category": "Food Delivery", 
            "merchants": ["Swiggy", "Zomato", "Dominos", "KFC"], 
            "amount_range": (120, 850),
            "modes": ["UPI", "Credit Card"],
            "narrative_template": "UPI-SWIGGY-{ref}"
        },
        
        # Groceries
        {
            "category": "Groceries", 
            "merchants": ["BigBasket", "Reliance Fresh", "DMart", "JioMart"], 
            "amount_range": (300, 2500),
            "modes": ["UPI", "Debit Card", "Credit Card"],
            "narrative_template": "POS-{merchant}-{ref}"
        },
        
        # Dining Out
        {
            "category": "Dining", 
            "merchants": ["Barbeque Nation", "Cream Centre", "Cafe Coffee Day", "Local Restaurant"], 
            "amount_range": (250, 1800),
            "modes": ["Credit Card", "UPI"],
            "narrative_template": "POS-{merchant}-{ref}"
        },
        
        # Transportation
        {
            "category": "Transportation", 
            "merchants": ["Ola", "Uber", "Metro Card Recharge", "Auto Fare"], 
            "amount_range": (60, 450),
            "modes": ["UPI", "Wallet"],
            "narrative_template": "UPI-{merchant}-{ref}"
        },
        
        # Utilities
        {
            "category": "Utilities", 
            "merchants": ["BESCOM Electricity", "Indane Gas", "Airtel Broadband", "JioFiber"], 
            "amount_range": (500, 2500),
            "modes": ["UPI", "Credit Card"],
            "narrative_template": "BILLPAY-{merchant}-{ref}"
        },
        
        # Shopping
        {
            "category": "Shopping", 
            "merchants": ["Amazon India", "Flipkart", "Myntra", "Ajio"], 
            "amount_range": (250, 4000),
            "modes": ["Credit Card", "UPI", "Net Banking"],
            "narrative_template": "ECOM-{merchant}-{ref}"
        },
        
        # UPI Payments (P2P)
        {
            "category": "UPI Transfer", 
            "merchants": ["Ramesh (Driver)", "Suresh (Shop)", "Maid Salary", "Friend"], 
            "amount_range": (50, 2000),
            "modes": ["UPI"],
            "narrative_template": "UPI-P2P-{merchant}-{ref}"
        },
        
        # Subscriptions
        {
            "category": "Subscriptions", 
            "merchants": ["Netflix India", "Spotify", "Sony LIV", "Hotstar"], 
            "amount_range": (99, 699),
            "modes": ["Credit Card"],
            "narrative_template": "SI-{merchant}-{ref}"
        },
        
        # Fuel
        {
            "category": "Fuel", 
            "merchants": ["Indian Oil", "HP Petrol Pump", "BPCL Petrol"], 
            "amount_range": (500, 2500),
            "modes": ["Credit Card", "UPI"],
            "narrative_template": "POS-FUEL-{merchant}-{ref}"
        },
        
        # Healthcare
        {
            "category": "Healthcare", 
            "merchants": ["PharmEasy", "Apollo Pharmacy", "Hospital Visit"], 
            "amount_range": (150, 2500),
            "modes": ["UPI", "Credit Card"],
            "narrative_template": "POS-MED-{merchant}-{ref}"
        },
        
        # EMI
        {
            "category": "Loan EMI", 
            "merchants": ["HDFC Home Loan", "SBI Car Loan"], 
            "amount_range": (9200, 35500),
            "modes": ["NACH/ECS"],
            "narrative_template": "ACH-DEBIT-{merchant}-{ref}"
        }
    ]

    # Generate 120 days of transactions
    # We generate in reverse (newest first) but calculate balance forward
    # So let's generate chronologically first then sort
    
    chronological_txns = []
    
    start_date = current_date - timedelta(days=120)
    
    for day_offset in range(120):
        txn_date = start_date + timedelta(days=day_offset)
        
        # 1. Salary Credit (1st of month)
        if txn_date.day == 1:
            amount = 145000
            running_balance += amount
            chronological_txns.append({
                "date": txn_date.strftime("%Y-%m-%d"),
                "category": "Income",
                "merchant": "Tech Corp India Pvt Ltd",
                "amount": amount,
                "type": "credit",
                "mode": "NEFT",
                "reference_id": f"SAL{uuid.uuid4().hex[:8].upper()}",
                "narrative": "SALARY CREDIT - OCT 2024",
                "balance_after_txn": running_balance,
                "account": bank_accounts[0] # Primary
            })

        # 2. Rent Payment (3rd of month)
        if txn_date.day == 3:
            amount = 28000
            running_balance -= amount
            chronological_txns.append({
                "date": txn_date.strftime("%Y-%m-%d"),
                "category": "Rent",
                "merchant": "Landlord UPI",
                "amount": -amount,
                "type": "debit",
                "mode": "UPI",
                "reference_id": f"UPI{uuid.uuid4().hex[:12].upper()}",
                "narrative": "UPI-RENT-PAYMENT",
                "balance_after_txn": running_balance,
                "account": bank_accounts[0]
            })

        # 3. Random Daily Transactions
        num_transactions = random.randint(1, 4)
        for _ in range(num_transactions):
            template = random.choice(transaction_templates)
            merchant = random.choice(template["merchants"])
            amount = round(random.uniform(*template["amount_range"]), 2)
            mode = random.choice(template["modes"])
            
            # Determine account/card used
            if mode == "Credit Card":
                account_used = random.choice(user_cards)
                # CC txns don't affect bank balance immediately, but we track them
                # For simplicity in this view, we won't deduct from running_balance 
                # unless it's a direct bank debit (UPI, Debit Card, Net Banking)
                txn_balance = None 
            else:
                account_used = bank_accounts[0]
                running_balance -= amount
                txn_balance = running_balance

            ref_id = f"{mode[:3]}{uuid.uuid4().hex[:8].upper()}"
            narrative = template["narrative_template"].format(merchant=merchant.split()[0].upper(), ref=ref_id)

            chronological_txns.append({
                "date": txn_date.strftime("%Y-%m-%d"),
                "category": template["category"],
                "merchant": merchant,
                "amount": -amount,
                "type": "debit",
                "mode": mode,
                "reference_id": ref_id,
                "narrative": narrative,
                "balance_after_txn": txn_balance,
                "account": account_used
            })

    # Sort by date desc
    chronological_txns.sort(key=lambda x: x['date'], reverse=True)
    
    # Convert to DataFrame
    df = pd.DataFrame(chronological_txns)
    df["date"] = pd.to_datetime(df["date"])
    
    return df


# Generate all transactions
TRANSACTION_HISTORY = generate_transactions()


# -------------------------------
# FILTERING FUNCTIONS
# -------------------------------

def get_transactions_by_category(category=None, days=30):
    """Filter by category + time window"""
    df = TRANSACTION_HISTORY.copy()

    cutoff = datetime.now() - timedelta(days=days)
    df = df[df["date"] >= cutoff]

    if category:
        df = df[df["category"] == category]

    return df


def get_spending_summary(days=30):
    """Return category-wise spending summary"""
    df = get_transactions_by_category(days=days)

    expenses = df[df["amount"] < 0].copy()
    expenses["amount"] = expenses["amount"].abs()

    summary = expenses.groupby("category")["amount"].agg(["sum", "count", "mean"]).round(2)
    summary.columns = ["total_spent", "num_transactions", "avg_transaction"]

    return summary.sort_values("total_spent", ascending=False)
