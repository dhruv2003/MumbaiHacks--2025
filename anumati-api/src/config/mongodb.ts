import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

export const connectMongoDB = async (): Promise<void> => {
  try {
    if (!config.mongodb.uri) {
      throw new Error('MongoDB URI is not configured');
    }

    await mongoose.connect(config.mongodb.uri, {
      dbName: config.mongodb.dbName
    });

    logger.info('✓ MongoDB connected successfully');
    logger.info(`✓ Database: ${config.mongodb.dbName}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB error:', error);
});
