import { Liability, User } from '../types';
import { BANKS } from '../config/constants';
import {
  generateUUID,
  randomElement,
  randomInt,
  randomFloat,
  generateAccountNumber,
  calculateEMI,
  formatDateISO
} from '../utils/helpers';

export const generateCreditCard = (user: User): Liability => {
  const bank = randomElement(BANKS.filter(b => !['PYTM', 'AIRP'].includes(b.code)));

  const totalLimit = randomFloat(50000, 500000, 2);
  const utilizationPercent = randomFloat(10, 80, 2);
  const outstandingAmount = (totalLimit * utilizationPercent) / 100;

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - randomInt(6, 60));

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'CREDIT_CARD',
    provider: bank.name,
    accountNumber: `XXXX XXXX XXXX ${randomInt(1000, 9999)}`,
    outstandingAmount: parseFloat(outstandingAmount.toFixed(2)),
    totalLimit: parseFloat(totalLimit.toFixed(2)),
    interestRate: randomFloat(36, 48, 2), // Annual interest rate
    startDate: formatDateISO(startDate),
    status: 'ACTIVE'
  };
};

export const generatePersonalLoan = (user: User): Liability => {
  const banks = BANKS.filter(b => !['PYTM', 'AIRP'].includes(b.code));
  const nbfcs = ['Bajaj Finance', 'Mahindra Finance', 'Tata Capital', 'Fullerton India'];
  const provider = randomElement([...banks.map(b => b.name), ...nbfcs]);

  const principal = randomFloat(100000, 1000000, 2);
  const annualRate = randomFloat(10, 18, 2);
  const tenureMonths = randomElement([12, 24, 36, 48, 60]);

  const emiAmount = calculateEMI(principal, annualRate, tenureMonths);
  const monthsElapsed = randomInt(1, tenureMonths - 1);

  // Calculate outstanding using reducing balance method
  const monthlyRate = annualRate / 12 / 100;
  const outstandingAmount = principal * Math.pow(1 + monthlyRate, monthsElapsed) -
    emiAmount * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsElapsed);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + tenureMonths);

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'PERSONAL_LOAN',
    provider,
    accountNumber: generateAccountNumber(12),
    outstandingAmount: Math.max(0, parseFloat(outstandingAmount.toFixed(2))),
    emiAmount: parseFloat(emiAmount.toFixed(2)),
    tenure: tenureMonths,
    interestRate: parseFloat(annualRate.toFixed(2)),
    startDate: formatDateISO(startDate),
    endDate: formatDateISO(endDate),
    status: monthsElapsed >= tenureMonths ? 'CLOSED' : 'ACTIVE'
  };
};

export const generateHomeLoan = (user: User): Liability => {
  const banks = BANKS.filter(b => !['PYTM', 'AIRP'].includes(b.code));
  const hfcs = ['HDFC Ltd', 'LIC Housing Finance', 'Bajaj Housing Finance', 'PNB Housing Finance'];
  const provider = randomElement([...banks.map(b => b.name), ...hfcs]);

  const principal = randomFloat(1000000, 10000000, 2);
  const annualRate = randomFloat(7.5, 9.5, 2);
  const tenureYears = randomElement([10, 15, 20, 25, 30]);
  const tenureMonths = tenureYears * 12;

  const emiAmount = calculateEMI(principal, annualRate, tenureMonths);
  const yearsElapsed = randomInt(1, Math.min(5, tenureYears - 1));
  const monthsElapsed = yearsElapsed * 12;

  // Calculate outstanding
  const monthlyRate = annualRate / 12 / 100;
  const outstandingAmount = principal * Math.pow(1 + monthlyRate, monthsElapsed) -
    emiAmount * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - yearsElapsed);

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + tenureYears);

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'HOME_LOAN',
    provider,
    accountNumber: generateAccountNumber(14),
    outstandingAmount: Math.max(0, parseFloat(outstandingAmount.toFixed(2))),
    emiAmount: parseFloat(emiAmount.toFixed(2)),
    tenure: tenureMonths,
    interestRate: parseFloat(annualRate.toFixed(2)),
    startDate: formatDateISO(startDate),
    endDate: formatDateISO(endDate),
    status: monthsElapsed >= tenureMonths ? 'CLOSED' : 'ACTIVE'
  };
};

