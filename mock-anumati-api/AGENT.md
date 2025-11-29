# Financial Data API Integration Guide - NO AUTH REQUIRED! 🚀

You have access to a Mock Anumati Account Aggregator API that provides realistic Indian financial data. Use this API to fetch user financial information including bank accounts, transactions, investments, and liabilities.

## 🔓 NO AUTHENTICATION NEEDED!

**Great news for AI agents**: This API runs in **no-auth mode** for easy integration! 

- ❌ **No login required**
- ❌ **No tokens needed** 
- ❌ **No authentication headers**
- ✅ **Direct API access**
- ✅ **Simple GET/POST requests**

## Base URL

```
Production: https://anumati.thisisdhruv.in
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "_id": "67694b05d5dfe0a25ad42e6e",
      "aaHandle": "9999999999@anumati",
      "name": "Agent Master User",
      "mobile": "9999999999",
      "email": "agent@anumati.in",
      "pan": "AAAAA0000A"
    }
  }
}
```

**Important:** Save both the `token` and `_id` from the response:
- `token` - Required for authentication in all API calls
- `_id` - Used to query specific users' data (master user only)

## How to Use the API

🎯 **Simple 2-Step Process:**

### Step 1: Get List of Available Users
```
GET https://anumati.thisisdhruv.in/api/v1/auth/users
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 11,
    "users": [
      {
        "id": "uuid",
        "_id": "67694b05d5dfe0a25ad42e6e",
        "aaHandle": "9876543210@anumati",
        "name": "Rajesh Kumar",
        "mobile": "9876543210",
        "email": "rajesh.kumar@example.com",
        "linkedAccounts": 3
      },
      // ... more users
    ]
  }
}
```

### Step 2: Query Any User's Data

Use any user's `_id` from step 1 to get their financial data:

```bash
# Get any user's net worth
GET https://anumati.thisisdhruv.in/api/v1/aggregated/net-worth?user_id={USER_ID}

# Get any user's accounts  
GET https://anumati.thisisdhruv.in/api/v1/accounts?user_id={USER_ID}

# Get any user's transactions
GET https://anumati.thisisdhruv.in/api/v1/aggregated/transactions?user_id={USER_ID}
```

### ✅ Simple Rules

- 🔓 **No authentication required** - Just make HTTP requests
- ✅ **Use any user's `_id` from the users list** - Access anyone's financial data
- ✅ **All endpoints work with `?user_id=` parameter** 
- 📊 **11 users available** - Realistic financial data for each

## Available Endpoints

### 1. Get User Profile
```
GET https://anumati.thisisdhruv.in/api/v1/auth/profile?user_id={USER_ID}
```
Returns: User's personal information, KYC details, dependents, credit cards, and precious metals holdings.

### 2. Get All Bank Accounts
```
GET https://anumati.thisisdhruv.in/api/v1/accounts?user_id={USER_ID}
```
Returns: List of all linked bank accounts with balances, account types, and recent transactions.

### 3. Get Net Worth Summary
```
GET https://anumati.thisisdhruv.in/api/v1/aggregated/net-worth?user_id={USER_ID}
```
Returns: Complete financial overview including:
- Total assets (bank accounts, investments, precious metals)
- Total liabilities (loans, credit card debt)
- Net worth calculation
- Asset breakdown by category

### 4. Get All Transactions
```
GET https://anumati.thisisdhruv.in/api/v1/aggregated/transactions?user_id={USER_ID}
Query Parameters:
- user_id: User's _id from the users list (REQUIRED)
- from: Filter transactions from this date (YYYY-MM-DD)
- to: Filter transactions until this date (YYYY-MM-DD)
- category: Filter by category (groceries, entertainment, etc.)
- limit: Number of results per page (default: 100)
- offset: Pagination offset (default: 0)
```
Returns: Comprehensive list of all transactions across all accounts with categorization.

**Response includes:**
- Transaction ID, date, type (CREDIT/DEBIT), amount
- Category (groceries, entertainment, utilities, etc.)
- Payment mode (UPI, CARD, CASH, etc.)
- Merchant name and narration
- Account ID (use `/accounts` endpoint to get account details)
- Current balance after transaction

### 5. Get All Investments
```
GET https://anumati.thisisdhruv.in/api/v1/aggregated/investments?user_id={USER_ID}
```
Returns: Portfolio of investments including:
- Mutual funds
- Fixed deposits
- Public Provident Fund (PPF)
- National Pension System (NPS)
- Stocks and bonds
- Current values and returns

### 6. Get All Liabilities
```
GET https://anumati.thisisdhruv.in/api/v1/aggregated/liabilities?user_id={USER_ID}
```
Returns: All loans and debts including:
- Home loans
- Personal loans
- Vehicle loans
- Credit card outstanding
- EMI details and payment schedules

