import { Investment, User } from '../types';
import { MUTUAL_FUND_HOUSES, MUTUAL_FUND_SCHEMES, BANKS } from '../config/constants';
import {
  generateUUID,
  randomElement,
  randomInt,
  randomFloat,
  generateFolioNumber,
  formatDateISO
} from '../utils/helpers';

export const generateMutualFund = (user: User): Investment => {
  const fundHouse = randomElement(MUTUAL_FUND_HOUSES);
  const scheme = randomElement(MUTUAL_FUND_SCHEMES);
  const schemeName = `${fundHouse.split(' ')[0]} ${scheme}`;

  const investedAmount = randomFloat(10000, 500000, 2);
  const returnsPercentage = randomFloat(-5, 25, 2);
  const currentValue = investedAmount * (1 + returnsPercentage / 100);
  const returns = currentValue - investedAmount;

  const units = randomFloat(100, 10000, 3);
  const nav = currentValue / units;

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - randomInt(6, 60));

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'MUTUAL_FUNDS',
    provider: fundHouse,
    schemeName,
    folioNumber: generateFolioNumber(),
    units: parseFloat(units.toFixed(3)),
    nav: parseFloat(nav.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    investedAmount: parseFloat(investedAmount.toFixed(2)),
    returns: parseFloat(returns.toFixed(2)),
    returnsPercentage: parseFloat(returnsPercentage.toFixed(2)),
    startDate: formatDateISO(startDate),
    status: 'ACTIVE'
  };
};

export const generateEquity = (user: User): Investment => {
  const companies = [
    'Reliance Industries', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank',
    'Hindustan Unilever', 'ITC', 'Bharti Airtel', 'State Bank of India', 'Kotak Mahindra Bank'
  ];

  const company = randomElement(companies);
  const units = randomFloat(10, 500, 0);
  const avgPrice = randomFloat(100, 3000, 2);
  const investedAmount = units * avgPrice;

  const returnsPercentage = randomFloat(-10, 40, 2);
  const currentValue = investedAmount * (1 + returnsPercentage / 100);
  const returns = currentValue - investedAmount;

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - randomInt(3, 48));

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'EQUITIES',
    provider: 'Zerodha',
    schemeName: company,
    units: parseFloat(units.toFixed(0)),
    nav: parseFloat((currentValue / units).toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    investedAmount: parseFloat(investedAmount.toFixed(2)),
    returns: parseFloat(returns.toFixed(2)),
    returnsPercentage: parseFloat(returnsPercentage.toFixed(2)),
    startDate: formatDateISO(startDate),
    status: 'ACTIVE'
  };
};

export const generatePPF = (user: User): Investment => {
  const bank = randomElement(BANKS.filter(b => ['SBIN', 'HDFC', 'ICIC', 'UTIB'].includes(b.code)));

  const yearsActive = randomInt(1, 10);
  const annualInvestment = randomFloat(10000, 150000, 2);
  const investedAmount = annualInvestment * yearsActive;

  // PPF interest is around 7-8%
  const annualRate = 7.1;
  const futureValue = annualInvestment * (((Math.pow(1 + annualRate / 100, yearsActive) - 1) / (annualRate / 100)) * (1 + annualRate / 100));
  const currentValue = futureValue;
  const returns = currentValue - investedAmount;
  const returnsPercentage = (returns / investedAmount) * 100;

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - yearsActive);

  const maturityDate = new Date(startDate);
  maturityDate.setFullYear(maturityDate.getFullYear() + 15); // PPF is 15 years

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'PPF',
    provider: bank.name,
    schemeName: 'Public Provident Fund',
    folioNumber: generateFolioNumber(),
    currentValue: parseFloat(currentValue.toFixed(2)),
    investedAmount: parseFloat(investedAmount.toFixed(2)),
    returns: parseFloat(returns.toFixed(2)),
    returnsPercentage: parseFloat(returnsPercentage.toFixed(2)),
    startDate: formatDateISO(startDate),
    maturityDate: formatDateISO(maturityDate),
    status: new Date() < maturityDate ? 'ACTIVE' : 'MATURED'
  };
};

