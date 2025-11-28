import { NetWorth, Transaction } from '../types';
import { db } from './mongodb.service';
import { config } from '../config/env';

export class AggregationService {
  static async calculateNetWorth(userId: string): Promise<NetWorth> {
    const user = await db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accounts = await db.getAccountsByUserId(userId);
    const investments = await db.getInvestmentsByUserId(userId);
    const liabilities = await db.getLiabilitiesByUserId(userId);

    // Calculate precious metals value
    const goldValue = user.preciousMetals.gold * config.rates.goldPerGram;
    const silverValue = user.preciousMetals.silver * config.rates.silverPerGram;
    const preciousMetalsTotal = goldValue + silverValue;

    // Calculate assets
    const bankAccountsTotal = accounts
      .filter(acc => ['DEPOSIT', 'TERM_DEPOSIT', 'RECURRING_DEPOSIT'].includes(acc.type))
      .reduce((sum, acc) => sum + acc.currentBalance, 0);

    const investmentsTotal = investments
      .filter(inv => inv.status === 'ACTIVE' || inv.status === 'MATURED')
      .reduce((sum, inv) => sum + inv.currentValue, 0);

    const fixedDepositsTotal = investments
      .filter(inv => inv.type === 'TERM_DEPOSIT')
      .reduce((sum, inv) => sum + inv.currentValue, 0);

    const assetsTotal = bankAccountsTotal + investmentsTotal + preciousMetalsTotal;

    // Calculate liabilities
    const creditCardsTotal = liabilities
      .filter(lib => lib.type === 'CREDIT_CARD' && lib.status === 'ACTIVE')
      .reduce((sum, lib) => sum + lib.outstandingAmount, 0);

    const loansTotal = liabilities
      .filter(lib => lib.type !== 'CREDIT_CARD' && lib.status === 'ACTIVE')
      .reduce((sum, lib) => sum + lib.outstandingAmount, 0);

    const liabilitiesTotal = creditCardsTotal + loansTotal;

    // Calculate net worth
    const netAssets = assetsTotal - liabilitiesTotal;

    // Count accounts
    const savingsCount = accounts.filter(acc => acc.accountType === 'SAVINGS').length;
    const currentCount = accounts.filter(acc => acc.accountType === 'CURRENT').length;
    const creditCardsCount = liabilities.filter(lib => lib.type === 'CREDIT_CARD').length;
    const investmentsCount = investments.length;
    const loansCount = liabilities.filter(lib => lib.type !== 'CREDIT_CARD').length;

    return {
      userId: user.id,
      aaHandle: user.aaHandle,
      netWorth: parseFloat(netAssets.toFixed(2)),
      asOfDate: new Date().toISOString(),
      breakdown: {
        assets: {
          bankAccounts: parseFloat(bankAccountsTotal.toFixed(2)),
          investments: parseFloat(investmentsTotal.toFixed(2)),
          fixedDeposits: parseFloat(fixedDepositsTotal.toFixed(2)),
          total: parseFloat(assetsTotal.toFixed(2))
        },
        liabilities: {
          creditCards: parseFloat(creditCardsTotal.toFixed(2)),
          loans: parseFloat(loansTotal.toFixed(2)),
          total: parseFloat(liabilitiesTotal.toFixed(2))
        },
        netAssets: parseFloat(netAssets.toFixed(2))
      },
      accounts: {
        savings: savingsCount,
        current: currentCount,
        creditCards: creditCardsCount,
        investments: investmentsCount,
        loans: loansCount
      }
    };
  }

  static async getTransactionsSummary(
    userId: string,
    from?: string,
    to?: string,
    category?: string
  ): Promise<{
    totalTransactions: number;
    totalCredits: number;
    totalDebits: number;
    netFlow: number;
    transactions: Transaction[];
    categoryBreakdown: Record<string, number>;
  }> {
    let transactions = await db.getTransactionsByUserId(userId);

    // Filter by date range
    if (from) {
      const fromDate = new Date(from);
      transactions = transactions.filter(txn =>
        new Date(txn.transactionTimestamp) >= fromDate
      );
    }

    if (to) {
      const toDate = new Date(to);
      transactions = transactions.filter(txn =>
        new Date(txn.transactionTimestamp) <= toDate
      );
    }

    // Filter by category
    if (category) {
      transactions = transactions.filter(txn =>
        txn.category?.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Sort by date (newest first)
    transactions.sort((a, b) =>
      new Date(b.transactionTimestamp).getTime() - new Date(a.transactionTimestamp).getTime()
    );

    // Calculate totals
    const totalCredits = transactions
      .filter(txn => txn.type === 'CREDIT')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalDebits = transactions
      .filter(txn => txn.type === 'DEBIT')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const netFlow = totalCredits - totalDebits;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    transactions.forEach(txn => {
      if (txn.category) {
        categoryBreakdown[txn.category] = (categoryBreakdown[txn.category] || 0) + txn.amount;
      }
    });

    return {
      totalTransactions: transactions.length,
      totalCredits: parseFloat(totalCredits.toFixed(2)),
      totalDebits: parseFloat(totalDebits.toFixed(2)),
      netFlow: parseFloat(netFlow.toFixed(2)),
      transactions,
      categoryBreakdown
    };
  }

  static async getMonthlySpending(userId: string, months: number = 6): Promise<Record<string, any>> {
    const transactions = await db.getTransactionsByUserId(userId);
    const monthlyData: Record<string, { credits: number; debits: number; categories: Record<string, number> }> = {};

    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - months);

    transactions
      .filter(txn => new Date(txn.transactionTimestamp) >= startDate)
      .forEach(txn => {
        const date = new Date(txn.transactionTimestamp);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { credits: 0, debits: 0, categories: {} };
        }

        if (txn.type === 'CREDIT') {
          monthlyData[monthKey].credits += txn.amount;
        } else {
          monthlyData[monthKey].debits += txn.amount;
          if (txn.category) {
            monthlyData[monthKey].categories[txn.category] =
              (monthlyData[monthKey].categories[txn.category] || 0) + txn.amount;
          }
        }
      });

    return monthlyData;
  }

  static async getIncomeSources(userId: string): Promise<{ category: string; amount: number; percentage: number }[]> {
    const transactions = (await db.getTransactionsByUserId(userId))
      .filter(txn => txn.type === 'CREDIT');

    const categoryTotals: Record<string, number> = {};
    let totalIncome = 0;

    transactions.forEach(txn => {
      if (txn.category) {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
        totalIncome += txn.amount;
      }
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
        percentage: parseFloat(((amount / totalIncome) * 100).toFixed(2))
      }))
      .sort((a, b) => b.amount - a.amount);
  }
}
