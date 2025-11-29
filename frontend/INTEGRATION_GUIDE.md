# Frontend-Backend Integration Guide

This document explains how the frontend is integrated with the Anumati API backend.

## Overview

The frontend is now fully connected to the Anumati API at `https://anumati.thisisdhruv.in/api/v1`. The API runs in **no-auth mode**, which means no JWT tokens are required. Instead, we use a `user_id` query parameter for all authenticated requests.

## Configuration

### Environment Variables

The `.env.local` file contains the following configuration:

```env
NEXT_PUBLIC_API_BASE_URL=https://anumati.thisisdhruv.in/api/v1
NEXT_PUBLIC_CHAT_API_URL=          # To be configured later
NEXT_PUBLIC_OPTIMIZE_SPENDING_URL=  # To be configured later
```

## API Integration (`lib/api.ts`)

### Authentication (No-Auth Mode)

The app uses localStorage to store:
- `user_id`: MongoDB ObjectId of the logged-in user
- `user_data`: Cached user profile information

Functions:
- `setUserId(userId)`: Store user ID after login/register
- `getUserId()`: Retrieve current user ID
- `clearUserId()`: Clear user ID on logout
- `setUserData(userData)`: Store user profile data
- `getUserData()`: Retrieve cached user profile

### API Endpoints Used

#### Authentication
- `GET /auth/users`: List all pre-loaded users (public endpoint)
- `POST /auth/login`: Login with AA handle and PIN
- `POST /auth/register`: Register new user with financial data
- `GET /auth/profile?user_id={userId}`: Get user profile
- `POST /auth/form?user_id={userId}`: Update user profile

#### Accounts
- `GET /accounts?user_id={userId}`: Get all accounts
- `GET /accounts/:accountId?user_id={userId}`: Get specific account

#### Aggregated Data
- `GET /aggregated/net-worth?user_id={userId}`: Get net worth with breakdown
- `GET /aggregated/transactions?user_id={userId}&from=2025-05-01&to=2025-11-30`: Get transactions
- `GET /aggregated/investments?user_id={userId}`: Get investments
- `GET /aggregated/liabilities?user_id={userId}`: Get liabilities
- `GET /aggregated/monthly-spending?user_id={userId}&months=6`: Get spending trends
- `GET /aggregated/income-sources?user_id={userId}`: Get income breakdown

## Page Integration

### 1. Login Page (`app/login/page.tsx`)

**Features:**
- Login tab: Uses `/auth/login` endpoint
- Sign Up tab: Uses `/auth/register` endpoint
- Stores user_id in localStorage after successful authentication
- Error handling and loading states
- Form validation with Zod

**Test Credentials:**
Use any user from `/auth/users` endpoint:
- AA Handle: e.g., `9876543210@anumati`
- PIN: `1234`

### 2. Transactions Page (`app/transactions/page.tsx`)

**Features:**
- Displays transactions from May-November 2025
- Shows total income, expenses, and net flow
- Monthly spending trends
- Category filtering
- Real-time data from `/aggregated/transactions`

### 3. Net Worth Page (`app/networth/page.tsx`)

**Features:**
- Total net worth calculation
- Asset allocation breakdown (bank accounts, investments, FDs, precious metals)
- Financial goals tracking (static for now)
- Detailed tabs: Assets, Investments, Liabilities, Precious Metals
- Precious metals valuation (gold/silver)

### 4. Profile Page (`app/profile/page.tsx`)

**Features:**
- Net worth overview
- Four tabs: Cards, Investments, Transactions, Analytics
- Cards tab: Shows all linked accounts
- Investments tab: Shows all investments with returns
- Transactions tab: Recent transaction history
- Analytics tab: Spending breakdown by category

### 5. Cards Page (`app/cards/page.tsx`)

**Features:**
- 3D animated credit card display
- Loads credit cards from user profile
- Shows credit limit and usage
- Monthly spending limit slider
- Card details on flip (hover)

### 6. Chat Page (`app/chat/page.tsx`)

**Features:**
- Financial assistant interface
- Left sidebar: Navigation and net worth display
- Center panel: Chat interface (placeholder for /chat endpoint)
- Right panel: Recent transactions and AI suggestions
- Loads user data from multiple endpoints

**Future Integration Points:**
```typescript
// TODO: Update when /chat endpoint is ready
const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || '/api/chat';

// TODO: Add /optimize-spending integration
const optimizeSpendingUrl = process.env.NEXT_PUBLIC_OPTIMIZE_SPENDING_URL;
```

## Important Data Notes