export const generateFixedDeposit = (user: User): Investment => {
  const bank = randomElement(BANKS.filter(b => !['PYTM', 'AIRP'].includes(b.code)));

  const principal = randomFloat(50000, 1000000, 2);
  const tenureMonths = randomElement([6, 12, 24, 36, 60]);
  const annualRate = randomFloat(5.5, 7.5, 2);

  const maturityAmount = principal * Math.pow(1 + annualRate / 100, tenureMonths / 12);

  const startDate = new Date();
  const monthsElapsed = randomInt(0, tenureMonths);
  startDate.setMonth(startDate.getMonth() - monthsElapsed);

  const maturityDate = new Date(startDate);
  maturityDate.setMonth(maturityDate.getMonth() + tenureMonths);

  const status = new Date() >= maturityDate ? 'MATURED' : 'ACTIVE';
  const currentValue = status === 'MATURED' ? maturityAmount : principal * Math.pow(1 + annualRate / 100, monthsElapsed / 12);

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'TERM_DEPOSIT',
    provider: bank.name,
    schemeName: `Fixed Deposit - ${tenureMonths} Months @ ${annualRate}%`,
    folioNumber: generateFolioNumber(),
    currentValue: parseFloat(currentValue.toFixed(2)),
    investedAmount: parseFloat(principal.toFixed(2)),
    returns: parseFloat((currentValue - principal).toFixed(2)),
    returnsPercentage: parseFloat((((currentValue - principal) / principal) * 100).toFixed(2)),
    startDate: formatDateISO(startDate),
    maturityDate: formatDateISO(maturityDate),
    status
  };
};

export const generateNPS = (user: User): Investment => {
  const yearsActive = randomInt(1, 10);
  const monthlyContribution = randomFloat(1000, 10000, 2);
  const investedAmount = monthlyContribution * 12 * yearsActive;

  // NPS returns around 10-12%
  const annualRate = randomFloat(10, 12, 2);
  const futureValue = monthlyContribution * 12 * (((Math.pow(1 + annualRate / 100, yearsActive) - 1) / (annualRate / 100)) * (1 + annualRate / 100));
  const currentValue = futureValue;
  const returns = currentValue - investedAmount;
  const returnsPercentage = (returns / investedAmount) * 100;

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - yearsActive);

  const maturityAge = 60;
  const currentAge = new Date().getFullYear() - new Date(user.dob).getFullYear();
  const yearsToMaturity = maturityAge - currentAge;

  const maturityDate = new Date();
  maturityDate.setFullYear(maturityDate.getFullYear() + yearsToMaturity);

  return {
    id: generateUUID(),
    userId: user.id,
    type: 'NPS',
    provider: 'National Pension System',
    schemeName: 'Tier I - NPS Account',
    folioNumber: `PRAN${randomInt(100000000000, 999999999999)}`,
    currentValue: parseFloat(currentValue.toFixed(2)),
    investedAmount: parseFloat(investedAmount.toFixed(2)),
    returns: parseFloat(returns.toFixed(2)),
    returnsPercentage: parseFloat(returnsPercentage.toFixed(2)),
    startDate: formatDateISO(startDate),
    maturityDate: formatDateISO(maturityDate),
    status: 'ACTIVE'
  };
};

export const generateInvestments = (user: User, count: number): Investment[] => {
  const investments: Investment[] = [];
  const types = ['MF', 'MF', 'EQUITY', 'FD', 'PPF', 'NPS']; // More mutual funds

  for (let i = 0; i < count; i++) {
    const type = randomElement(types);

    switch (type) {
      case 'MF':
        investments.push(generateMutualFund(user));
        break;
      case 'EQUITY':
        investments.push(generateEquity(user));
        break;
      case 'FD':
        investments.push(generateFixedDeposit(user));
        break;
      case 'PPF':
        investments.push(generatePPF(user));
        break;
      case 'NPS':
        investments.push(generateNPS(user));
        break;
    }
  }

  return investments;
};
