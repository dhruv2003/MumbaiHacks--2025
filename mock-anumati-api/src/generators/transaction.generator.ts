import { Transaction, Account } from '../types';
import {
  MERCHANTS,
  UPI_HANDLES,
  COMPANY_NAMES,
  INDIAN_CITIES
} from '../config/constants';
import {
  generateUUID,
  randomElement,
  randomInt,
  randomFloat,
  generateUTR,
  generateATMId,
  generateCardTxnId,
  generateMobile,
  weightedRandom,
  addDays,
  formatDateISO
} from '../utils/helpers';

interface TransactionPattern {
  type: 'CREDIT' | 'DEBIT';
  mode: 'CASH' | 'ATM' | 'CARD' | 'UPI' | 'FT' | 'OTHERS';
  category: string;
  amountRange: [number, number];
  merchantCategory?: keyof typeof MERCHANTS;
}

const TRANSACTION_PATTERNS: { pattern: TransactionPattern; weight: number }[] = [
  // UPI transactions (most common - 50%)
  {
    pattern: {
      type: 'DEBIT',
      mode: 'UPI',
      category: 'Food & Dining',
      amountRange: [50, 2000],
      merchantCategory: 'food'
    },
    weight: 15
  },
  {
    pattern: {
      type: 'DEBIT',
      mode: 'UPI',
      category: 'Shopping',
      amountRange: [200, 10000],
      merchantCategory: 'ecommerce'
    },
    weight: 10
  },
  {
    pattern: {
      type: 'DEBIT',
      mode: 'UPI',
      category: 'Groceries',
      amountRange: [300, 3000],
      merchantCategory: 'grocery'
    },
    weight: 10
  },
  {
    pattern: {
      type: 'DEBIT',
      mode: 'UPI',
      category: 'Transport',
      amountRange: [50, 800],
      merchantCategory: 'transport'
    },
    weight: 8
  },
  {
    pattern: {
      type: 'DEBIT',
      mode: 'UPI',
      category: 'Utilities',
      amountRange: [200, 5000],
      merchantCategory: 'utilities'
    },
    weight: 5
  },
  {
    pattern: {
      type: 'DEBIT',
      mode: 'UPI',
      category: 'Entertainment',
      amountRange: [99, 1500],
      merchantCategory: 'entertainment'
    },
    weight: 4
  },

  // ATM withdrawals (10%)
  {
    pattern: {
      type: 'DEBIT',
      mode: 'ATM',
      category: 'ATM Withdrawal',
      amountRange: [2000, 10000]
    },
    weight: 10
  },

  // Card payments (15%)
  {
    pattern: {
      type: 'DEBIT',
      mode: 'CARD',
      category: 'Shopping',
      amountRange: [500, 20000],
      merchantCategory: 'shopping'
    },
    weight: 8
  },
  {
    pattern: {
      type: 'DEBIT',
      mode: 'CARD',
      category: 'Food & Dining',
      amountRange: [300, 3000],
      merchantCategory: 'food'
    },
    weight: 7
  },

  // Fund transfers (10%)
  {
    pattern: {
      type: 'DEBIT',
      mode: 'FT',
      category: 'Transfer',
      amountRange: [1000, 50000]
    },
    weight: 6
  },
  {
    pattern: {
      type: 'DEBIT',
      mode: 'FT',
      category: 'Rent',
      amountRange: [10000, 50000]
    },
    weight: 4
  },

  // Credits (15%)
  {
    pattern: {
      type: 'CREDIT',
      mode: 'FT',
      category: 'Salary',
      amountRange: [30000, 200000]
    },
    weight: 8
  },
  {
    pattern: {
      type: 'CREDIT',
      mode: 'UPI',
      category: 'Refund',
      amountRange: [100, 5000]
    },
    weight: 4
  },
  {
    pattern: {
      type: 'CREDIT',
      mode: 'FT',
      category: 'Transfer from Savings',
      amountRange: [5000, 100000]
    },
    weight: 3
  }
];

const generateUPINarration = (merchant: string, category: string): { narration: string; reference: string } => {
  const merchantMobile = generateMobile();
  const orderId = `ORD${randomInt(100000, 999999)}`;

  const narration = `UPI-${merchant}-${merchantMobile}-${category}`;
  const reference = orderId;

  return { narration, reference };
};

