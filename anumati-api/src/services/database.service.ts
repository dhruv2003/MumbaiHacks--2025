import { User, Account, Transaction, Investment, Liability, Consent, FIRequest } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-memory database (simulating a real database) with file persistence
class Database {
  private users: Map<string, User> = new Map();
  private accounts: Map<string, Account> = new Map();
  private investments: Map<string, Investment> = new Map();
  private liabilities: Map<string, Liability> = new Map();
  private consents: Map<string, Consent> = new Map();
  private fiRequests: Map<string, FIRequest> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  private saveToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const data = {
        users: Array.from(this.users.entries()),
        accounts: Array.from(this.accounts.entries()),
        investments: Array.from(this.investments.entries()),
        liabilities: Array.from(this.liabilities.entries()),
        consents: Array.from(this.consents.entries()),
        fiRequests: Array.from(this.fiRequests.entries())
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving database to disk:', error);
    }
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        
        this.users = new Map(data.users);
        this.accounts = new Map(data.accounts);
        this.investments = new Map(data.investments);
        this.liabilities = new Map(data.liabilities);
        this.consents = new Map(data.consents);
        this.fiRequests = new Map(data.fiRequests);
        
        console.log('Database loaded from disk');
      }
    } catch (error) {
      console.error('Error loading database from disk:', error);
    }
  }

  // User operations
  createUser(user: User): void {
    this.users.set(user.id, user);
    this.saveToDisk();
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByMobile(mobile: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.mobile === mobile);
  }

  getUserByAAHandle(aaHandle: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.aaHandle === aaHandle);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<User>): void {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, ...updates });
      this.saveToDisk();
    }
  }

  // Account operations
  createAccount(account: Account): void {
    this.accounts.set(account.id, account);

    // Update user's linked accounts
    const user = this.users.get(account.userId);
    if (user) {
      user.linkedAccounts.push(account.id);
      this.users.set(user.id, user);
    }
    this.saveToDisk();
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  getAccountsByUserId(userId: string): Account[] {
    return Array.from(this.accounts.values()).filter(a => a.userId === userId);
  }

  getAllAccounts(): Account[] {
    return Array.from(this.accounts.values());
  }

  updateAccount(id: string, updates: Partial<Account>): void {
    const account = this.accounts.get(id);
    if (account) {
      this.accounts.set(id, { ...account, ...updates });
      this.saveToDisk();
    }
  }

  // Transaction operations
  getTransactionsByAccountId(accountId: string): Transaction[] {
    const account = this.accounts.get(accountId);
    return account?.transactions || [];
  }

  getTransactionsByUserId(userId: string): Transaction[] {
    const userAccounts = this.getAccountsByUserId(userId);
    return userAccounts.flatMap(acc => acc.transactions);
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.accounts.values()).flatMap(acc => acc.transactions);
  }

  // Investment operations
  createInvestment(investment: Investment): void {
    this.investments.set(investment.id, investment);
    this.saveToDisk();
  }

  getInvestmentById(id: string): Investment | undefined {
    return this.investments.get(id);
  }

  getInvestmentsByUserId(userId: string): Investment[] {
    return Array.from(this.investments.values()).filter(i => i.userId === userId);
  }

  getAllInvestments(): Investment[] {
    return Array.from(this.investments.values());
  }

  // Liability operations
  createLiability(liability: Liability): void {
    this.liabilities.set(liability.id, liability);
    this.saveToDisk();
  }

  getLiabilityById(id: string): Liability | undefined {
    return this.liabilities.get(id);
  }

  getLiabilitiesByUserId(userId: string): Liability[] {
    return Array.from(this.liabilities.values()).filter(l => l.userId === userId);
  }

  getAllLiabilities(): Liability[] {
    return Array.from(this.liabilities.values());
  }

  // Consent operations
  createConsent(consent: Consent): void {
    this.consents.set(consent.id, consent);
    this.saveToDisk();
  }

  getConsentById(id: string): Consent | undefined {
    return this.consents.get(id);
  }

  getConsentsByUserId(userId: string): Consent[] {
    return Array.from(this.consents.values()).filter(c => c.userId === userId);
  }

  updateConsent(id: string, updates: Partial<Consent>): void {
    const consent = this.consents.get(id);
    if (consent) {
      this.consents.set(id, { ...consent, ...updates });
      this.saveToDisk();
    }
  }

  // FI Request operations
  createFIRequest(request: FIRequest): void {
    this.fiRequests.set(request.sessionId, request);
    this.saveToDisk();
  }

  getFIRequestById(sessionId: string): FIRequest | undefined {
    return this.fiRequests.get(sessionId);
  }

  updateFIRequest(sessionId: string, updates: Partial<FIRequest>): void {
    const request = this.fiRequests.get(sessionId);
    if (request) {
      this.fiRequests.set(sessionId, { ...request, ...updates });
      this.saveToDisk();
    }
  }

  // Utility methods
  clear(): void {
    this.users.clear();
    this.accounts.clear();
    this.investments.clear();
    this.liabilities.clear();
    this.consents.clear();
    this.fiRequests.clear();
    this.saveToDisk();
  }

  getStats() {
    return {
      users: this.users.size,
      accounts: this.accounts.size,
      transactions: this.getAllTransactions().length,
      investments: this.investments.size,
      liabilities: this.liabilities.size,
      consents: this.consents.size,
      fiRequests: this.fiRequests.size
    };
  }
}

export const db = new Database();