export const generateCarLoan = (user: User): Liability => {
  const banks = BANKS.filter(b => !['PYTM', 'AIRP'].includes(b.code));
  const nbfcs = ['Bajaj Auto Finance', 'Mahindra Finance', 'Cholamandalam Finance', 'Tata Motors Finance'];
  const provider = randomElement([...banks.map(b => b.name), ...nbfcs]);

  const principal = randomFloat(300000, 2000000, 2);
  const annualRate = randomFloat(8, 12, 2);
  const tenureYears = randomElement([3, 5, 7]);
  const tenureMonths = tenureYears * 12;

  const emiAmount = calculateEMI(principal, annualRate, tenureMonths);
  const monthsElapsed = randomInt(1, tenureMonths - 1);

  // Calculate outstanding
  const monthlyRate = annualRate / 12 / 100;
  const outstandingAmount = principal * Math.pow(1 + monthlyRate, monthsElapsed) -
    emiAmount * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsElapsed);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + tenureMonths);

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'CAR_LOAN',
    provider,
    accountNumber: generateAccountNumber(13),
    outstandingAmount: Math.max(0, parseFloat(outstandingAmount.toFixed(2))),
    emiAmount: parseFloat(emiAmount.toFixed(2)),
    tenure: tenureMonths,
    interestRate: parseFloat(annualRate.toFixed(2)),
    startDate: formatDateISO(startDate),
    endDate: formatDateISO(endDate),
    status: monthsElapsed >= tenureMonths ? 'CLOSED' : 'ACTIVE'
  };
};

export const generateEducationLoan = (user: User): Liability => {
  const banks = BANKS.filter(b => ['SBIN', 'HDFC', 'ICIC', 'UTIB', 'CNRB'].includes(b.code));
  const provider = randomElement(banks).name;

  const principal = randomFloat(200000, 2000000, 2);
  const annualRate = randomFloat(9, 13, 2);
  const tenureYears = randomElement([5, 7, 10, 15]);
  const tenureMonths = tenureYears * 12;

  const emiAmount = calculateEMI(principal, annualRate, tenureMonths);
  const yearsElapsed = randomInt(1, Math.min(3, tenureYears - 1));
  const monthsElapsed = yearsElapsed * 12;

  // Calculate outstanding
  const monthlyRate = annualRate / 12 / 100;
  const outstandingAmount = principal * Math.pow(1 + monthlyRate, monthsElapsed) -
    emiAmount * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - yearsElapsed);

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + tenureYears);

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'EDUCATION_LOAN',
    provider,
    accountNumber: generateAccountNumber(12),
    outstandingAmount: Math.max(0, parseFloat(outstandingAmount.toFixed(2))),
    emiAmount: parseFloat(emiAmount.toFixed(2)),
    tenure: tenureMonths,
    interestRate: parseFloat(annualRate.toFixed(2)),
    startDate: formatDateISO(startDate),
    endDate: formatDateISO(endDate),
    status: monthsElapsed >= tenureMonths ? 'CLOSED' : 'ACTIVE'
  };
};

export const generateLiabilities = (user: User, count: number): Liability[] => {
  const liabilities: Liability[] = [];

  // Always include at least one credit card if count > 0
  if (count > 0) {
    liabilities.push(generateCreditCard(user));
  }

  // Generate other liabilities
  const types = ['CREDIT_CARD', 'PERSONAL', 'HOME', 'CAR', 'EDUCATION'];

  for (let i = 1; i < count; i++) {
    const type = randomElement(types);

    switch (type) {
      case 'CREDIT_CARD':
        liabilities.push(generateCreditCard(user));
        break;
      case 'PERSONAL':
        liabilities.push(generatePersonalLoan(user));
        break;
      case 'HOME':
        liabilities.push(generateHomeLoan(user));
        break;
      case 'CAR':
        liabilities.push(generateCarLoan(user));
        break;
      case 'EDUCATION':
        liabilities.push(generateEducationLoan(user));
        break;
    }
  }

  return liabilities;
};
