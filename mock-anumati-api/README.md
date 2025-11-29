# Mock Anumati API - Account Aggregator Service

A comprehensive mock implementation of the Anumati Account Aggregator (AA) API with realistic Indian financial data. This service simulates the RBI-licensed Account Aggregator framework, providing secure, consent-based financial information aggregation across banks, investments, and liabilities.

## 🔓 NO AUTHENTICATION MODE

**Perfect for AI Agents & Quick Testing!** This API runs in **no-auth mode** for easy integration:

- ❌ **No login required** - Skip authentication entirely
- ❌ **No JWT tokens needed** - No Authorization headers
- ✅ **Direct API access** - Just add `?user_id=` to any endpoint
- ✅ **11 pre-loaded users** - Get user IDs from `/auth/users`

## Features

- **No Authentication Required**: All endpoints accessible without tokens for easy AI agent integration
- **Realistic Indian Financial Data**: Authentic bank names, IFSC codes, UPI transactions, merchant names, and transaction patterns
- **Complete Account Aggregation**: Savings accounts, current accounts, credit cards, fixed deposits, and recurring deposits
- **Investment Portfolio**: Mutual funds, equities, PPF, EPF, NPS, and fixed deposits
- **Liability Management**: Credit cards, personal loans, home loans, car loans, and education loans
- **Transaction History**: 300+ realistic transactions per account with Indian payment modes (UPI, NEFT, RTGS, IMPS, ATM, Card)
- **11 Pre-loaded Users**: Ready-to-use test data with unique MongoDB IDs
- **MongoDB Persistence**: All data stored in MongoDB Atlas for reliable persistence
- **User Profile Management**: Extended user profiles with location, dependents, credit cards, and precious metals
- **Precious Metals Tracking**: Track gold and silver holdings with configurable rates for net worth calculation
- **Aggregated Analytics**: Net worth calculation including precious metals, spending analysis, income sources, and category breakdowns
- **Production-Ready**: Error handling, rate limiting, logging, and validation

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Data Models](#data-models)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Quick Start

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd mock-anumati-api

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration (JWT_SECRET is required)
nano .env

# Build the project
npm run build

# Start the server
npm start
```

For development with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (REQUIRED)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# MongoDB Configuration (REQUIRED)
MONGODB_URI=mongodb+srv://bhagatkardhruv2003_db_user:S7QadCrvOIPj7NBP@tmkc.rdg6ew6.mongodb.net/?appName=tmkc
MONGODB_DB_NAME=anumati_db

# Precious Metals Rates (for net worth calculation)
GOLD_RATE_PER_GRAM=13070
SILVER_RATE_PER_GRAM=176

# Data Generation Configuration
USERS_COUNT=10
TRANSACTIONS_PER_ACCOUNT=300
MONTHS_OF_HISTORY=6

# CORS Configuration
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Required Configuration

- `JWT_SECRET`: **Required** - Change this to a secure random string
- `MONGODB_URI`: **Required** - MongoDB connection string
- `MONGODB_DB_NAME`: **Required** - Database name (default: anumati_db)

### Precious Metals Configuration

- `GOLD_RATE_PER_GRAM`: Current gold rate in INR per gram (default: ₹13,070)
- `SILVER_RATE_PER_GRAM`: Current silver rate in INR per gram (default: ₹176)

These rates are used to calculate the value of user's precious metal holdings in their net worth.

---

## API Documentation

### Base URL

```
Production: https://anumati.thisisdhruv.in/api/v1
Local: http://localhost:3000/api/v1
```

### Authentication - NO AUTH MODE! 🚀

**This API runs in no-auth mode.** No authentication headers required!

#### How to Use:

**Step 1:** Get list of available users
```bash
GET /auth/users
```

**Step 2:** Pick a user_id from the response (MongoDB `_id` field)

**Step 3:** Query any endpoint with the user_id parameter:
```bash
GET /aggregated/transactions?user_id=692a430fbecb32675be14c9a
GET /aggregated/net-worth?user_id=692a430fbecb32675be14c9a
```

**That's it!** No tokens, no login, no authentication headers needed.

### Endpoints

#### 1. Authentication

##### List All Users

**GET** `/auth/users` (Public - No Auth Required)

Returns all 11 pre-loaded users with their MongoDB IDs for querying.

Response:
```json
{
  "success": true,
  "data": {
    "count": 11,
    "users": [
      {
        "_id": "692a430ebecb32675be14c98",
        "name": "Rajesh Kumar Sharma",
        "email": "rajesh.kumar@example.com",
        "mobile": "9876543210",
        "aaHandle": "9876543210@anumati",
        "pan": "ABCDE1234F",
        "accountsCount": 4
      }
    ]
  }
}
```

##### Login

**POST** `/auth/login`

Login endpoint (still available but not required in no-auth mode).

Request:
```json
{
  "aaHandle": "9876543210@anumati",
  "pin": "1234"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "aaHandle": "9876543210@anumati",
      "name": "Rajesh Sharma",
      "mobile": "9876543210",
      "email": "rajesh.sharma@gmail.com",
      "pan": "ABCDE1234F"
    }
  }
}
```

##### Register

**POST** `/auth/register`

Create a new user with financial data. Automatically generates accounts, transactions, investments, and liabilities.

Request:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone": "9876543210",
  "pan": "ABCDE1234F",
  "pin": "1234",
  "dob": "1990-05-15",
  "address": "123, Sector 5, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "dependents": [
    {
      "name": "Priya Sharma",
      "age": 32,
      "sex": "FEMALE",
      "relationship": "Spouse"
    }
  ],
  "creditCards": [
    {
      "bankName": "HDFC Bank",
      "cardType": "VISA",
      "cardVariant": "Regalia"
    }
  ],
  "goldGrams": 50,
  "silverGrams": 500
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully with financial data",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "mongodb_id",
      "aaHandle": "9876543210@anumati",
      "name": "Rahul Sharma",
      "mobile": "9876543210",
      "email": "rahul.sharma@example.com",
      "pan": "ABCDE1234F"
    }
  }
}
```

