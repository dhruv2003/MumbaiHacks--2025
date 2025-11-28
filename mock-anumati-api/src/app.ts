import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { connectMongoDB } from './config/mongodb';
import { logger } from './utils/logger';
import { initializeData } from './services/data-generator.service';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';

const app: Application = express();

// Trust proxy setting for production (behind reverse proxy)
if (config.server.trustProxy) {
  app.set('trust proxy', true);
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: config.cors.origin })); // CORS
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});
app.use('/api/', limiter);

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Mock Anumati API - Account Aggregator Service',
      version: '1.0.0',
      documentation: '/api/v1/health',
      endpoints: {
        health: '/api/v1/health',
        auth: '/api/v1/auth/*',
        accounts: '/api/v1/accounts/*',
        aggregated: '/api/v1/aggregated/*',
        search: '/api/v1/search/*'
      }
    }
  });
});

app.use('/api/v1', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize and start server
const startServer = async () => {
  try {
    logger.info('🚀 Starting Mock Anumati API Server...');

    // Connect to MongoDB
    await connectMongoDB();

    // Initialize data
    await initializeData();

    // Start server
    app.listen(config.port, () => {
      logger.info(`✓ Server running on port ${config.port}`);
      logger.info(`✓ Environment: ${config.nodeEnv}`);
      logger.info(`✓ API Base URL: http://localhost:${config.port}/api/v1`);
      logger.info('\n📚 Available Endpoints:');
      logger.info('   - POST /api/v1/auth/login');
      logger.info('   - POST /api/v1/auth/form (submit user form data)');
      logger.info('   - GET  /api/v1/auth/profile');
      logger.info('   - GET  /api/v1/auth/users (list all test users)');
      logger.info('   - GET  /api/v1/accounts');
      logger.info('   - GET  /api/v1/aggregated/net-worth');
      logger.info('   - GET  /api/v1/aggregated/transactions');
      logger.info('   - GET  /api/v1/aggregated/investments');
      logger.info('   - GET  /api/v1/aggregated/liabilities');
      logger.info('\n🔐 Default PIN for all users: 1234');
      logger.info('💡 Tip: Visit /api/v1/auth/users to see all available test accounts\n');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();

export default app;
