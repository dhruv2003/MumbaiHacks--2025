export interface Dependent {
  name: string;
  age: number;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  relationship?: string;
}

export interface CreditCard {
  bankName: string;
  cardType: 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX';
  cardVariant?: string;
}

export interface PreciousMetals {
  gold: number;
  silver: number;
}

export interface User {
  id: string;
  aaHandle: string;
  mobile: string;
  pin: string;
  name: string;
  email: string;
  pan: string;
  dob: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dependents: Dependent[];
  creditCards: CreditCard[];
  preciousMetals: PreciousMetals;
  financialPersona?: string;
  userPersona?: string;
  createdAt: Date;
  linkedAccounts: string[];
}

export interface AccountProfile {
  holders: {
    type: 'SINGLE' | 'JOINT';
    holder: Holder[];
  };
}

export interface Holder {
  name: string;
  dob: string;
  mobile: string;
  email: string;
  pan: string;
  nominee: 'REGISTERED' | 'NOT-REGISTERED';
  ckycCompliance: boolean;
  address?: string;
}

export interface AccountSummary {
  currentBalance: number;
  currency: 'INR';
  balanceDateTime: string;
  type: 'SAVINGS' | 'CURRENT' | 'CREDIT' | 'FD' | 'RD';
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  branch: string;
  ifscCode: string;
  micrCode?: string;
  openingDate: string;
  closingDate?: string;
  currentODLimit?: number;
  drawingLimit?: number;
  facility?: 'OD' | 'CC';
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'CREDIT' | 'DEBIT';
  mode: 'CASH' | 'ATM' | 'CARD' | 'UPI' | 'FT' | 'OTHERS';
  amount: number;
  currentBalance: number;
  txnId: string;
  narration: string;
  reference: string;
  transactionTimestamp: string;
  valueDate: string;
  category?: string;
  merchantName?: string;
  merchantUPI?: string;
  embedding?: number[];
}

export interface Account {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'CREDIT_CARD' | 'TERM_DEPOSIT' | 'RECURRING_DEPOSIT';
  fipId: string;
  fipName: string;
  maskedAccNumber: string;
  actualAccNumber: string;
  ifscCode: string;
  branch: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'CREDIT' | 'FD' | 'RD';
  currentBalance: number;
  currency: 'INR';
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  openingDate: string;
  closingDate?: string;
  linkRefNumber: string;
  profile: AccountProfile;
  summary: AccountSummary;
  transactions: Transaction[];
}

export interface Investment {
  id: string;
  userId: string;
  type: 'MUTUAL_FUNDS' | 'EQUITIES' | 'BONDS' | 'NPS' | 'PPF' | 'EPF' | 'TERM_DEPOSIT';
  provider: string;
  schemeName?: string;
  folioNumber?: string;
  units?: number;
  nav?: number;
  currentValue: number;
  investedAmount: number;
  returns: number;
  returnsPercentage: number;
  maturityDate?: string;
  startDate: string;
  status: 'ACTIVE' | 'MATURED' | 'CLOSED';
}

export interface Liability {
  id: string;
  userId: string;
  type: 'CREDIT_CARD' | 'PERSONAL_LOAN' | 'HOME_LOAN' | 'CAR_LOAN' | 'EDUCATION_LOAN';
  provider: string;
  accountNumber: string;
  outstandingAmount: number;
  totalLimit?: number;
  emiAmount?: number;
  tenure?: number;
  interestRate: number;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'CLOSED' | 'OVERDUE';
}

export interface Consent {
  id: string;
  userId: string;
  consentStart: string;
  consentExpiry: string;
  consentMode: 'STORE' | 'VIEW' | 'QUERY' | 'STREAM';
  fetchType: 'ONETIME' | 'PERIODIC';
  consentTypes: ('PROFILE' | 'SUMMARY' | 'TRANSACTIONS')[];
  dataConsumer: {
    id: string;
    type: 'FIU';
  };
  dataProvider: {
    id: string;
    type: 'FIP';
  };
  purpose: {
    code: string;
    text: string;
  };
  fiDataRange: {
    from: string;
    to: string;
  };
  dataLife: {
    unit: 'DAY' | 'MONTH' | 'YEAR';
    value: number;
  };
  frequency: {
    unit: 'DAY' | 'MONTH' | 'YEAR';
    value: number;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdAt: Date;
}

export interface FIRequest {
  sessionId: string;
  userId: string;
  consentId: string;
  dataRange: {
    from: string;
    to: string;
  };
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
}

export interface NetWorth {
  userId: string;
  aaHandle: string;
  netWorth: number;
  asOfDate: string;
  breakdown: {
    assets: {
      bankAccounts: number;
      investments: number;
      fixedDeposits: number;
      total: number;
    };
    liabilities: {
      creditCards: number;
      loans: number;
      total: number;
    };
    netAssets: number;
  };
  accounts: {
    savings: number;
    current: number;
    creditCards: number;
    investments: number;
    loans: number;
  };
}

export interface BankData {
  code: string;
  name: string;
  ifscPrefix: string;
}

export interface MerchantCategory {
  food: string[];
  ecommerce: string[];
  grocery: string[];
  transport: string[];
  utilities: string[];
  entertainment: string[];
  education: string[];
  healthcare: string[];
  shopping: string[];
  others: string[];
}

export interface JWTPayload {
  userId: string;
  aaHandle: string;
  mobile: string;
}