##### Get User Profile

**GET** `/auth/profile?user_id={userId}` (No Auth Required)

Get detailed profile information for a specific user.

Query Parameters:
- `user_id` (optional): MongoDB _id from `/auth/users`. If not provided, returns master user profile.

Response:
```json
{
  "success": true,
  "data": {
    "_id": "692a430fbecb32675be14c9a",
    "aaHandle": "9876543211@anumati",
    "name": "Pooja Kulkarni",
    "mobile": "9876543211",
    "email": "pooja.kulkarni@example.com",
    "pan": "BCDEF2345G",
    "dob": "1992-03-20",
    "address": "456, FC Road, Pune",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411004",
    "dependents": [...],
    "creditCards": [...],
    "preciousMetals": {
      "gold": 75,
      "silver": 800
    },
    "linkedAccounts": 3
  }
}
```

##### Submit User Form

**POST** `/auth/form?user_id={userId}` (No Auth Required)

Submit or update user profile information.

Request:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone": "9876543210",
  "pan": "ABCDE1234F",
  "address": "123, Sector 5, Street, Mumbai, Maharashtra",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "dependents": [...],
  "creditCards": [...],
  "goldGrams": 50,
  "silverGrams": 500
}
```

Response:
```json
{
  "success": true,
  "message": "User information updated successfully",
  "data": {
    "user": {...},
    "financialDataGenerated": false
  }
}
```

---

#### 2. Accounts

##### Get All Accounts

**GET** `/accounts?user_id={userId}` (No Auth Required)

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`

Response:
```json
{
  "success": true,
  "data": {
    "count": 3,
    "accounts": [
      {
        "id": "uuid",
        "type": "DEPOSIT",
        "fipName": "HDFC Bank",
        "accountType": "SAVINGS",
        "maskedAccNumber": "XXXXXXXX5678",
        "currentBalance": 234567.89,
        "currency": "INR",
        "status": "ACTIVE",
        "branch": "Mumbai Branch, Maharashtra",
        "ifscCode": "HDFC0001234",
        "openingDate": "2020-03-15T00:00:00.000Z"
      }
    ]
  }
}
```

##### Get Account by ID

**GET** `/accounts/:accountId?user_id={userId}` (No Auth Required)

Returns detailed account information including profile, summary, and transaction count.

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`

---

#### 3. Aggregated Data

##### Get Net Worth

**GET** `/aggregated/net-worth?user_id={userId}` (No Auth Required)

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`