### Transaction Dates
The Anumati API contains transaction data from **May-November 2025**. Always use date ranges within this period:
```typescript
getTransactions({
    from: '2025-05-01',
    to: '2025-11-30',
    limit: 50
});
```

### Currency Formatting
Use the `formatCurrency()` helper for consistent INR formatting:
```typescript
import { formatCurrency } from '@/lib/api';
formatCurrency(123456) // Returns: ₹1,23,456
```

### Date Formatting
Use the `formatDate()` helper for consistent date display:
```typescript
import { formatDate } from '@/lib/api';
formatDate('2025-11-28T10:30:00.000Z') // Returns: 28 Nov 2025
```

## Testing the Integration

### Step 1: Get Test Users
```bash
curl https://anumati.thisisdhruv.in/api/v1/auth/users
```

### Step 2: Pick a User ID
From the response, copy a `_id` value (MongoDB ObjectId), e.g., `692a430fbecb32675be14c9a`

### Step 3: Test in Browser
1. Go to the login page
2. Use any AA handle from the users list (e.g., `9876543210@anumati`)
3. Enter PIN: `1234`
4. After login, explore all pages to see live data

### Step 4: Direct API Testing
```bash
# Test net worth
curl "https://anumati.thisisdhruv.in/api/v1/aggregated/net-worth?user_id=692a430fbecb32675be14c9a"

# Test transactions
curl "https://anumati.thisisdhruv.in/api/v1/aggregated/transactions?user_id=692a430fbecb32675be14c9a&from=2025-05-01&to=2025-11-30&limit=10"
```

## Future Endpoints

### Chat Endpoint
**Endpoint:** `/chat` (to be implemented)

**Expected Usage:**
```typescript
const response = await fetch(`${chatApiUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message: userMessage,
        user_id: getUserId(),
    })
});
```

**Expected Response:**
```json
{
    "success": true,
    "data": {
        "message": "AI response here",
        "suggestions": ["suggestion 1", "suggestion 2"],
        "artifacts": { /* optional code/visualization */ }
    }
}
```

### Optimize Spending Endpoint
**Endpoint:** `/optimize-spending` (to be implemented)

**Expected Usage:**
```typescript
const response = await fetch(`${optimizeSpendingUrl}/optimize-spending?user_id=${getUserId()}`, {
    method: 'GET',
});
```

**Expected Response:**
```json
{
    "success": true,
    "data": {
        "totalSavingsPotential": 15000,
        "recommendations": [
            {
                "category": "Food & Dining",
                "currentSpend": 12000,
                "suggestedSpend": 9000,
                "savings": 3000,
                "tips": ["Cook at home 2 more times per week", "Use discount apps"]
            }
        ]
    }
}
```

## Color Scheme

The app uses a dark theme with the following accent colors:
- **Primary Coral**: `#FF9D9D` (var(--accent-coral))
- **Secondary Aqua**: `#9DFFFF` (var(--accent-aqua))
- **Background**: `#0B0E14` (var(--bg-primary))
- **Text**: `#F5F5F5` (var(--text-primary))

**DO NOT change these colors** as requested.

## Error Handling

All API calls include try-catch blocks with proper error logging:
```typescript
try {
    const result = await getNetWorth();
    if (result.success && result.data) {
        // Handle success
    } else {
        console.error('API Error:', result.error);
    }
} catch (error) {
    console.error('Network Error:', error);
}
```

## Common Issues

### Issue: "No user_id found"
**Solution:** Make sure the user is logged in. Check localStorage for `user_id`.

### Issue: "No transactions found"
**Solution:** Ensure you're using dates within May-November 2025 range.

### Issue: "Cannot connect to API"
**Solution:**
1. Check `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
2. Verify API is accessible: `curl https://anumati.thisisdhruv.in/api/v1/health`
3. Check network tab in browser DevTools

### Issue: "CORS errors"
**Solution:** The API should already have CORS enabled. If issues persist, contact backend team.

## Next Steps

1. **Update Chat Endpoint**: When `/chat` is ready, update `NEXT_PUBLIC_CHAT_API_URL` in `.env.local`
2. **Update Optimize Spending**: When ready, update `NEXT_PUBLIC_OPTIMIZE_SPENDING_URL` in `.env.local`
3. **Update Chat Interface**: Modify `app/chat/page.tsx` to use the actual chat endpoint
4. **Add Optimize Spending Feature**: Integrate optimization suggestions into the UI

## Support

For issues or questions about the integration:
1. Check this guide
2. Review the Anumati API README at `../anumati-api/README.md`
3. Check browser console for error messages
4. Verify API endpoints using curl/Postman
