"""
Mock Indian portfolio data with stock and mutual fund holdings
"""

import pandas as pd
from datetime import datetime, timedelta

# -------------------------------
# 🇮🇳 INDIAN STOCK HOLDINGS (AA Enriched)
# -------------------------------

STOCK_HOLDINGS = pd.DataFrame([
    {
        "ticker": "RELIANCE",
        "isin": "INE002A01018",
        "exchange": "NSE",
        "company": "Reliance Industries Ltd.",
        "quantity": 40,
        "purchase_price": 2420.50,
        "current_price": 2750.00, # Mock current
        "purchase_date": "2023-06-10",
        "sector": "Conglomerate",
        "pledged_quantity": 0
    },
    {
        "ticker": "TCS",
        "isin": "INE467B01029",
        "exchange": "NSE",
        "company": "Tata Consultancy Services Ltd.",
        "quantity": 25,
        "purchase_price": 3350.25,
        "current_price": 3800.00,
        "purchase_date": "2023-09-12",
        "sector": "Information Technology",
        "pledged_quantity": 0
    },
    {
        "ticker": "HDFCBANK",
        "isin": "INE040A01034",
        "exchange": "NSE",
        "company": "HDFC Bank Ltd.",
        "quantity": 60,
        "purchase_price": 1538.40,
        "current_price": 1650.00,
        "purchase_date": "2024-01-20",
        "sector": "Banking & Financial Services",
        "pledged_quantity": 0
    },
    {
        "ticker": "INFY",
        "isin": "INE009A01021",
        "exchange": "NSE",
        "company": "Infosys Ltd.",
        "quantity": 35,
        "purchase_price": 1465.80,
        "current_price": 1550.00,
        "purchase_date": "2023-11-08",
        "sector": "Information Technology",
        "pledged_quantity": 0
    },
    {
        "ticker": "ITC",
        "isin": "INE154A01025",
        "exchange": "NSE",
        "company": "ITC Ltd.",
        "quantity": 80,
        "purchase_price": 436.75,
        "current_price": 450.00,
        "purchase_date": "2024-02-28",
        "sector": "FMCG",
        "pledged_quantity": 0
    },
    {
        "ticker": "MARUTI",
        "isin": "INE585B01010",
        "exchange": "NSE",
        "company": "Maruti Suzuki India Ltd.",
        "quantity": 10,
        "purchase_price": 10125.60,
        "current_price": 11500.00,
        "purchase_date": "2023-10-15",
        "sector": "Automobile",
        "pledged_quantity": 0
    },
    {
        "ticker": "DMART",
        "isin": "INE192R01011",
        "exchange": "NSE",
        "company": "Avenue Supermarts Ltd.",
        "quantity": 12,
        "purchase_price": 3780.40,
        "current_price": 4100.00,
        "purchase_date": "2023-12-05",
        "sector": "Retail",
        "pledged_quantity": 0
    },
    {
        "ticker": "LT",
        "isin": "INE018A01030",
        "exchange": "NSE",
        "company": "Larsen & Toubro Ltd.",
        "quantity": 20,
        "purchase_price": 3010.75,
        "current_price": 3400.00,
        "purchase_date": "2024-03-10",
        "sector": "Engineering & Infrastructure",
        "pledged_quantity": 0
    },
])



# -------------------------------
# 🇮🇳 MUTUAL FUND HOLDINGS (AA Enriched)
# -------------------------------

