import { Request, Response } from 'express';
import { AggregationService } from '../services/aggregation.service';
import { db } from '../services/mongodb.service';

export class AggregatedController {
  static async getNetWorth(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const netWorth = await AggregationService.calculateNetWorth(userId);

      res.json({
        success: true,
        data: netWorth
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getAccountsSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const accounts = await db.getAccountsByUserId(userId);

      const summary = accounts.map(acc => ({
        id: acc.id,
        fipName: acc.fipName,
        accountType: acc.accountType,
        maskedAccNumber: acc.maskedAccNumber,
        currentBalance: acc.currentBalance,
        status: acc.status
      }));

      const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

      res.json({
        success: true,
        data: {
          count: accounts.length,
          totalBalance: parseFloat(totalBalance.toFixed(2)),
          accounts: summary
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const { from, to, category, limit = '100', offset = '0' } = req.query;

      const summary = await AggregationService.getTransactionsSummary(
        userId,
        from as string,
        to as string,
        category as string
      );

      // Pagination
      const limitNum = parseInt(limit as string, 10);
      const offsetNum = parseInt(offset as string, 10);
      const paginatedTransactions = summary.transactions.slice(offsetNum, offsetNum + limitNum);

      const transactionsWithAccounts = await Promise.all(
        paginatedTransactions.map(async (txn) => {
          const account = await db.getAccountById(txn.accountId);
          return {
            id: txn.id,
            date: txn.transactionTimestamp,
            type: txn.type,
            amount: txn.amount,
            category: txn.category,
            mode: txn.mode,
            merchantName: txn.merchantName,
            narration: txn.narration,
            account: {
              bank: account?.fipName,
              maskedNumber: account?.maskedAccNumber
            }
          };
        })
      );

      res.json({
        success: true,
        data: {
          total: summary.totalTransactions,
          limit: limitNum,
          offset: offsetNum,
          totalCredits: summary.totalCredits,
          totalDebits: summary.totalDebits,
          netFlow: summary.netFlow,
          categoryBreakdown: summary.categoryBreakdown,
          transactions: transactionsWithAccounts
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getLiabilities(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const liabilities = await db.getLiabilitiesByUserId(userId);

      const totalOutstanding = liabilities
        .filter(lib => lib.status === 'ACTIVE')
        .reduce((sum, lib) => sum + lib.outstandingAmount, 0);

      const totalEMI = liabilities
        .filter(lib => lib.status === 'ACTIVE' && lib.emiAmount)
        .reduce((sum, lib) => sum + (lib.emiAmount || 0), 0);

      res.json({
        success: true,
        data: {
          count: liabilities.length,
          totalOutstanding: parseFloat(totalOutstanding.toFixed(2)),
          totalMonthlyEMI: parseFloat(totalEMI.toFixed(2)),
          liabilities: liabilities.map(lib => ({
            id: lib.id,
            type: lib.type,
            provider: lib.provider,
            outstandingAmount: lib.outstandingAmount,
            emiAmount: lib.emiAmount,
            tenure: lib.tenure,
            interestRate: lib.interestRate,
            status: lib.status
          }))
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getInvestments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const investments = await db.getInvestmentsByUserId(userId);

      const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
      const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
      const totalReturns = totalCurrentValue - totalInvested;
      const avgReturns = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

      res.json({
        success: true,
        data: {
          count: investments.length,
          totalInvested: parseFloat(totalInvested.toFixed(2)),
          totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
          totalReturns: parseFloat(totalReturns.toFixed(2)),
          averageReturnsPercentage: parseFloat(avgReturns.toFixed(2)),
          investments: investments.map(inv => ({
            id: inv.id,
            type: inv.type,
            provider: inv.provider,
            schemeName: inv.schemeName,
            currentValue: inv.currentValue,
            investedAmount: inv.investedAmount,
            returns: inv.returns,
            returnsPercentage: inv.returnsPercentage,
            status: inv.status
          }))
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getMonthlySpending(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const { months = '6' } = req.query;
      const monthlyData = await AggregationService.getMonthlySpending(userId, parseInt(months as string, 10));

      res.json({
        success: true,
        data: monthlyData
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getIncomeSources(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const incomeSources = await AggregationService.getIncomeSources(userId);

      res.json({
        success: true,
        data: {
          sources: incomeSources
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
