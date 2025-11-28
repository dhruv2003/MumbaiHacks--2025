import { User, Account, Transaction, Investment, Liability } from '../types';
import { UserModel } from '../models/user.model';
import { AccountModel } from '../models/account.model';
import { InvestmentModel } from '../models/investment.model';
import { LiabilityModel } from '../models/liability.model';

class MongoDBService {
  // User operations
  async createUser(user: User): Promise<string> {
    const userData = { ...user };
    delete (userData as any).id;
    const createdUser = await UserModel.create(userData);
    return createdUser._id.toString();
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    if (!user) return undefined;
    return { ...user, id: user._id.toString(), createdAt: (user as any).createdAt || new Date() } as any as User;
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ mobile }).lean();
    if (!user) return undefined;
    return { ...user, id: user._id.toString(), createdAt: (user as any).createdAt || new Date() } as any as User;
  }

  async getUserByAAHandle(aaHandle: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ aaHandle }).lean();
    if (!user) return undefined;
    return { ...user, id: user._id.toString(), createdAt: (user as any).createdAt || new Date() } as any as User;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().lean();
    return users.map(u => ({ ...u, id: u._id.toString(), createdAt: (u as any).createdAt || new Date() } as any as User));
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await UserModel.findByIdAndUpdate(id, updates);
  }

  // Account operations
  async createAccount(account: Account): Promise<void> {
    const accountData = { ...account };
    delete (accountData as any).id;

    const createdAccount = await AccountModel.create(accountData);

    // Update user's linked accounts
    await UserModel.findByIdAndUpdate(account.userId, {
      $push: { linkedAccounts: createdAccount._id.toString() }
    });
  }

  async getAccountById(id: string): Promise<Account | undefined> {
    const account = await AccountModel.findById(id).lean();
    if (!account) return undefined;
    return { ...account, id: account._id.toString() } as Account;
  }

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    const accounts = await AccountModel.find({ userId }).lean();
    return accounts.map(a => ({ ...a, id: a._id.toString() } as Account));
  }

  async getAllAccounts(): Promise<Account[]> {
    const accounts = await AccountModel.find().lean();
    return accounts.map(a => ({ ...a, id: a._id.toString() } as Account));
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<void> {
    await AccountModel.findByIdAndUpdate(id, updates);
  }

  // Transaction operations
  async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    const account = await AccountModel.findById(accountId).lean();
    return account?.transactions || [];
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const accounts = await AccountModel.find({ userId }).lean();
    return accounts.flatMap(acc => acc.transactions || []);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const accounts = await AccountModel.find().lean();
    return accounts.flatMap(acc => acc.transactions || []);
  }

  // Investment operations
  async createInvestment(investment: Investment): Promise<void> {
    const investmentData = { ...investment };
    delete (investmentData as any).id;
    await InvestmentModel.create(investmentData);
  }

  async getInvestmentById(id: string): Promise<Investment | undefined> {
    const investment = await InvestmentModel.findById(id).lean();
    if (!investment) return undefined;
    return { ...investment, id: investment._id.toString() } as Investment;
  }

  async getInvestmentsByUserId(userId: string): Promise<Investment[]> {
    const investments = await InvestmentModel.find({ userId }).lean();
    return investments.map(i => ({ ...i, id: i._id.toString() } as Investment));
  }

  async getAllInvestments(): Promise<Investment[]> {
    const investments = await InvestmentModel.find().lean();
    return investments.map(i => ({ ...i, id: i._id.toString() } as Investment));
  }

  // Liability operations
  async createLiability(liability: Liability): Promise<void> {
    const liabilityData = { ...liability };
    delete (liabilityData as any).id;
    await LiabilityModel.create(liabilityData);
  }

  async getLiabilityById(id: string): Promise<Liability | undefined> {
    const liability = await LiabilityModel.findById(id).lean();
    if (!liability) return undefined;
    return { ...liability, id: liability._id.toString() } as Liability;
  }

  async getLiabilitiesByUserId(userId: string): Promise<Liability[]> {
    const liabilities = await LiabilityModel.find({ userId }).lean();
    return liabilities.map(l => ({ ...l, id: l._id.toString() } as Liability));
  }

  async getAllLiabilities(): Promise<Liability[]> {
    const liabilities = await LiabilityModel.find().lean();
    return liabilities.map(l => ({ ...l, id: l._id.toString() } as Liability));
  }

  // Utility methods
  async clear(): Promise<void> {
    await UserModel.deleteMany({});
    await AccountModel.deleteMany({});
    await InvestmentModel.deleteMany({});
    await LiabilityModel.deleteMany({});
  }

  async getStats() {
    const [users, accounts, investments, liabilities] = await Promise.all([
      UserModel.countDocuments(),
      AccountModel.countDocuments(),
      InvestmentModel.countDocuments(),
      LiabilityModel.countDocuments()
    ]);

    const transactionsCount = await AccountModel.aggregate([
      { $project: { transactionCount: { $size: '$transactions' } } },
      { $group: { _id: null, total: { $sum: '$transactionCount' } } }
    ]);

    return {
      users,
      accounts,
      transactions: transactionsCount[0]?.total || 0,
      investments,
      liabilities,
      consents: 0,
      fiRequests: 0
    };
  }
}

export const db = new MongoDBService();
