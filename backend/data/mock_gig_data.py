"""
Mock Data for Gig Worker User (Raju - Delivery Partner)
"""
from datetime import datetime, timedelta
import random

# 1. User Profile
# 1. User Profile
GIG_USER_PROFILE = {
    "id": "gig_user_001",
    "name": "Raju Kumar",
    "age": 28,
    "email": "raju.kumar@example.com",
    "occupation": "Delivery Partner (Swiggy/Zomato/Uber)",
    "location": "Bangalore, India",
    
    # -------------------------------
    # FINANCIAL GOALS
    # -------------------------------
    "financial_goals": [
        "Build emergency fund of ₹20,000 (Current: ₹2,000)",
        "Pay off personal loan in 6 months",
        "Buy a new electric scooter in 2 years"
    ],

    "risk_tolerance": "conservative",
    "investment_horizon": "short-term",

    # -------------------------------
    # INCOME
    # -------------------------------
    "income": {
        "monthly_salary": 24000, # Approx avg
        "avg_daily_earnings": 800,
        "type": "irregular",
        "primary_sources": ["Food Delivery", "Bike Taxi"],
        "tax_regime": "new"
    },

    # -------------------------------
    # EXPENSES
    # -------------------------------
    "expenses": {
        "monthly_budget": 18000,
        "daily_burn_rate": 350,
        "categories": {
            "rent": 5000,
            "food": 4500,
            "fuel": 6000,
            "maintenance": 1000,
            "mobile_data": 500,
            "miscellaneous": 1000
        }
    },

    # -------------------------------
    # LIABILITIES
    # -------------------------------
    "liabilities": {
        "bike_loan": {
            "balance": 40000,
            "monthly_payment": 2500,
            "interest_rate": 14,
            "remaining_term_months": 18
        },
        "personal_loan": {
            "balance": 15000,
            "monthly_payment": 1000,
            "interest_rate": 18,
            "remaining_term_months": 15
        },
        "credit_cards": {
            "total_balance": 0,
            "utilization_rate": 0,
            "cards": []
        }
    },

    # -------------------------------
    # INVESTMENT PREFERENCES
    # -------------------------------
    "investment_preferences": {
        "preferred_instruments": [
            "Recurring Deposit (RD)",
            "Gold",
            "Government Schemes (PMJJBY)"
        ],
        "sectors": [],
        "avoid_sectors": ["Crypto", "Stocks"],
        "max_equity_allocation": 0.10,
        "max_fixed_income_allocation": 0.90
    }
}

# 2. Income History (Last 30 Days) - Irregular
# Simulating: Weekends are high, Weekdays are lower, some days off
GIG_INCOME_HISTORY = []
start_date = datetime.now() - timedelta(days=30)

for i in range(30):
    current_date = start_date + timedelta(days=i)
    is_weekend = current_date.weekday() >= 5
    
    # Randomly skip some days (sick/rest)
    if random.random() < 0.1: 
        amount = 0
        source = "Off Day"
    else:
        base = 1000 if is_weekend else 600
        variation = random.randint(-100, 200)
        amount = base + variation
        source = "Platform Earnings"
        
    GIG_INCOME_HISTORY.append({
        "date": current_date.strftime("%Y-%m-%d"),
        "amount": amount,
        "source": source,
        "hours_worked": 0 if amount == 0 else random.randint(6, 12)
    })

# 3. Expense History (Last 30 Days)
GIG_EXPENSE_HISTORY = []

for day in GIG_INCOME_HISTORY:
    date = day['date']
    earnings = day['amount']
    
    if earnings > 0:
        # Fuel is roughly 30% of earnings
        fuel = int(earnings * 0.3) + random.randint(-20, 20)
        GIG_EXPENSE_HISTORY.append({
            "date": date,
            "category": "Fuel",
            "amount": fuel,
            "description": "Petrol"
        })
        
        # Food
        food = random.randint(100, 200)
        GIG_EXPENSE_HISTORY.append({
            "date": date,
            "category": "Food",
            "amount": food,
            "description": "Lunch/Snacks"
        })
    
    # Random Maintenance
    if random.random() < 0.05: # 5% chance
        GIG_EXPENSE_HISTORY.append({
            "date": date,
            "category": "Maintenance",
            "amount": random.randint(300, 1500),
            "description": "Bike Repair/Oil Change"
        })

# 4. Helper to get JSON strings for tools
def get_gig_data_json():
    import json
    return {
        "profile": json.dumps(GIG_USER_PROFILE),
        "income_history": json.dumps(GIG_INCOME_HISTORY),
        "expense_history": json.dumps(GIG_EXPENSE_HISTORY)
    }
