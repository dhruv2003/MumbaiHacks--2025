import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AccountController } from '../controllers/account.controller';
import { AggregatedController } from '../controllers/aggregated.controller';
import { FormController } from '../controllers/form.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString()
    }
  });
});

// Auth routes
router.post('/auth/register', FormController.register); // Public - register new user
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', authenticateToken, AuthController.logout);
router.post('/auth/verify-otp', AuthController.verifyOTP);
router.get('/auth/profile', authenticateToken, AuthController.getProfile);
router.get('/auth/users', AuthController.listUsers); // For testing - list all users

// Form route (protected - for updating existing user)
router.post('/auth/form', authenticateToken, FormController.submitForm);

// Account routes
router.post('/accounts/discover', authenticateToken, AccountController.discoverAccounts);
router.get('/accounts', authenticateToken, AccountController.getAllAccounts);
router.get('/accounts/:accountId', authenticateToken, AccountController.getAccountById);

// Aggregated data routes
router.get('/aggregated/net-worth', authenticateToken, AggregatedController.getNetWorth);
router.get('/aggregated/accounts-summary', authenticateToken, AggregatedController.getAccountsSummary);
router.get('/aggregated/transactions', authenticateToken, AggregatedController.getTransactions);
router.get('/aggregated/liabilities', authenticateToken, AggregatedController.getLiabilities);
router.get('/aggregated/investments', authenticateToken, AggregatedController.getInvestments);
router.get('/aggregated/monthly-spending', authenticateToken, AggregatedController.getMonthlySpending);
router.get('/aggregated/income-sources', authenticateToken, AggregatedController.getIncomeSources);


export default router;
