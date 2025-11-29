# FinanceHub - Personal Finance Management Platform

A comprehensive fintech application built with Next.js that aggregates financial data from multiple sources using the RBI-licensed Account Aggregator framework. Get AI-powered insights, track spending, monitor net worth, and manage your complete financial picture in one beautiful interface.

## Features

### 🏠 Landing Page
- Modern, premium fintech design with gradient effects
- Feature highlights and navigation to all main sections
- Responsive layout with smooth animations

### 💬 AI Financial Chat
- Natural language interface for financial queries
- Real-time financial insights sidebar showing:
  - Current net worth breakdown
  - Recent transactions
  - Quick account statistics
  - AI-powered suggestions
- Toggle insights panel on/off

### 💳 Transactions Page
- Comprehensive transaction history with filtering
- Monthly spending trends visualization
- Category-wise transaction breakdown
- Income vs. expense analytics
- Export and filter capabilities

### 📊 Net Worth Page
- Complete financial overview with asset allocation
- Track financial goals with progress indicators
- Detailed breakdowns of:
  - Bank accounts (Savings, Current)
  - Investments (Mutual Funds, Stocks, PPF, EPF, NPS)
  - Liabilities (Credit Cards, Loans)
  - Precious Metals (Gold, Silver)
- Visual progress bars and statistics

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + Custom Components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Integration**: Anumati Account Aggregator Mock API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Anumati Mock API running (see API_README.md)

### Installation

1. **Clone the repository**
   ```bash
   cd Concr1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env.local` file is already configured with default values:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
   NEXT_PUBLIC_DEFAULT_AA_HANDLE=9876543210@anumati
   NEXT_PUBLIC_DEFAULT_PIN=1234
   NEXT_PUBLIC_APP_NAME=FinanceHub
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3001](http://localhost:3001) (or the port shown in terminal)

## Project Structure

```
Concr1/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/
│   │   └── page.tsx          # AI Chat with insights sidebar
│   ├── transactions/
│   │   └── page.tsx          # Transactions & analytics
│   ├── networth/
│   │   └── page.tsx          # Net worth & goals
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── auth/
│   │   └── LoginCard.tsx     # Login component
│   ├── chat/                 # Chat components
│   ├── payment/              # Payment components
│   └── ui/                   # Reusable UI components
├── lib/
│   └── api.ts                # API utility functions
├── .env.local                # Environment configuration
└── API_README.md             # API documentation
```

## API Integration

This application integrates with the Anumati Account Aggregator Mock API. The API provides:

- **Authentication**: JWT-based login with AA handle and PIN
- **Account Aggregation**: Bank accounts, credit cards, investments
- **Transactions**: Detailed transaction history with categorization
- **Net Worth**: Comprehensive financial overview
- **Analytics**: Spending patterns, income sources, monthly trends

### Key API Endpoints

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/aggregated/net-worth` - Net worth data
- `GET /api/v1/aggregated/transactions` - Transaction history
- `GET /api/v1/aggregated/investments` - Investment portfolio
- `GET /api/v1/aggregated/liabilities` - Loans and liabilities
- `GET /api/v1/aggregated/monthly-spending` - Spending analytics

See `API_README.md` for complete API documentation.

## Usage

### Login

1. Navigate to the Login page
2. Default credentials are pre-filled:
   - **AA Handle**: `9876543210@anumati`
   - **PIN**: `1234`
3. Click "Sign In" to access the dashboard

### Exploring Features

- **Chat**: Ask questions about your finances, get AI-powered insights
- **Transactions**: View and filter your transaction history
- **Net Worth**: Monitor your complete financial picture and goals
- **Navigation**: Use the header navigation to switch between sections

## Design Philosophy

### Premium Fintech Aesthetic

- **Color Palette**: Carefully curated gradients using chart colors
- **Typography**: Clean, modern fonts with proper hierarchy
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design that works on all devices
- **Dark Mode**: Optimized for dark theme by default

### User Experience

- **Intuitive Navigation**: Clear paths between all major features
- **Real-time Data**: Live updates from the API
- **Visual Feedback**: Loading states, hover effects, and transitions
- **Accessibility**: Semantic HTML and ARIA labels

## Development

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

### Linting

```bash
npm run lint
```

## Environment Variables

All configuration is stored in `.env.local`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the API | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_DEFAULT_AA_HANDLE` | Default AA handle for login | `9876543210@anumati` |
| `NEXT_PUBLIC_DEFAULT_PIN` | Default PIN for login | `1234` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `FinanceHub` |

## Features Roadmap

- [ ] Real-time notifications for transactions
- [ ] Budget planning and tracking
- [ ] Bill payment reminders
- [ ] Investment recommendations
- [ ] Tax planning insights
- [ ] Multi-user support
- [ ] Mobile app (React Native)

## Security

- JWT token-based authentication
- Secure API communication
- Environment variable configuration
- No sensitive data in client-side code

## Contributing

This is a demonstration project built for showcasing fintech UI/UX capabilities and Account Aggregator integration.

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Built with the Anumati Account Aggregator Mock API
- Inspired by modern fintech applications
- Designed for the Indian financial ecosystem

---

**Made with ❤️ for better financial management**
