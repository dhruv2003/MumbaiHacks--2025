import { v4 as uuidv4 } from 'uuid';

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
};

export const randomElement = <T>(array: readonly T[]): T => {
  return array[randomInt(0, array.length - 1)];
};

export const randomElements = <T>(array: readonly T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateUUID = (): string => {
  return uuidv4();
};

export const generatePAN = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  let pan = '';
  for (let i = 0; i < 5; i++) {
    pan += letters.charAt(randomInt(0, letters.length - 1));
  }
  for (let i = 0; i < 4; i++) {
    pan += digits.charAt(randomInt(0, digits.length - 1));
  }
  pan += letters.charAt(randomInt(0, letters.length - 1));

  return pan;
};

export const generateAadhaar = (): string => {
  let aadhaar = '';
  for (let i = 0; i < 12; i++) {
    aadhaar += randomInt(0, 9).toString();
  }
  return aadhaar;
};

export const generateMobile = (): string => {
  const firstDigit = randomElement(['6', '7', '8', '9']);
  let mobile = firstDigit;
  for (let i = 0; i < 9; i++) {
    mobile += randomInt(0, 9).toString();
  }
  return mobile;
};

export const generateIFSC = (prefix: string): string => {
  const branch = randomInt(100000, 999999);
  return `${prefix}${branch}`;
};

export const generateAccountNumber = (length: number = 11): string => {
  let accountNumber = '';
  for (let i = 0; i < length; i++) {
    accountNumber += randomInt(0, 9).toString();
  }
  return accountNumber;
};

export const maskAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length <= 4) return accountNumber;
  const lastFour = accountNumber.slice(-4);
  const masked = 'X'.repeat(accountNumber.length - 4);
  return masked + lastFour;
};

export const generateLinkRefNumber = (): string => {
  const part1 = randomInt(1000, 9999);
  const part2 = randomInt(1000, 9999);
  const part3 = randomInt(1000, 9999);
  return `${part1}-${part2}-${part3}`;
};

export const generateUTR = (type: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI'): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  switch (type) {
    case 'NEFT':
      return `NEFT${randomInt(100000000000000, 999999999999999)}`;
    case 'RTGS':
      return `RTGS${year}${month}${day}${randomInt(100000000000, 999999999999)}`;
    case 'IMPS':
      return `IMP${randomInt(100000000000, 999999999999)}`;
    case 'UPI':
      return randomInt(100000000000, 999999999999).toString();
    default:
      return randomInt(100000000000, 999999999999).toString();
  }
};

export const generateATMId = (): string => {
  return `ATM${randomInt(100000, 999999)}`;
};

export const generateCardTxnId = (): string => {
  return `CARD${new Date().getFullYear()}${randomInt(100000000000, 999999999999)}`;
};

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const formatDateISO = (date: Date): string => {
  return date.toISOString();
};

export const formatDateIndian = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const generateEmail = (name: string): string => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'];
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  return `${cleanName}@${randomElement(domains)}`;
};

export const generateDOB = (minAge: number = 21, maxAge: number = 60): string => {
  const today = new Date();
  const birthYear = today.getFullYear() - randomInt(minAge, maxAge);
  const birthMonth = randomInt(1, 12);
  const birthDay = randomInt(1, 28);

  const month = birthMonth.toString().padStart(2, '0');
  const day = birthDay.toString().padStart(2, '0');

  return `${birthYear}-${month}-${day}`;
};

export const weightedRandom = <T>(items: T[], weights: number[]): T => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
};

export const generateMICR = (): string => {
  let micr = '';
  for (let i = 0; i < 9; i++) {
    micr += randomInt(0, 9).toString();
  }
  return micr;
};

export const generateFolioNumber = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let folio = '';

  for (let i = 0; i < 3; i++) {
    folio += letters.charAt(randomInt(0, letters.length - 1));
  }
  folio += '/';
  for (let i = 0; i < 6; i++) {
    folio += randomInt(0, 9).toString();
  }
  folio += '/';
  for (let i = 0; i < 4; i++) {
    folio += randomInt(0, 9).toString();
  }

  return folio;
};

export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return parseFloat(emi.toFixed(2));
};

export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