MUTUAL_FUND_HOLDINGS = pd.DataFrame([
    {
        "fund_name": "SBI Nifty 50 Index Fund Direct Growth",
        "ticker": "SBINIFTY50",
        "folio_number": "12345678/90",
        "isin": "INF200K01VA8",
        "units": 150,
        "purchase_nav": 197.35,
        "current_nav": 215.00,
        "purchase_date": "2023-07-05",
        "category": "Large Cap Index",
        "sip_active": True,
        "sip_amount": 5000
    },
    {
        "fund_name": "Axis Bluechip Fund Direct Growth",
        "ticker": "AXISBLUECHIP",
        "folio_number": "98765432/10",
        "isin": "INF846K01164",
        "units": 90,
        "purchase_nav": 594.80,
        "current_nav": 620.00,
        "purchase_date": "2023-08-20",
        "category": "Large Cap",
        "sip_active": True,
        "sip_amount": 3000
    },
    {
        "fund_name": "Kotak Emerging Equity Fund Direct Growth",
        "ticker": "KOTEKEMERG",
        "folio_number": "45678901/23",
        "isin": "INF174K01L08",
        "units": 110,
        "purchase_nav": 97.40,
        "current_nav": 115.00,
        "purchase_date": "2024-02-18",
        "category": "Mid Cap",
        "sip_active": False,
        "sip_amount": 0
    },
    {
        "fund_name": "Mirae Asset Hybrid Equity Fund Direct Growth",
        "ticker": "MIRAEHYBRID",
        "folio_number": "23456789/01",
        "isin": "INF769K01HE0",
        "units": 160,
        "purchase_nav": 58.90,
        "current_nav": 65.00,
        "purchase_date": "2023-10-02",
        "category": "Hybrid Aggressive",
        "sip_active": True,
        "sip_amount": 4000
    },
    {
        "fund_name": "Parag Parikh Flexi Cap Fund Direct Growth",
        "ticker": "PPFLEXICAP",
        "folio_number": "34567890/12",
        "isin": "INF879O01027",
        "units": 70,
        "purchase_nav": 64.25,
        "current_nav": 72.00,
        "purchase_date": "2023-12-15",
        "category": "Flexi Cap",
        "sip_active": True,
        "sip_amount": 5000
    },
])

# -------------------------------
# 4. FIXED DEPOSITS (AA Enriched)
# -------------------------------
FIXED_DEPOSITS = [
    {
        "fd_number": "FD00123456",
        "bank_name": "HDFC Bank",
        "principal_amount": 250000,
        "current_value": 265000,
        "maturity_amount": 300000,
        "interest_rate": 7.1,
        "start_date": "2023-01-15",
        "maturity_date": "2026-01-15",
        "payout_type": "Cumulative",
        "nominee": "Registered"
    },
    {
        "fd_number": "FD00987654",
        "bank_name": "SBI",
        "principal_amount": 100000,
        "current_value": 104000,
        "maturity_amount": 115000,
        "interest_rate": 6.8,
        "start_date": "2023-06-01",
        "maturity_date": "2025-06-01",
        "payout_type": "Cumulative",
        "nominee": "Registered"
    }
]

# -------------------------------
# 5. RECURRING DEPOSITS (AA Enriched)
# -------------------------------
RECURRING_DEPOSITS = [
    {
        "rd_number": "RD11223344",
        "bank_name": "HDFC Bank",
        "monthly_installment": 5000,
        "total_paid": 45000, # 9 months
        "maturity_amount": 62000, # Approx for 1 year
        "interest_rate": 6.5,
        "start_date": "2024-02-01",
        "maturity_date": "2025-02-01",
        "status": "Active"
    }
]

# -------------------------------
# 🇮🇳 CASH & FIXED-INCOME POSITION
# -------------------------------

CASH_POSITION = {
    "savings_account": 180000,      # INR
    "checking_account": 32000,
    "emergency_fund": 250000,
    "fd_total_value": sum(fd['current_value'] for fd in FIXED_DEPOSITS),       # Calculated from FDs
    "rd_total_value": sum(rd['total_paid'] for rd in RECURRING_DEPOSITS),        # Calculated from RDs
    "upi_wallets": 2500,
}

def get_portfolio_summary():
    """Returns a summary of the entire portfolio"""
    return {
        "stocks": STOCK_HOLDINGS,
        "mutual_funds": MUTUAL_FUND_HOLDINGS,
        "fixed_deposits": FIXED_DEPOSITS,
        "recurring_deposits": RECURRING_DEPOSITS,
        "cash": CASH_POSITION
    }