Response includes precious metals valuation:
```json
{
  "success": true,
  "data": {
    "userId": "mongodb_id",
    "aaHandle": "9876543210@anumati",
    "netWorth": 4110289.50,
    "asOfDate": "2025-11-28T...",
    "breakdown": {
      "assets": {
        "bankAccounts": 456789.50,
        "investments": 2500000.00,
        "fixedDeposits": 500000.00,
        "preciousMetals": 653500.00,
        "total": 4110289.50
      },
      "liabilities": {
        "creditCards": 45000.00,
        "loans": 1700000.00,
        "total": 1745000.00
      },
      "netAssets": 2365289.50
    },
    "preciousMetals": {
      "gold": {
        "grams": 50,
        "ratePerGram": 13070,
        "value": 653500
      },
      "silver": {
        "grams": 500,
        "ratePerGram": 176,
        "value": 88000
      },
      "total": 741500
    },
    "accounts": {
      "savings": 2,
      "current": 1,
      "creditCards": 2,
      "investments": 5,
      "loans": 2
    }
  }
}
```

##### Get Transactions

**GET** `/aggregated/transactions?user_id={userId}&from=2025-05-01&to=2025-11-30&category=Food&limit=50&offset=0` (No Auth Required)

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`
- `from` (optional): Start date (ISO format, use 2025 dates)
- `to` (optional): End date (ISO format, use 2025 dates)
- `category` (optional): Filter by category
- `limit` (optional): Results per page (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Note:** Transaction data is generated for May-November 2025, so use dates in this range.

Response:
```json
{
  "success": true,
  "data": {
    "total": 127,
    "limit": 50,
    "offset": 0,
    "totalCredits": 85000.00,
    "totalDebits": 67890.00,
    "netFlow": 17110.00,
    "categoryBreakdown": {
      "Food & Dining": 12500.50,
      "Shopping": 23400.00,
      "Transport": 4560.00
    },
    "transactions": [
      {
        "id": "uuid",
        "date": "2023-06-25T10:30:00.000Z",
        "type": "CREDIT",
        "amount": 75000.00,
        "category": "Salary",
        "mode": "FT",
        "narration": "NEFT-Salary Credit-ABC Technologies",
        "account": {
          "bank": "HDFC Bank",
          "maskedNumber": "XXXXXXXX5678"
        }
      }
    ]
  }
}
```

##### Get Investments

**GET** `/aggregated/investments?user_id={userId}` (No Auth Required)

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`

Response includes mutual funds, stocks, PPF, EPF, NPS, and fixed deposits.

##### Get Liabilities

**GET** `/aggregated/liabilities?user_id={userId}` (No Auth Required)

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`

Response includes credit cards, personal loans, home loans, car loans, and education loans.

##### Get Monthly Spending

**GET** `/aggregated/monthly-spending?user_id={userId}&months=6` (No Auth Required)

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`
- `months` (optional): Number of months (default: 6)

Returns month-wise spending breakdown with category analysis.

##### Get Income Sources

**GET** `/aggregated/income-sources?user_id={userId}` (No Auth Required)

Query Parameters:
- `user_id` (required): MongoDB _id from `/auth/users`

Returns income breakdown by category with percentages.

---

## Usage Examples

### Example 1: Get Users and Query Net Worth

```bash
# Step 1: Get list of all users
curl https://anumati.thisisdhruv.in/api/v1/auth/users

# Step 2: Pick a user_id from response (e.g., 692a430fbecb32675be14c9a)

# Step 3: Get net worth for that user (NO AUTH REQUIRED!)
curl "https://anumati.thisisdhruv.in/api/v1/aggregated/net-worth?user_id=692a430fbecb32675be14c9a"
```

### Example 2: Get Transaction History

```bash
# Get transactions for a user (use 2025 dates!)
curl "https://anumati.thisisdhruv.in/api/v1/aggregated/transactions?user_id=692a430fbecb32675be14c9a&from=2025-05-01&to=2025-11-30&limit=10"

# Filter by category
curl "https://anumati.thisisdhruv.in/api/v1/aggregated/transactions?user_id=692a430fbecb32675be14c9a&category=Food"
```

### Example 3: Using with JavaScript/TypeScript

```typescript
// Step 1: Get users
const usersResponse = await fetch('https://anumati.thisisdhruv.in/api/v1/auth/users');
const { data } = await usersResponse.json();
const userId = data.users[0]._id; // Pick first user

// Step 2: Get net worth (NO AUTH NEEDED!)
const netWorthResponse = await fetch(
  `https://anumati.thisisdhruv.in/api/v1/aggregated/net-worth?user_id=${userId}`
);

const netWorthData = await netWorthResponse.json();
console.log('Net Worth:', netWorthData.data.netWorth);
```

### Example 4: Using with Python

```python
import requests

BASE_URL = 'https://anumati.thisisdhruv.in/api/v1'

