import { config } from '../config/env';
import { db } from './mongodb.service';
import { generateUsers, generateMasterUser } from '../generators/user.generator';
import { generateAccounts } from '../generators/account.generator';
import { generateMonthlyTransactions } from '../generators/transaction.generator';
import { generateInvestments } from '../generators/investment.generator';
import { generateLiabilities } from '../generators/liability.generator';
import { randomInt } from '../utils/helpers';
import { logger } from '../utils/logger';

export const initializeData = async (): Promise<void> => {
  try {
    logger.info('Starting data generation...');

    const usersCount = config.dataGeneration.usersCount;
    const monthsOfHistory = config.dataGeneration.monthsOfHistory;

    // Check if data already exists
    const stats = await db.getStats();
    if (stats.users > 0) {
      logger.info('✓ Data already exists in MongoDB');
      logger.info(`Stats: ${JSON.stringify(stats, null, 2)}`);

      // Log sample credentials
      const users = await db.getAllUsers();
      if (users.length > 0) {
        // Find master user
        const masterUser = users.find(u => u.mobile === (process.env.MASTER_MOBILE || '9999999999'));
        const sampleUser = users.find(u => u.mobile !== (process.env.MASTER_MOBILE || '9999999999')) || users[0];
        
        logger.info('\n========================================');
        if (masterUser) {
          logger.info('🔑 MASTER USER (AGENT ACCESS):');
          logger.info(`AA Handle: ${masterUser.aaHandle}`);
          logger.info(`Mobile: ${masterUser.mobile}`);
          logger.info(`PIN: ${process.env.MASTER_PIN || '9999'}`);
          logger.info('========================================');
        }
        logger.info('\nSAMPLE REGULAR USER:');
        logger.info(`AA Handle: ${sampleUser.aaHandle}`);
        logger.info(`Mobile: ${sampleUser.mobile}`);
        logger.info(`PIN: 1234 (default for all users)`);
        logger.info('========================================\n');
      }
      return;
    }

    // Generate master user for agent access
    logger.info('Creating master user for agent access...');
    const masterUser = await generateMasterUser();
    const masterMongoId = await db.createUser(masterUser);
    logger.info(`✓ Created master user: ${masterUser.aaHandle}`);

    // Generate users
    logger.info(`Generating ${usersCount} users...`);
    const users = await generateUsers(usersCount);

    const userIdMap = new Map<string, string>();
    userIdMap.set(masterUser.id, masterMongoId);

    for (const user of users) {
      const mongoId = await db.createUser(user);
      userIdMap.set(user.id, mongoId);
    }

    logger.info(`✓ Generated ${users.length} users`);

    // Generate accounts, transactions, investments, and liabilities for each user
    const allUsers = [masterUser, ...users];
    for (const user of allUsers) {
      const mongoUserId = userIdMap.get(user.id)!;
      // Generate 2-5 accounts per user
      const accountsCount = randomInt(2, 5);
      const accounts = generateAccounts(user, accountsCount);

      for (const account of accounts) {
        // Update account userId to MongoDB ID
        account.userId = mongoUserId;

        // Generate transactions for each account
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsOfHistory);

        const transactions = generateMonthlyTransactions(account, startDate, monthsOfHistory);
        account.transactions = transactions;

        // Update account balance to match last transaction
        if (transactions.length > 0) {
          const lastTransaction = transactions[transactions.length - 1];
          account.currentBalance = lastTransaction.currentBalance;
          account.summary.currentBalance = lastTransaction.currentBalance;
        }

        await db.createAccount(account);
      }

      // Generate 3-8 investments per user
      const investmentsCount = randomInt(3, 8);
      const investments = generateInvestments(user, investmentsCount);

      for (const investment of investments) {
        investment.userId = mongoUserId;
        await db.createInvestment(investment);
      }

      // Generate 0-3 liabilities per user (not everyone has loans)
      const liabilitiesCount = randomInt(0, 3);
      if (liabilitiesCount > 0) {
        const liabilities = generateLiabilities(user, liabilitiesCount);

        for (const liability of liabilities) {
          liability.userId = mongoUserId;
          await db.createLiability(liability);
        }
      }
    }

    const finalStats = await db.getStats();
    logger.info('✓ Data generation completed successfully!');
    logger.info(`Stats: ${JSON.stringify(finalStats, null, 2)}`);

    // Log master and sample credentials
    logger.info('\n========================================');
    logger.info('🔑 MASTER USER (AGENT ACCESS):');
    logger.info(`AA Handle: ${masterUser.aaHandle}`);
    logger.info(`Mobile: ${masterUser.mobile}`);
    logger.info(`PIN: ${process.env.MASTER_PIN || '9999'}`);
    logger.info('========================================');
    logger.info('\nSAMPLE REGULAR USER:');
    logger.info(`AA Handle: ${users[0].aaHandle}`);
    logger.info(`Mobile: ${users[0].mobile}`);
    logger.info(`PIN: 1234 (default for all users)`);
    logger.info('========================================\n');

  } catch (error) {
    logger.error('Error during data generation:', error);
    throw error;
  }
};
