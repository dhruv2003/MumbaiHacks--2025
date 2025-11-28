import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  mongodb: {
    uri: process.env.MONGODB_URI || '',
    dbName: process.env.MONGODB_DB_NAME || 'anumati_db'
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || ''
  },

  rates: {
    goldPerGram: parseFloat(process.env.GOLD_RATE_PER_GRAM || '13070'),
    silverPerGram: parseFloat(process.env.SILVER_RATE_PER_GRAM || '176')
  },

  dataGeneration: {
    usersCount: parseInt(process.env.USERS_COUNT || '10', 10),
    transactionsPerAccount: parseInt(process.env.TRANSACTIONS_PER_ACCOUNT || '300', 10),
    monthsOfHistory: parseInt(process.env.MONTHS_OF_HISTORY || '6', 10)
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  }
};