# Step 1: Get users
users_response = requests.get(f'{BASE_URL}/auth/users')
user_id = users_response.json()['data']['users'][0]['_id']

# Step 2: Get accounts (NO AUTH NEEDED!)
accounts_response = requests.get(
    f'{BASE_URL}/accounts',
    params={'user_id': user_id}
)

accounts = accounts_response.json()['data']['accounts']
print(f"Total accounts: {len(accounts)}")

# Step 3: Get transactions with date filter (use 2025 dates!)
transactions_response = requests.get(
    f'{BASE_URL}/aggregated/transactions',
    params={
        'user_id': user_id,
        'from': '2025-05-01',
        'to': '2025-11-30',
        'limit': 10
    }
)

transactions = transactions_response.json()['data']['transactions']
print(f"Recent transactions: {len(transactions)}")
```

---

## Data Models

### TypeScript Interfaces

#### User Interface

```typescript
interface User {
  id: string;
  aaHandle: string;
  mobile: string;
  name: string;
  email: string;
  pan: string;
  dob: string;
  pin: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dependents: Dependent[];
  creditCards: CreditCard[];
  preciousMetals: PreciousMetals;
  financialPersona?: string;
  userPersona?: string;
  linkedAccounts: string[];
  createdAt: Date;
}

interface Dependent {
  name: string;
  age: number;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  relationship?: string;
}

interface CreditCard {
  bankName: string;
  cardType: 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX';
  cardVariant?: string;
}

interface PreciousMetals {
  gold: number;  // grams
  silver: number;  // grams
}
```

#### Account Interface

```typescript
interface Account {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'CREDIT_CARD' | 'TERM_DEPOSIT' | 'RECURRING_DEPOSIT';
  fipId: string;
  fipName: string;
  maskedAccNumber: string;
  actualAccNumber: string;
  ifscCode: string;
  branch: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'CREDIT' | 'FD' | 'RD';
  currentBalance: number;
  currency: 'INR';
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  openingDate: string;
  closingDate?: string;
  linkRefNumber: string;
  profile: AccountProfile;
  summary: AccountSummary;
  transactions: Transaction[];
}
```

#### Transaction Interface

```typescript
interface Transaction {
  id: string;
  accountId: string;
  type: 'CREDIT' | 'DEBIT';
  mode: 'CASH' | 'ATM' | 'CARD' | 'UPI' | 'FT' | 'OTHERS';
  amount: number;
  currentBalance: number;
  txnId: string;
  narration: string;
  reference: string;
  transactionTimestamp: string;
  valueDate: string;
  category?: string;
  merchantName?: string;
  merchantUPI?: string;
}
```

#### Investment Interface

```typescript
interface Investment {
  id: string;
  userId: string;
  type: 'MUTUAL_FUND' | 'EQUITY' | 'PPF' | 'EPF' | 'NPS' | 'FIXED_DEPOSIT';
  holder: {
    name: string;
    pan: string;
    mobile: string;
  };
  schemeName: string;
  units?: number;
  currentValue: number;
  investedAmount: number;
  returns: number;
  returnsPercentage: number;
  maturityDate?: string;
  startDate: string;
}
```

#### Liability Interface

```typescript
interface Liability {
  id: string;
  userId: string;
  type: 'CREDIT_CARD' | 'PERSONAL_LOAN' | 'HOME_LOAN' | 'CAR_LOAN' | 'EDUCATION_LOAN';
  lender: string;
  accountNumber: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  emiAmount: number;
  tenure: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
}
```

---

## Data Structure

### Indian Financial Data

#### Banks Included

**Public Sector Banks:**
- State Bank of India (SBI)
- Punjab National Bank (PNB)
- Bank of Baroda (BOB)
- Canara Bank
- Union Bank of India
- Bank of India
- Indian Bank
- Central Bank of India

**Private Sector Banks:**
- HDFC Bank
- ICICI Bank
- Axis Bank
- Kotak Mahindra Bank
- IndusInd Bank
- Yes Bank
- IDFC First Bank
- Federal Bank

**Payment Banks:**
- Paytm Payments Bank
- Airtel Payments Bank

#### Transaction Types

**Payment Modes:**
- UPI (50% of transactions) - Most common
- NEFT/RTGS (15%)
- ATM Withdrawals (10%)
- Card Payments (15%)
- Others (10%)

**Popular Merchants:**
- Food: Swiggy, Zomato, Dominos, McDonald's, KFC, Starbucks
- E-commerce: Amazon India, Flipkart, Myntra, Ajio, Meesho
- Grocery: BigBasket, Blinkit, Zepto, Swiggy Instamart, JioMart
- Transport: Ola, Uber, Rapido, Metro services
- Utilities: Jio, Airtel, Vi, Tata Power, Adani Electricity
- Entertainment: Netflix, Amazon Prime, Disney+ Hotstar, BookMyShow

#### UPI Patterns

All UPI transactions follow authentic formats:
```
UPI-Swiggy-9876543210-Food Order
UPI-Amazon-7654321098-Shopping
UPI-BigBasket-6543210987-Groceries
```

#### IFSC Codes

All IFSC codes follow RBI standard format:
```
HDFC0001234
SBIN0005678
ICIC0002345
```

---

## Testing

### No Authentication Required! 🎉

This API runs in **no-auth mode** for easy testing and AI agent integration. No login or tokens needed!

### Pre-loaded Test Users

The API comes with **11 pre-loaded users** with complete financial data:
- Each user has 2-5 bank accounts
- 300+ transactions per account (May-Nov 2025)
- 3-8 investments (mutual funds, stocks, PPF, NPS, FDs)
- 0-3 liabilities (credit cards, loans)

### Getting Test Users

```bash
# List all 11 available test users
curl https://anumati.thisisdhruv.in/api/v1/auth/users
```

This returns all users with their MongoDB `_id` values that you'll use for querying.

### Sample Test Flow

```bash
# 1. Health check
curl https://anumati.thisisdhruv.in/api/v1/health

