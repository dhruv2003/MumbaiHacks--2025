# 💰 FinanceHub - AI-Powered Personal Finance Manager

**Team Name:** OldMonks

[![Watch Demo](https://img.shields.io/badge/YouTube-Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/Wmo-5Xl3Kms)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/dhruv2003/MumbaiHacks--2025/)

---

## 🎯 Project Overview

FinanceHub is a minimalist, AI-powered personal finance management platform that aggregates all your financial accounts, tracks your net worth, and provides intelligent insights through an interactive chat interface. Built with a "1988 Miami Minimalism" aesthetic inspired by PoolSuite, FinanceHub combines powerful financial analytics with a clean, retro-modern design.

## ✨ Key Features

### 🤖 **AI Financial Advisor**
- Interactive chat interface powered by AI
- Real-time financial insights and recommendations
- Natural language processing for financial queries
- Personalized spending analysis and budgeting advice
- Visual data representation with dynamic charts (doughnut, bar, line)

### 📊 **Comprehensive Dashboard**
- **Net Worth Tracking**: Real-time aggregation of all assets and liabilities
- **Transaction Management**: Categorized transaction history with filtering
- **Investment Portfolio**: Track stocks, mutual funds, and other investments
- **Credit Card Management**: Monitor multiple cards with detailed breakdowns
- **Goal Setting**: Create and track financial goals with progress indicators

### 🎨 **Modern Minimalist Design**
- Clean, distraction-free interface
- Retro-inspired color palette (Coral & Aqua accents)
- Responsive layout with smooth animations
- Dark mode optimized for comfortable viewing
- Space Grotesk typography for enhanced readability

### 🔐 **Smart Authentication**
- User registration with comprehensive financial profile setup
- Support for dependents and family member tracking
- Multiple credit card linking
- Precious metals portfolio integration (gold/silver)

### 📈 **Data Visualization**
- Interactive charts powered by Chart.js
- Real-time spending breakdown by category
- Portfolio performance tracking
- Monthly spending trends
- Visual goal progress indicators

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4 + Custom CSS Variables
- **Animations**: Framer Motion
- **Charts**: Chart.js + react-chartjs-2
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives
- **State Management**: React Hooks
- **Font**: Space Grotesk (Google Fonts)

### **Backend**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **AI Integration**: External AI API (Gemini-based)
- **Session Management**: Local storage with session IDs
- **API Architecture**: RESTful endpoints

### **AI & Analytics**
- **AI Model**: Custom financial advisor agent
- **Natural Language Processing**: Intent recognition for financial queries
- **Data Analysis**: Transaction categorization and spending pattern detection
- **Chart Generation**: Dynamic JSON-based chart data from AI responses

## 📁 Project Structure

```
MumbaiHacks--2025/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── chat/           # AI chat interface
│   │   ├── login/          # Authentication
│   │   ├── transactions/   # Transaction history
│   │   ├── networth/       # Net worth dashboard
│   │   ├── cards/          # Credit card management
│   │   └── profile/        # User profile
│   ├── components/          # Reusable React components
│   │   ├── chat/           # Chat interface components
│   │   ├── layout/         # Navigation and layout
│   │   ├── ui/             # UI primitives (Radix)
│   │   └── payment/        # Payment modals
│   ├── lib/                 # Utility functions and API clients
│   └── public/             # Static assets
│
├── anumati-api/             # Backend API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Auth & error handling
│   └── data/               # Mock data and cache
│
└── README.md               # You are here!
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- MongoDB instance running
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dhruv2003/MumbaiHacks--2025.git
cd MumbaiHacks--2025
```

2. **Setup Backend**
```bash
cd anumati-api
npm install
```

Create `.env` file:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:
```bash
npm run dev
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_CHAT_API_URL=https://your-ai-api-url.com/api
```

Start the frontend:
```bash
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 💡 Usage Guide

### For Users

1. **Registration**: Create account with comprehensive financial profile
2. **Link Accounts**: Add credit cards, investments, and assets
3. **Chat with AI**: Ask questions like:
   - "What's my spending pattern this month?"
   - "Can I afford a flight to London?"
   - "Show me my investment breakdown"
4. **Track Goals**: Set and monitor financial goals
5. **Analyze Transactions**: Filter and categorize spending

### For Developers

#### API Endpoints
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/account/networth` - Get net worth data
- `GET /api/v1/account/transactions` - Get transactions
- `POST /api/chat` - AI chat interactions

#### Chat Integration
The AI chat supports JSON chart rendering. To display charts, the AI response should include:

```json
{
  "type": "chart",
  "chartType": "doughnut",
  "title": "Spending Breakdown",
  "data": {
    "labels": ["Category1", "Category2"],
    "datasets": [{
      "data": [value1, value2],
      "backgroundColor": ["#FF9D9D", "#95E1D3"]
    }]
  }
}
```

## 🎨 Design Philosophy

### PoolSuite-Inspired Minimalism
- **Clean Typography**: Large, readable fonts with generous spacing
- **Limited Color Palette**: Coral (#FF9D9D) and Aqua (#95E1D3) accents
- **Ample Whitespace**: Focus on content, not clutter
- **Subtle Animations**: Smooth transitions without distraction
- **Data-First**: Giant numbers and clear visual hierarchy

### Accessibility
- High contrast text for readability
- Keyboard navigation support
- Responsive design for all screen sizes
- Clear visual feedback for interactions

## 📸 Screenshots

Check out our demo video below to see all features in action!

## 🎥 Demo Video

Watch our complete walkthrough and feature demonstration:

[![FinanceHub Demo](https://img.youtube.com/vi/Wmo-5Xl3Kms/maxresdefault.jpg)](https://youtu.be/Wmo-5Xl3Kms)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of Mumbai Hacks 2025 hackathon submission.

## 👥 Team OldMonks

Built with ❤️ for Mumbai Hacks 2025

---

## 🔗 Links

- **Live Demo**: [Add deployment URL]
- **Demo Video**: https://youtu.be/Wmo-5Xl3Kms
- **GitHub**: https://github.com/dhruv2003/MumbaiHacks--2025/
- **Documentation**: [Add docs link if available]

---

### 🌟 Star this repo if you find it useful!

**Built by Team OldMonks** | Mumbai Hacks 2025
