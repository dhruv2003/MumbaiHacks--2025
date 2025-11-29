"""
Mock Indian user profile for the AI Relationship Manager
"""

USER_PROFILE = {
    "name": "Madhav Patel",
    "age": 28,
    "email": "madhav.patel@example.com",
    "pan": "ABCDE1234F",
    "kyc_status": "Verified",

    # -------------------------------
    # FINANCIAL GOALS (India-specific)
    # -------------------------------
    "financial_goals": [
        "Build a ₹6,00,000 emergency fund by Dec 2025",
        "Save ₹25,00,000 for home down payment in 4 years",
        "Grow long-term investment corpus to ₹3 crore by age 50",
        "Generate passive income of ₹30,000/month via dividends + SIPs + fixed income",
        "Invest consistently ₹25,000/month in SIPs to reach FIRE (Financial Independence)",
    ],

    "risk_tolerance": "moderate",
    "investment_horizon": "long-term",

    # -------------------------------
    # INCOME (Indian salary structure)
    # -------------------------------
    "income": {
        "monthly_salary": 145000,          # In-hand after taxes
        "bonus_annual": 300000,            # Annual bonus typical in Indian IT/finance
        "other_income": 8000,              # Freelance/side income
        "tax_regime": "new",               # old / new
    },

    # -------------------------------
    # EXPENSES (India cost structure)
    # -------------------------------
    "expenses": {
        "monthly_budget": 90000,
        "categories": {
            "rent": 28000,
            "transportation": 3500,
            "groceries": 8000,
            "food_delivery": 5000,
            "dining_out": 3000,
            "entertainment": 2500,
            "utilities": 3500,
            "insurance": 6000,         # term + health + motor
            "subscriptions": 1200,
            "personal_care": 2500,
            "shopping": 7000,
            "miscellaneous": 15000
        }
    },

    # -------------------------------
    # 1. BANK ACCOUNT DATA (AA Enriched)
    # -------------------------------
    "bank_accounts": [
        {
            "account_number": "XXXXXX8923",
            "type": "Savings",
            "bank_name": "HDFC Bank",
            "ifsc": "HDFC0001234",
            "branch": "Koramangala, Bangalore",
            "opening_date": "2018-04-12",
            "status": "Active",
            "balance_details": {
                "current_balance": 180000.00,
                "available_balance": 180000.00,
                "amb": 165000.00,  # Average Monthly Balance
                "min_balance_req": 10000.00
            },
            "nominee_registered": "Yes"
        },
        {
            "account_number": "XXXXXX4501",
            "type": "Salary",
            "bank_name": "ICICI Bank",
            "ifsc": "ICIC0000001",
            "branch": "MG Road, Bangalore",
            "opening_date": "2021-08-01",
            "status": "Active",
            "balance_details": {
                "current_balance": 32000.00,
                "available_balance": 32000.00,
                "amb": 45000.00,
                "min_balance_req": 0.00
            },
            "nominee_registered": "Yes"
        }
    ],

    # -------------------------------
    # CREDIT PROFILE (New)
    # -------------------------------
    "credit_profile": {
        "cibil_score": 785,
        "report_summary": {
            "total_accounts": 8,
            "active_accounts": 5,
            "closed_accounts": 3,
            "total_credit_limit": 450000,
            "credit_utilization_ratio": 0.18,
            "payment_history": "100% On-time",
            "account_age": "6 years 4 months"
        },
        "monthly_income_range": "₹1.4L - ₹1.6L"
    },

    # -------------------------------
    # LIABILITIES (AA Enriched)
    # -------------------------------
    "liabilities": {
        "loans": [
            {
                "type": "Home Loan",
                "provider": "HDFC Bank",
                "account_number": "HLXXXX7890",
                "sanction_amount": 5000000,
                "principal_outstanding": 4200000,
                "interest_rate": 8.2,
                "interest_type": "Floating",
                "tenure_months": 240,
                "emi_amount": 35500,
                "next_emi_date": "2025-12-05",
                "repayment_history": "Regular"
            },
            {
                "type": "Car Loan",
                "provider": "SBI",
                "account_number": "CLXXXX2345",
                "sanction_amount": 600000,
                "principal_outstanding": 350000,
                "interest_rate": 9.5,
                "interest_type": "Fixed",
                "tenure_months": 60,
                "emi_amount": 9200,
                "next_emi_date": "2025-12-07",
                "repayment_history": "Regular"
            }
        ],

        # -------------------------------
        # 2. CREDIT CARD DATA (AA Enriched)
        # -------------------------------
        "credit_cards": {
            "total_balance": 82000,
            "utilization_rate": 0.29,
            "cards": [
                {
                    "name": "HDFC Bank Regalia",
                    "bank": "HDFC Bank",
                    "type": "Premium Travel & Lifestyle",
                    "network": "Visa Signature",
                    "card_number_masked": "XXXX-XXXX-XXXX-1234",
                    "limits": {
                        "total_limit": 150000,
                        "available_limit": 108000,
                        "cash_limit": 45000
                    },
                    "billing": {
                        "cycle_date": 15, # 15th of every month
                        "payment_due_date": 5, # 5th of next month
                        "last_statement_balance": 42000,
                        "min_amount_due": 2100
                    },
                    "fees": {
                        "joining_fee": 2500,
                        "annual_fee": 2500,
                        "apr": 39.0
                    },
                    "rewards": {
                        "points_balance": 14500, # Note: Usually not in AA, but simulated here
                        "last_redemption": "2023-11-10"
                    },
                    "key_reward_rules": [
                        "4 Reward Points per ₹150 spent",
                        "10,000 Bonus Points on ₹5L annual spend",
                        "12 Domestic Airport Lounge visits per year"
                    ]
                },
                {
                    "name": "SBI Cashback Card",
                    "bank": "SBI Card",
                    "type": "Cashback",
                    "network": "Mastercard",
                    "card_number_masked": "XXXX-XXXX-XXXX-5678",
                    "limits": {
                        "total_limit": 100000,
                        "available_limit": 75000,
                        "cash_limit": 30000
                    },
                    "billing": {
                        "cycle_date": 20,
                        "payment_due_date": 10,
                        "last_statement_balance": 25000,
                        "min_amount_due": 1250
                    },
                    "fees": {
                        "joining_fee": 999,
                        "annual_fee": 999,
                        "apr": 43.0
                    },
                    "rewards": {
                        "cashback_earned_ytd": 4500
                    },
                    "key_reward_rules": [
                        "5% Cashback on all online spends",
                        "1% Cashback on offline spends",
                        "No cashback on Rent, Wallet, Fuel"
                    ]
                },
                {
                    "name": "Axis Bank Magnus",
                    "bank": "Axis Bank",
                    "type": "Super Premium",
                    "network": "Visa Infinite",
                    "card_number_masked": "XXXX-XXXX-XXXX-9012",
                    "limits": {
                        "total_limit": 200000,
                        "available_limit": 185000,
                        "cash_limit": 60000
                    },
                    "billing": {
                        "cycle_date": 5,
                        "payment_due_date": 25,
                        "last_statement_balance": 15000,
                        "min_amount_due": 750
                    },
                    "fees": {
                        "joining_fee": 10000,
                        "annual_fee": 10000,
                        "apr": 42.0
                    },
                    "rewards": {
                        "points_balance": 28000
                    },
                    "key_reward_rules": [
                        "12 Axis eDGE Points per ₹200 spent",
                        "25,000 Bonus Points on ₹1L monthly spend",
                        "Unlimited International Lounge Access"
                    ]
                }
            ]
        }
    },

    # -------------------------------
    # INVESTMENT PREFERENCES (India-specific)
    # -------------------------------
    "investment_preferences": {
        "preferred_instruments": [
            "Equity SIPs",
            "Index Funds",
            "ELSS Tax-Saving Funds",
            "NPS Tier I & II",
            "Direct Equity (Large Cap + Mid Cap)",
            "Gold ETFs",
            "Sovereign Gold Bonds",
        ],
        "sectors": [
            "Information Technology",
            "Banking & Financial Services",
            "Pharma",
            "Renewable Energy",
            "EV & Auto Ancillaries"
        ],
        "avoid_sectors": [

        ],
        "dividend_preference": True,
        "esg_focused": True,
        "max_equity_allocation": 0.70,     # 70%
        "max_fixed_income_allocation": 0.30,
    }
}