# 2. List users and get their IDs
curl https://anumati.thisisdhruv.in/api/v1/auth/users

# 3. Pick a user_id from the response (e.g., 692a430fbecb32675be14c9a)

# 4. Query ANY endpoint with user_id (NO AUTH REQUIRED!)
curl "https://anumati.thisisdhruv.in/api/v1/aggregated/net-worth?user_id=692a430fbecb32675be14c9a"

curl "https://anumati.thisisdhruv.in/api/v1/aggregated/transactions?user_id=692a430fbecb32675be14c9a&from=2025-05-01&to=2025-11-30&limit=10"

curl "https://anumati.thisisdhruv.in/api/v1/accounts?user_id=692a430fbecb32675be14c9a"
```

### Important Notes

- **No Authorization headers needed** - Just add `?user_id=` to any endpoint
- **Use 2025 dates** for transaction queries (data is from May-Nov 2025)
- All user IDs are MongoDB ObjectIds (24-character hex strings)
- Each user has unique financial data

---

## Project Structure

```
mock-anumati-api/
├── src/
│   ├── config/
│   │   ├── constants.ts          # Indian data constants
│   │   ├── env.ts                # Environment configuration
│   │   └── mongodb.ts            # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── account.controller.ts
│   │   ├── aggregated.controller.ts
│   │   └── form.controller.ts
│   ├── generators/
│   │   ├── user.generator.ts
│   │   ├── account.generator.ts
│   │   ├── transaction.generator.ts
│   │   ├── investment.generator.ts
│   │   └── liability.generator.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── account.model.ts
│   │   ├── investment.model.ts
│   │   └── liability.model.ts
│   ├── routes/
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── mongodb.service.ts
│   │   ├── data-generator.service.ts
│   │   └── aggregation.service.ts
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── logger.ts
│   └── app.ts                    # Express app
├── clear-db.ts                   # Database clear utility
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── postman_collection.json
└── README.md
```

---

## Features Breakdown

### Data Generation

On server startup, the system automatically generates:
- **10 users** (configurable) with realistic Indian names
- **2-5 accounts** per user (mix of savings, current, FD, credit cards)
- **300+ transactions** per account spanning 6 months
- **3-8 investments** per user (mutual funds, stocks, PPF, NPS, FDs)
- **0-3 liabilities** per user (credit cards, loans)

### Transaction Patterns

Transactions follow realistic patterns:
- **Salary credits**: 1st-5th of month
- **Rent payments**: 1st-10th of month
- **UPI payments**: Daily, for food, shopping, groceries, transport
- **ATM withdrawals**: 2-4 times per month
- **Bill payments**: Utilities, subscriptions, insurance

### Amount Distributions

Realistic amount ranges based on category:
- **Food**: ₹50 - ₹2,000
- **Shopping**: ₹200 - ₹10,000
- **Groceries**: ₹300 - ₹3,000
- **Transport**: ₹50 - ₹800
- **Salary**: ₹30,000 - ₹2,00,000
- **Rent**: ₹10,000 - ₹50,000

---

## API Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests (Rate Limit)
- `500`: Internal Server Error
- `503`: Service Unavailable

---

## Security Features

1. **No Authentication Mode**: Easy access for testing and AI agents (authentication bypassed)
2. **Rate Limiting**: 100 requests per 15 minutes per IP
3. **CORS**: Configurable origin restrictions (currently allows all origins)
4. **Helmet.js**: Security HTTP headers
5. **Input Validation**: Joi schemas for request validation
6. **MongoDB Security**: Secure connection to MongoDB Atlas with IP whitelisting

---

## Performance

- **MongoDB Storage**: Fast and reliable data persistence
- **Pre-generated Data**: Data generated on first startup
- **Indexed Queries**: MongoDB indexes on userId, aaHandle, and mobile
- **Efficient Filtering**: Optimized transaction queries
- **Pagination**: All list endpoints support pagination
- **Connection Pooling**: Mongoose connection pooling for better performance

---

## Limitations

1. **Mock Data**: All financial data is generated using faker.js
2. **No Authentication**: All endpoints are public for easy testing (not suitable for production with real data)
3. **No Real Banking Integration**: All data is generated
4. **Fixed Date Range**: Transactions are generated for May-November 2025 only
5. **Pre-loaded Users**: Limited to 11 pre-generated users (can be regenerated with clear-db script)

---

## Use Cases

This mock API is perfect for:

- **Frontend Development**: Build UIs without waiting for backend
- **Testing**: Integration testing of AA-based applications
- **Demos**: Showcase account aggregator features
- **Prototyping**: Rapid prototyping of fintech applications
- **Education**: Learning about AA framework and Indian banking
- **Hackathons**: Quick financial data source for hackathon projects

---

## Future Enhancements

Potential improvements:
- [ ] Add consent management flow
- [ ] Implement FI request/fetch protocol
- [ ] Add more FI types (insurance, GST returns, mutual funds NAV tracking)
- [ ] Redis caching layer
- [ ] WebSocket support for real-time updates
- [ ] GraphQL API
- [ ] Swagger/OpenAPI documentation
- [ ] Docker support
- [ ] Kubernetes deployment configs
- [ ] Enhanced analytics and insights
- [ ] Support for multiple currencies

---

## Troubleshooting

### Server Won't Start

```bash
# Check if port 3000 is already in use
lsof -i :3000

