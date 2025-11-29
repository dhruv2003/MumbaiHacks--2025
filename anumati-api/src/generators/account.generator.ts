import { Account, AccountProfile, AccountSummary, User } from '../types';
import { BANKS, INDIAN_CITIES } from '../config/constants';
import {
  generateUUID,
  randomElement,
  randomInt,
  randomFloat,
  generateIFSC,
  generateAccountNumber,
  maskAccountNumber,
  generateLinkRefNumber,
  formatDateISO,
  generateMICR
} from '../utils/helpers';

const generateAccountProfile = (user: User): AccountProfile => {
  return {
    holders: {
      type: 'SINGLE',
      holder: [
        {
          name: user.name,
          dob: user.dob,
          mobile: user.mobile,
          email: user.email,
          pan: user.pan,
          nominee: randomElement(['REGISTERED', 'NOT-REGISTERED'] as const),
          ckycCompliance: true,
          address: `${randomInt(1, 999)}, ${randomElement(INDIAN_CITIES).name}`
        }
      ]
    }
  };
};

const generateAccountSummary = (
  accountType: 'SAVINGS' | 'CURRENT' | 'CREDIT' | 'FD' | 'RD',
  ifscCode: string,
  branch: string,
  openingDate: string
): AccountSummary => {
  let currentBalance: number;
  let drawingLimit: number | undefined;

  switch (accountType) {
    case 'SAVINGS':
      currentBalance = randomFloat(5000, 500000, 2);
      drawingLimit = randomFloat(50000, 200000, 2);
      break;
    case 'CURRENT':
      currentBalance = randomFloat(50000, 2000000, 2);
      drawingLimit = randomFloat(500000, 5000000, 2);
      break;
    case 'FD':
      currentBalance = randomFloat(100000, 1000000, 2);
      break;
    case 'RD':
      currentBalance = randomFloat(50000, 300000, 2);
      break;
    case 'CREDIT':
      currentBalance = randomFloat(0, 100000, 2); // Outstanding amount
      drawingLimit = randomFloat(100000, 500000, 2); // Credit limit
      break;
    default:
      currentBalance = randomFloat(10000, 100000, 2);
  }

  return {
    currentBalance,
    currency: 'INR',
    balanceDateTime: formatDateISO(new Date()),
    type: accountType,
    status: 'ACTIVE',
    branch,
    ifscCode,
    micrCode: generateMICR(),
    openingDate,
    drawingLimit,
    currentODLimit: accountType === 'CURRENT' ? randomFloat(100000, 1000000, 2) : undefined,
    facility: accountType === 'CURRENT' ? randomElement(['OD', 'CC'] as const) : undefined
  };
};

export const generateAccount = (user: User, type?: 'DEPOSIT' | 'CREDIT_CARD' | 'TERM_DEPOSIT' | 'RECURRING_DEPOSIT'): Account => {
  const bank = randomElement(BANKS);
  const city = randomElement(INDIAN_CITIES);

  const accountTypes = type ? [type] : ['DEPOSIT', 'DEPOSIT', 'DEPOSIT', 'CREDIT_CARD'] as const; // More savings accounts
  const selectedType = randomElement(accountTypes) as 'DEPOSIT' | 'CREDIT_CARD' | 'TERM_DEPOSIT' | 'RECURRING_DEPOSIT';

  let accountType: 'SAVINGS' | 'CURRENT' | 'CREDIT' | 'FD' | 'RD';

  switch (selectedType) {
    case 'DEPOSIT':
      accountType = randomElement(['SAVINGS', 'SAVINGS', 'SAVINGS', 'CURRENT'] as const); // More savings
      break;
    case 'CREDIT_CARD':
      accountType = 'CREDIT';
      break;
    case 'TERM_DEPOSIT':
      accountType = 'FD';
      break;
    case 'RECURRING_DEPOSIT':
      accountType = 'RD';
      break;
    default:
      accountType = 'SAVINGS';
  }

  const actualAccNumber = generateAccountNumber(randomInt(11, 16));
  const ifscCode = generateIFSC(bank.ifscPrefix);
  const branch = `${city.name} Branch, ${city.state}`;

  const yearsAgo = randomInt(1, 10);
  const openingDate = new Date();
  openingDate.setFullYear(openingDate.getFullYear() - yearsAgo);

  const account: Account = {
    id: generateUUID(),
    userId: user.id,
    type: selectedType,
    fipId: bank.code,
    fipName: bank.name,
    maskedAccNumber: maskAccountNumber(actualAccNumber),
    actualAccNumber,
    ifscCode,
    branch,
    accountType,
    currentBalance: 0, // Will be set by summary
    currency: 'INR',
    status: 'ACTIVE',
    openingDate: formatDateISO(openingDate),
    linkRefNumber: generateLinkRefNumber(),
    profile: generateAccountProfile(user),
    summary: {} as AccountSummary,
    transactions: []
  };

  account.summary = generateAccountSummary(accountType, ifscCode, branch, account.openingDate);
  account.currentBalance = account.summary.currentBalance;

  return account;
};

export const generateAccounts = (user: User, count: number): Account[] => {
  const accounts: Account[] = [];

  // At least one savings account
  accounts.push(generateAccount(user, 'DEPOSIT'));

  // Generate remaining accounts
  for (let i = 1; i < count; i++) {
    accounts.push(generateAccount(user));
  }

  return accounts;
};