const generateNEFTNarration = (category: string): { narration: string; reference: string } => {
  if (category === 'Salary') {
    const company = randomElement(COMPANY_NAMES);
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
    return {
      narration: `NEFT-Salary Credit-${company}`,
      reference: `SAL/${month.substring(0, 3).toUpperCase()}/${new Date().getFullYear()}`
    };
  } else if (category === 'Rent') {
    return {
      narration: 'RTGS-Rent Payment-Monthly Rent',
      reference: `RENT/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
    };
  } else {
    return {
      narration: `NEFT Transfer-${category}`,
      reference: `TXN${randomInt(100000, 999999)}`
    };
  }
};

const generateATMNarration = (): { narration: string; reference: string } => {
  const atmId = generateATMId();
  const city = randomElement(INDIAN_CITIES).name;
  return {
    narration: `ATM WDL-${atmId}-${city}`,
    reference: atmId
  };
};

const generateCardNarration = (merchant?: string): { narration: string; reference: string } => {
  const txnId = randomInt(100000000, 999999999);
  const merchantName = merchant || randomElement(MERCHANTS.shopping);
  return {
    narration: `POS ${txnId}-${merchantName}`,
    reference: `POS/${txnId}`
  };
};

export const generateTransaction = (
  account: Account,
  date: Date,
  currentBalance: number,
  pattern?: TransactionPattern
): { transaction: Transaction; newBalance: number } => {
  // Select pattern
  const selectedPattern = pattern || weightedRandom(
    TRANSACTION_PATTERNS.map(p => p.pattern),
    TRANSACTION_PATTERNS.map(p => p.weight)
  );

  const amount = randomFloat(selectedPattern.amountRange[0], selectedPattern.amountRange[1], 2);
  const newBalance = selectedPattern.type === 'CREDIT' ? currentBalance + amount : currentBalance - amount;

  let narration: string;
  let reference: string;
  let merchantName: string | undefined;
  let merchantUPI: string | undefined;
  let txnId: string;

  // Generate narration based on mode
  switch (selectedPattern.mode) {
    case 'UPI': {
      const merchant = selectedPattern.merchantCategory
        ? randomElement(MERCHANTS[selectedPattern.merchantCategory])
        : 'Payment';
      const result = generateUPINarration(merchant, selectedPattern.category);
      narration = result.narration;
      reference = result.reference;
      merchantName = merchant;
      merchantUPI = `${merchant.toLowerCase().replace(/\s+/g, '')}@${randomElement(UPI_HANDLES)}`;
      txnId = generateUTR('UPI');
      break;
    }
    case 'FT': {
      const result = generateNEFTNarration(selectedPattern.category);
      narration = result.narration;
      reference = result.reference;
      txnId = selectedPattern.category === 'Rent' || selectedPattern.type === 'DEBIT'
        ? generateUTR('RTGS')
        : generateUTR('NEFT');
      break;
    }
    case 'ATM': {
      const result = generateATMNarration();
      narration = result.narration;
      reference = result.reference;
      txnId = generateATMId();
      break;
    }
    case 'CARD': {
      const merchant = selectedPattern.merchantCategory
        ? randomElement(MERCHANTS[selectedPattern.merchantCategory])
        : undefined;
      const result = generateCardNarration(merchant);
      narration = result.narration;
      reference = result.reference;
      merchantName = merchant;
      txnId = generateCardTxnId();
      break;
    }
    default: {
      narration = `${selectedPattern.type} - ${selectedPattern.category}`;
      reference = `TXN${randomInt(100000, 999999)}`;
      txnId = generateUTR('NEFT');
    }
  }

  const transaction: Transaction = {
    id: generateUUID(),
    accountId: account.id,
    type: selectedPattern.type,
    mode: selectedPattern.mode,
    amount,
    currentBalance: newBalance,
    txnId,
    narration,
    reference,
    transactionTimestamp: formatDateISO(date),
    valueDate: formatDateISO(date).split('T')[0],
    category: selectedPattern.category,
    merchantName,
    merchantUPI
  };

  return { transaction, newBalance };
};

export const generateMonthlyTransactions = (
  account: Account,
  startDate: Date,
  monthsOfHistory: number
): Transaction[] => {
  const transactions: Transaction[] = [];
  let currentBalance = account.summary.currentBalance;
  const today = new Date();

  // Generate transactions for each month
  for (let month = 0; month < monthsOfHistory; month++) {
    const monthDate = addDays(startDate, month * 30);
    if (monthDate > today) break;

    // Salary credit at start of month (for savings accounts)
    if (account.accountType === 'SAVINGS' && randomInt(1, 10) > 2) {
      const salaryDate = new Date(monthDate);
      salaryDate.setDate(randomInt(1, 5)); // 1st to 5th

      if (salaryDate <= today) {
        const salaryPattern: TransactionPattern = {
          type: 'CREDIT',
          mode: 'FT',
          category: 'Salary',
          amountRange: [30000, 200000]
        };
        const result = generateTransaction(account, salaryDate, currentBalance, salaryPattern);
        transactions.push(result.transaction);
        currentBalance = result.newBalance;
      }
    }

    // Rent payment (10% chance)
    if (randomInt(1, 10) === 1) {
      const rentDate = new Date(monthDate);
      rentDate.setDate(randomInt(1, 10));

      if (rentDate <= today) {
        const rentPattern: TransactionPattern = {
          type: 'DEBIT',
          mode: 'FT',
          category: 'Rent',
          amountRange: [10000, 50000]
        };
        const result = generateTransaction(account, rentDate, currentBalance, rentPattern);
        transactions.push(result.transaction);
        currentBalance = result.newBalance;
      }
    }

    // Daily transactions (15-30 per month)
    const dailyTxnCount = randomInt(15, 30);
    for (let i = 0; i < dailyTxnCount; i++) {
      const txnDate = new Date(monthDate);
      txnDate.setDate(randomInt(1, 28));
      txnDate.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));

      if (txnDate <= today) {
        const result = generateTransaction(account, txnDate, currentBalance);
        transactions.push(result.transaction);
        currentBalance = result.newBalance;
      }
    }
  }

  // Sort transactions by date (oldest first)
  transactions.sort((a, b) =>
    new Date(a.transactionTimestamp).getTime() - new Date(b.transactionTimestamp).getTime()
  );

  // Recalculate balances to ensure accuracy
  const startingBalance = account.summary.currentBalance;
  let balance = startingBalance;

  // Work backwards from current to calculate starting balance
  for (let i = transactions.length - 1; i >= 0; i--) {
    const txn = transactions[i];
    if (txn.type === 'CREDIT') {
      balance -= txn.amount;
    } else {
      balance += txn.amount;
    }
  }

  // Now go forward and set correct balances
  balance = Math.max(balance, 5000); // Minimum balance
  for (const txn of transactions) {
    if (txn.type === 'CREDIT') {
      balance += txn.amount;
    } else {
      balance -= txn.amount;
    }
    txn.currentBalance = parseFloat(balance.toFixed(2));
  }

  return transactions;
};
