import { Request, Response } from 'express';
import { db } from '../services/mongodb.service';

export class AccountController {
  static async discoverAccounts(req: Request, res: Response): Promise<void> {
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

      res.json({
        success: true,
        data: {
          count: accounts.length,
          accounts: accounts.map(acc => ({
            id: acc.id,
            fipName: acc.fipName,
            accountType: acc.accountType,
            maskedAccNumber: acc.maskedAccNumber,
            status: acc.status
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

  static async getAllAccounts(req: Request, res: Response): Promise<void> {
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

      res.json({
        success: true,
        data: {
          count: accounts.length,
          accounts: accounts.map(acc => ({
            id: acc.id,
            type: acc.type,
            fipName: acc.fipName,
            accountType: acc.accountType,
            maskedAccNumber: acc.maskedAccNumber,
            currentBalance: acc.currentBalance,
            currency: acc.currency,
            status: acc.status,
            branch: acc.branch,
            ifscCode: acc.ifscCode,
            openingDate: acc.openingDate
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

  static async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { accountId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const account = await db.getAccountById(accountId);

      if (!account || account.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Account not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          account: {
            id: account.id,
            type: account.type,
            fipId: account.fipId,
            fipName: account.fipName,
            accountType: account.accountType,
            maskedAccNumber: account.maskedAccNumber,
            currentBalance: account.currentBalance,
            currency: account.currency,
            status: account.status,
            branch: account.branch,
            ifscCode: account.ifscCode,
            openingDate: account.openingDate,
            profile: account.profile,
            summary: account.summary,
            transactionsCount: account.transactions.length
          }
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