# Use a different port
PORT=3001 npm start
```

### JWT Errors

```bash
# Make sure JWT_SECRET is set in .env
echo $JWT_SECRET

# If empty, add to .env:
JWT_SECRET=your_secret_key_here
```

### TypeScript Errors

```bash
# Rebuild the project
npm run build

# Or run in development mode
npm run dev
```

### MongoDB Connection Errors

If you can't connect to MongoDB:
1. Verify `MONGODB_URI` is correct in `.env`
2. Check network connectivity to MongoDB Atlas
3. Ensure your IP is whitelisted in MongoDB Atlas
4. Check MongoDB Atlas cluster is running
5. Review server logs for connection error details

### Clear Database

To regenerate all data from scratch:
```bash
npm run clear-db
npm start
```

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

MIT License - feel free to use this project for any purpose.

---

## Support

For issues, questions, or suggestions:
- Create an issue in the GitHub repository
- Check existing documentation
- Review the code comments

---

## Acknowledgments

- Inspired by the RBI Account Aggregator framework
- Data patterns based on Anumati and Sahamati specifications
- Built for the Indian fintech ecosystem

---

## Changelog

### v2.1.0 (2025-11-29)
- **No Authentication Mode**: Removed JWT authentication for easy AI agent access
- All endpoints now public with `?user_id=` query parameter
- 11 pre-loaded users with unique MongoDB ObjectIds
- Production deployment at https://anumati.thisisdhruv.in
- Transaction data generated for May-November 2025
- Simplified API usage - no tokens or login required

### v2.0.0 (2025-11-29)
- MongoDB integration for data persistence
- Extended user profiles with location, dependents, and credit cards
- Precious metals tracking (gold and silver)
- Net worth calculation including precious metals
- New /form endpoint for profile management
- Removed Pinecone integration
- Enhanced data models with TypeScript interfaces
- Database clear utility script

### v1.0.0 (2025-11-28)
- Initial release
- Complete Account Aggregator mock implementation
- Realistic Indian financial data generation
- JWT authentication
- Comprehensive API endpoints
- Production-ready error handling and logging

---

**Happy Coding!** 🚀