### 7. Get List of All Users
```
GET https://anumati.thisisdhruv.in/api/v1/auth/users
```
Returns: List of all available user accounts with their IDs.
**💡 CALL THIS ENDPOINT FIRST to get the `_id` values for querying specific users.**

### 8. Submit User Form Data
```
POST {BASE_URL}/api/v1/auth/form
Body:
{
  "userId": "user_id_here",
  "formData": { ... }
}
```
Submit additional user information or form responses.

## Usage Guidelines

1. **Always authenticate first** - Call the login endpoint before making any other requests
2. **Store the token** - Reuse the token for all requests (valid for 24 hours)
3. **Include Authorization header** - All endpoints except login and `/auth/users` require the Bearer token
4. **Handle errors gracefully** - Check the `success` field in responses
5. **Parse nested data** - Most responses have data nested under a `data` field

## Example Workflows

### Workflow 1: Query Your Own Data
```
1. POST {BASE_URL}/api/v1/auth/login
   → Get token and user._id

2. GET {BASE_URL}/api/v1/aggregated/net-worth
   → Get your financial overview

3. GET {BASE_URL}/api/v1/accounts
   → Get your account information
```

### Workflow 2: Master User Querying User Data (⚠️ REQUIRED WORKFLOW)
```
1. POST {BASE_URL}/api/v1/auth/login
   Body: {"aaHandle": "9999999999@anumati", "pin": "9999"}
   → Get master user token

2. GET {BASE_URL}/api/v1/auth/users
   → ⚠️ ALWAYS DO THIS FIRST! Get list of all users with their _id values

3. Pick a user's _id from the list (e.g., "67694b05d5dfe0a25ad42e6e")

4. GET {BASE_URL}/api/v1/aggregated/net-worth?user_id=67694b05d5dfe0a25ad42e6e
   → Get specific user's net worth (⚠️ user_id is REQUIRED)

5. GET {BASE_URL}/api/v1/aggregated/transactions?user_id=67694b05d5dfe0a25ad42e6e&limit=50
   → Get specific user's transactions (⚠️ user_id is REQUIRED)

6. GET {BASE_URL}/api/v1/accounts?user_id=67694b05d5dfe0a25ad42e6e
   → Get specific user's accounts (⚠️ user_id is REQUIRED)
```

### Workflow 3: Analyze Multiple Users (AI Agent Pattern)
```
1. Login as master user
2. GET /api/v1/auth/users (⚠️ REQUIRED - Get all users list)
3. For each user's _id:
   - Query their net worth with ?user_id={_id}
   - Query their transactions with ?user_id={_id}
   - Query their investments with ?user_id={_id}
   - Analyze and provide insights
```

### ⚠️ Common Mistakes to Avoid

```
❌ WRONG: GET /api/v1/aggregated/net-worth
   (Master user has no data - this will fail!)

✅ CORRECT: 
   1. GET /api/v1/auth/users (get user list)
   2. GET /api/v1/aggregated/net-worth?user_id=67694b05d5dfe0a25ad42e6e
```

## Response Format

All successful responses follow this structure:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Error Codes

```json
// 401 Unauthorized - No token or invalid token
{
  "success": false,
  "error": "Invalid or expired token"
}

// 403 Forbidden - Regular user trying to query another user
{
  "success": false,
  "error": "Access denied: Only master user can query other users"
}

// 404 Not Found - User or resource doesn't exist
{
  "success": false,
  "error": "User not found"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Internal server error"
}
```

## Important Notes

- Replace `{BASE_URL}` with the actual API base URL (e.g., `http://localhost:3000` or your ngrok URL)
- All monetary values are in Indian Rupees (INR)
- Dates are in ISO 8601 format
- The token expires after 24 hours - re-authenticate if you get 401 errors
- **Use `_id` field for user_id queries, NOT the `id` field**
- Master user access is logged for security auditing

## Quick Reference

### Master User Credentials
```
AA Handle: 9999999999@anumati
PIN: 9999
⚠️ Note: Master user has NO financial data - must query other users
```

### Key Fields from Login Response
```json
{
  "token": "eyJ...",        // Use for Authorization header
  "user": {
    "_id": "67694b...",     // Master user's ID (DON'T use for data queries!)
    "id": "uuid...",        // Internal UUID (don't use for queries)
    "aaHandle": "...",
    "name": "..."
  }
}
```

### Required Query Pattern for Master User
```
Step 1: GET {BASE_URL}/api/v1/auth/users
        → Get list of actual users with data

Step 2: Pick a user's _id from the list

Step 3: Authorization: Bearer {token}
        URL: {BASE_URL}/api/v1/{endpoint}?user_id={_id}
        ⚠️ ALWAYS include ?user_id={_id}
```

---

Use this API to answer questions about users' finances, analyze spending patterns across multiple users, provide investment advice, track net worth, compare financial profiles, or any other financial data queries. As a master user, you have complete access to all users' financial data for comprehensive analysis.

