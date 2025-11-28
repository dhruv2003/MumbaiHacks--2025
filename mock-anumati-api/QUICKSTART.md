# Quick Start Guide

Get the Mock Anumati API running in 2 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn

## Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the Server

```bash
# Development mode with hot reload
npm run dev

# OR build and run production mode
npm run build
npm start
```

The server will start on **http://localhost:3000**

## First API Call

### 1. Get List of Test Users

```bash
curl http://localhost:3000/api/v1/auth/users
```

You'll see a list of generated users. Pick any `aaHandle` from the response.

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "aaHandle": "THE_AA_HANDLE_FROM_STEP_1",
    "pin": "1234"
  }'
```

Save the `token` from the response.

### 3. Get Net Worth

```bash
curl http://localhost:3000/api/v1/aggregated/net-worth \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## What's Generated?

On startup, the system automatically creates:

- ✅ **10 users** with realistic Indian names
- ✅ **30-50 bank accounts** across all users
- ✅ **3,000+ transactions** with authentic Indian merchant names
- ✅ **50+ investments** (Mutual Funds, Stocks, PPF, NPS, FDs)
- ✅ **20+ liabilities** (Credit Cards, Loans)

All data is **realistic** and follows Indian banking patterns!

## Quick Testing

### Import Postman Collection

1. Open Postman
2. Import `postman_collection.json` from the project root
3. Start testing all endpoints instantly!

### Default Credentials

- **PIN for all users**: `1234`
- **AA Handle format**: `{mobile}@anumati`

## Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/auth/users` | List all test users |
| `POST /api/v1/auth/login` | Login and get JWT token |
| `GET /api/v1/aggregated/net-worth` | Get complete net worth |
| `GET /api/v1/aggregated/transactions` | Get transaction history |
| `GET /api/v1/aggregated/investments` | Get investment portfolio |
| `GET /api/v1/aggregated/liabilities` | Get loans and liabilities |
| `GET /api/v1/accounts` | Get all bank accounts |

## Optional: Pinecone Setup

Semantic search is **optional**. To enable it:

1. Sign up at https://www.pinecone.io/
2. Create an index (dimension: 1536, metric: cosine)
3. Get OpenAI API key from https://platform.openai.com/
4. Update `.env`:

```bash
PINECONE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

Without Pinecone, all other features work perfectly!

## Need Help?

- Check `README.md` for detailed documentation
- All endpoints return helpful error messages
- Check server logs for debugging

## Example Usage

```bash
# Get all transactions for "Food & Dining"
curl "http://localhost:3000/api/v1/aggregated/transactions?category=Food" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get monthly spending breakdown
curl "http://localhost:3000/api/v1/aggregated/monthly-spending?months=6" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all investments
curl "http://localhost:3000/api/v1/aggregated/investments" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**You're all set!** 🎉

The Mock Anumati API is now running with realistic Indian financial data. Happy coding!
