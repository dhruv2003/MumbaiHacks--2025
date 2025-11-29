# FinanceHub - Complete Routes Guide

## 📍 All Application Routes

### Public Routes (No Authentication Required)

#### 1. Landing Page
**Route:** `/` (http://localhost:3000/)
- **Purpose:** Marketing landing page
- **Features:**
  - Hero section with call-to-action
  - Features showcase (Account Aggregation, Smart Analytics, Security)
  - Navigation to login
  - Fully responsive design
- **Actions:**
  - Click "Login" or "Get Started" → Redirects to `/login`
  - Click "Learn More" → View features section

---

### Authentication Routes

#### 2. Login/Register Page
**Route:** `/login` (http://localhost:3000/login)
- **Purpose:** User authentication and registration
- **Features:**
  - **Login Tab:**
    - AA Handle input (e.g., `9876543210@anumati`)
    - PIN input (4 digits)
    - Error handling and validation
    - Loading states
  - **Sign Up Tab:**
    - Complete registration form
    - Personal details (name, email, phone, PAN, DOB, address)
    - Dependent information
    - Credit card details
    - Gold/Silver holdings
    - Auto-generates financial data on registration
- **API Integration:**
  - `POST /auth/login` - Login existing users
  - `POST /auth/register` - Register new users
- **After Login:** Redirects to `/chat` (Dashboard)

**Test Credentials:**
```
AA Handle: 9876543210@anumati (or any from /auth/users)
PIN: 1234
```

---

### Authenticated Routes (Require Login)

All these pages have:
- ✅ Consistent navigation bar at the top
- ✅ Real-time data from Anumati API
- ✅ Logout functionality
- ✅ Active route highlighting

#### 3. Dashboard / Chat Page
**Route:** `/chat` (http://localhost:3000/chat)
- **Purpose:** Main dashboard and AI chat interface
- **Layout:**
  - **Left Sidebar:**
    - FinanceHub logo
    - Navigation links
    - Quick net worth display
    - Logout button
  - **Center Panel:**
    - AI chat interface
    - Command input
    - Message history
  - **Right Sidebar:**
    - Recent transactions (5 latest)
    - AI suggestions buttons
- **Features:**
  - Financial assistant chat (prepared for `/chat` endpoint)
  - Real-time net worth display
  - Recent transaction feed
  - Quick action suggestions
- **API Integration:**
  - `GET /aggregated/net-worth` - Net worth data
  - `GET /aggregated/transactions` - Recent transactions
  - `/api/chat` - Chat endpoint (local placeholder, awaiting backend)
- **Navigation:**
  - Dashboard (current)
  - Transactions → `/transactions`
  - Net Worth → `/networth`
  - Cards → `/cards`
  - Profile → `/profile`
  - Logout → `/login`

---

#### 4. Transactions Page
**Route:** `/transactions` (http://localhost:3000/transactions)
- **Purpose:** View and analyze all transactions
- **Features:**
  - **Giant Stats Overview:**
    - Total income (green/aqua)
    - Total expenses (red/coral)
    - Net flow
  - **Category Filter:**
    - Filter by category (All, Food, Shopping, Transport, etc.)
    - Real-time filtering
  - **Transaction List:**
    - Date, category, narration
    - Amount with color coding (credit=green, debit=red)
    - Account information
    - Mode of payment (UPI, NEFT, etc.)
  - **Monthly Spending Trends:**
    - Last 6 months visualization
    - Month-over-month comparison
- **API Integration:**
  - `GET /aggregated/transactions?from=2025-05-01&to=2025-11-30` - Transaction history
  - `GET /aggregated/monthly-spending?months=6` - Monthly trends
- **Important:** Data range is May-November 2025
- **Loading State:** Shows "LOADING TRANSACTIONS..." while fetching

---

#### 5. Net Worth Page
**Route:** `/networth` (http://localhost:3000/networth)
- **Purpose:** Complete net worth overview and breakdown
- **Features:**
  - **Giant Net Worth Display:**
    - Total net worth (center, large)
    - Real-time calculation
  - **Breakdown Grid:**
    - Total assets
    - Total liabilities
    - Net assets
  - **Four Tabs:**
    1. **Assets:**
       - Bank accounts (savings, current, FDs)
       - Balance breakdown by account
    2. **Investments:**
       - Mutual funds, stocks, PPF, EPF, NPS
       - Current value, invested amount
       - Returns percentage
       - Color-coded (green=profit, red=loss)
    3. **Liabilities:**
       - Credit cards
       - Personal loans, home loans, car loans
       - Outstanding amounts
       - EMI details
    4. **Precious Metals:**
       - Gold holdings (grams + value)
       - Silver holdings (grams + value)
       - Total valuation
       - Current rates per gram
- **API Integration:**
  - `GET /aggregated/net-worth` - Complete net worth data
  - `GET /aggregated/investments` - Investment portfolio
  - `GET /aggregated/liabilities` - All liabilities
- **Special Features:**
  - Precious metals valuation included in net worth
  - Real-time gold/silver rates from API

---

#### 6. Cards Page
**Route:** `/cards` (http://localhost:3000/cards)
- **Purpose:** View and manage credit cards
- **Features:**
  - **3D Card Display:**
    - Animated card flip on hover
    - Front: Card number (masked), holder name, expiry, bank
    - Back: Full card number, CVV, variant, limit usage
  - **Credit Card Details:**
    - Bank name and card type
    - Card variant (Regalia, Coral, etc.)
    - Credit limit
    - Used amount
    - Usage percentage with progress bar
  - **Monthly Limit Control:**
    - Slider to adjust spending limit
    - Real-time available credit display
  - **Card Types Supported:**
    - VISA, Mastercard, RuPay, AMEX
  - **Grid Layout:**
    - Responsive: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **API Integration:**
  - `GET /auth/profile` - Get user's credit cards
  - `GET /aggregated/liabilities` - Get credit card balances
- **Card Gradients:**
  - HDFC Bank: Blue gradient
  - ICICI Bank: Orange gradient
  - SBI Card: Green gradient
  - Axis Bank: Purple gradient
- **Empty State:** Shows message if no cards found

---

#### 7. Profile Page
**Route:** `/profile` (http://localhost:3000/profile)
- **Purpose:** User profile and complete financial overview
- **Features:**
  - **Giant Stats:**
    - Total net worth
    - Total investments
    - Total accounts
  - **Four Tabs:**
    1. **Cards Tab:**
       - All linked accounts (not just credit cards!)
       - Account type, bank name, masked number
       - Current balance
       - Status (active/inactive)
    2. **Investments Tab:**
       - All investments with scheme names
       - Investment type (Mutual Fund, Equity, PPF, etc.)
       - Current value
       - Returns percentage
       - Color-coded by performance
    3. **Transactions Tab:**
       - Recent 10 transactions
       - Date, category, narration
       - Amount with type (credit/debit)
       - Color coding
    4. **Analytics Tab:**
       - **Spend Analysis:**
         - Category-wise breakdown
         - Percentage bars
         - Amount spent per category
       - **Financial Summary:**
         - Total assets
         - Total liabilities
- **API Integration:**
  - `GET /auth/profile` - User profile
  - `GET /aggregated/net-worth` - Net worth breakdown
  - `GET /aggregated/investments` - Investment data
  - `GET /accounts` - All accounts
  - `GET /aggregated/transactions` - Transaction history
- **Loading States:** Each tab shows loading indicator

---

## 🎨 Design System

### Color Scheme (DO NOT CHANGE)
```css
Primary Background: #0B0E14 (Dark)
Accent Coral: #FF9D9D (Expenses, negative values)
Accent Aqua: #95E1D3 (Income, positive values)
Text Primary: #FFFFFF
Text Body: #F5F5F5
Border Subtle: rgba(255, 157, 157, 0.15)
```

### Typography
- Font Family: Space Grotesk (monospace fallback)
- Headers: Uppercase, wide letter spacing
- Numbers: Tabular nums for alignment

### Navigation Bar
- Sticky top navigation
- Active route highlighting (aqua underline)
- Icons + text labels
- Logout button on right
- Responsive (hides text on mobile)

---

## 🔄 User Flow

### First Time User
1. Land on `/` (homepage)
2. Click "Login" → `/login`
3. Switch to "Sign Up" tab
4. Fill registration form
5. Submit → Auto-generates financial data
6. Redirects to `/chat` (dashboard)

### Returning User
1. Go to `/login`
2. Enter AA handle and PIN
3. Login → Redirects to `/chat`
4. Navigate between pages using top navbar

### Navigation Between Pages
- **From any authenticated page:**
  - Click navbar links to switch pages
  - Active page highlighted in aqua
  - Click "Logout" to return to `/login`

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 768px
  - Single column layouts
  - Hidden text labels in navbar (icons only)
  - Stacked cards
- **Tablet:** 768px - 1024px
  - 2-column grids
  - Compact navigation
- **Desktop:** > 1024px
  - 3-column grids
  - Full navigation with labels
  - Optimal viewing experience

---

## 🔐 Authentication Flow

### How It Works
1. User logs in via `/login`
2. API returns user data with `_id` (MongoDB ObjectId)
3. Frontend stores in localStorage:
   - `user_id`: MongoDB ObjectId
   - `user_data`: User profile JSON
4. All API calls automatically append `?user_id={userId}` to requests
5. No JWT tokens needed (no-auth mode)

### Protected Routes
All routes except `/` and `/login` check for `user_id` in localStorage:
- If missing → Redirect to `/login`
- If present → Load and display data

---

## 🧪 Testing Routes

### 1. Test Landing Page
```bash
# Open browser
http://localhost:3000/

# Should see:
- FinanceHub hero section
- Features section
- Login button
```

### 2. Test Login
```bash
http://localhost:3000/login

# Login with:
AA Handle: 9876543210@anumati
PIN: 1234

# Should redirect to /chat
```

### 3. Test All Pages
After logging in, test each route:
```bash
http://localhost:3000/chat         # Dashboard
http://localhost:3000/transactions  # Transactions
http://localhost:3000/networth      # Net Worth
http://localhost:3000/cards         # Credit Cards
http://localhost:3000/profile       # Profile
```

### 4. Test Navigation
- Click each nav link in the top bar
- Verify active highlighting
- Check data loads correctly
- Test logout button

---

## ⚠️ Common Issues & Solutions

### Issue: "No data showing"
**Solution:**
- Make sure you're logged in
- Check browser console for errors
- Verify `user_id` in localStorage: Open DevTools → Application → Local Storage

### Issue: "Transactions are empty"
**Solution:**
- Use date range May-November 2025 (that's when API has data)
- Check API endpoint in Network tab

### Issue: "Cards page is blank"
**Solution:**
- Not all users have credit cards in profile
- Register a new user with credit cards
- Or use a user that has cards (check `/auth/users`)

### Issue: "Navigation doesn't work"
**Solution:**
- Check if NavBar component is imported correctly
- Verify Next.js Link components are used
- Clear browser cache and reload

### Issue: "Styles look broken"
**Solution:**
- Run `npm install` to ensure all dependencies
- Check `globals.css` is imported in `layout.tsx`
- Verify Tailwind CSS is configured

---

## 🚀 Future Endpoints

### Chat Endpoint (Coming Soon)
**Location:** `app/chat/page.tsx`
**Configuration:** Update `NEXT_PUBLIC_CHAT_API_URL` in `.env.local`
**Usage:**
```typescript
// Will send messages to backend AI
POST /chat
Body: { message: string, user_id: string }
Response: { content: string, suggestions?: string[], artifact?: {...} }
```

### Optimize Spending Endpoint (Coming Soon)
**Configuration:** Update `NEXT_PUBLIC_OPTIMIZE_SPENDING_URL` in `.env.local`
**Usage:**
```typescript
// Will get spending optimization suggestions
GET /optimize-spending?user_id={userId}
Response: { recommendations: [...], totalSavingsPotential: number }
```

---

## 📊 Data Flow Summary

```
User Login → localStorage (user_id + user_data)
    ↓
Page Load → Check user_id exists
    ↓
API Call → Append ?user_id={userId}
    ↓
Anumati API → Returns user-specific data
    ↓
Frontend → Display formatted data
```

---

## 🎯 Quick Reference

| Page | Route | Main Feature | API Endpoint |
|------|-------|--------------|--------------|
| Landing | `/` | Marketing | None |
| Login | `/login` | Auth | `/auth/login` |
| Dashboard | `/chat` | AI Chat + Overview | `/aggregated/net-worth`, `/aggregated/transactions` |
| Transactions | `/transactions` | Transaction History | `/aggregated/transactions`, `/aggregated/monthly-spending` |
| Net Worth | `/networth` | Wealth Overview | `/aggregated/net-worth`, `/aggregated/investments`, `/aggregated/liabilities` |
| Cards | `/cards` | Credit Cards | `/auth/profile`, `/aggregated/liabilities` |
| Profile | `/profile` | User Details | `/auth/profile`, `/accounts`, `/aggregated/*` |

---

## 📞 Support

For route-related issues:
1. Check this guide first
2. Review `INTEGRATION_GUIDE.md` for API details
3. Check browser console for errors
4. Verify localStorage has `user_id`
5. Test API endpoints directly using curl/Postman

---

**Last Updated:** 2025-11-29
**Version:** 2.0
**Status:** ✅ All routes integrated and tested
