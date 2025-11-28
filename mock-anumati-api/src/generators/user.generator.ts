import { User, Dependent, CreditCard, PreciousMetals } from '../types';
import {
  INDIAN_FIRST_NAMES,
  INDIAN_LAST_NAMES,
  INDIAN_CITIES,
  CREDIT_CARD_BANKS,
  CREDIT_CARD_VARIANTS,
  RELATIONSHIPS,
  FINANCIAL_PERSONAS,
  USER_PERSONAS
} from '../config/constants';
import {
  generateUUID,
  randomElement,
  generateMobile,
  generateEmail,
  generatePAN,
  generateDOB,
  randomInt
} from '../utils/helpers';
import bcrypt from 'bcrypt';

const generateAddress = (city: string, state: string): string => {
  const houseNumber = randomInt(1, 999);
  const streets = ['Street', 'Road', 'Lane', 'Avenue', 'Colony', 'Nagar', 'Marg'];
  const areas = ['Sector', 'Phase', 'Block', 'Area'];

  const street = randomElement(streets);
  const area = randomElement(areas);
  const areaNumber = randomInt(1, 50);

  return `${houseNumber}, ${area} ${areaNumber}, ${street}, ${city}, ${state}`;
};

const generatePincode = (): string => {
  return randomInt(100000, 999999).toString();
};

const generateDependents = (): Dependent[] => {
  const count = randomInt(0, 4);
  const dependents: Dependent[] = [];

  for (let i = 0; i < count; i++) {
    const age = randomInt(0, 70);
    let relationship = randomElement(RELATIONSHIPS);

    // Adjust relationship based on age
    if (age < 18) {
      relationship = randomElement(['Son', 'Daughter']);
    } else if (age > 50) {
      relationship = randomElement(['Father', 'Mother', 'Grandfather', 'Grandmother']);
    }

    const sex = randomElement(['MALE', 'FEMALE', 'OTHER'] as const);
    const name = randomElement(INDIAN_FIRST_NAMES) + ' ' + randomElement(INDIAN_LAST_NAMES);

    dependents.push({
      name,
      age,
      sex,
      relationship
    });
  }

  return dependents;
};

const generateCreditCards = (): CreditCard[] => {
  const count = randomInt(0, 4);
  const cards: CreditCard[] = [];

  for (let i = 0; i < count; i++) {
    const bankName = randomElement(CREDIT_CARD_BANKS);
    const cardType = randomElement(['VISA', 'MASTERCARD', 'RUPAY', 'AMEX'] as const);
    const cardVariant = randomElement(CREDIT_CARD_VARIANTS);

    cards.push({
      bankName,
      cardType,
      cardVariant
    });
  }

  return cards;
};

const generatePreciousMetals = (): PreciousMetals => {
  const hasGold = Math.random() > 0.5;
  const hasSilver = Math.random() > 0.6;

  return {
    gold: hasGold ? randomInt(5, 200) : 0,
    silver: hasSilver ? randomInt(50, 1000) : 0
  };
};

export const generateUser = async (): Promise<User> => {
  const firstName = randomElement(INDIAN_FIRST_NAMES);
  const lastName = randomElement(INDIAN_LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const mobile = generateMobile();

  const cityData = randomElement(INDIAN_CITIES);
  const city = cityData.name;
  const state = cityData.state;
  const address = generateAddress(city, state);
  const pincode = generatePincode();

  // Hash the default PIN (1234)
  const hashedPin = await bcrypt.hash('1234', 10);

  return {
    id: generateUUID(),
    aaHandle: `${mobile}@anumati`,
    mobile,
    pin: hashedPin,
    name: fullName,
    email: generateEmail(fullName),
    pan: generatePAN(),
    dob: generateDOB(21, 60),
    address,
    city,
    state,
    pincode,
    dependents: generateDependents(),
    creditCards: generateCreditCards(),
    preciousMetals: generatePreciousMetals(),
    financialPersona: randomElement(FINANCIAL_PERSONAS),
    userPersona: randomElement(USER_PERSONAS),
    createdAt: new Date(),
    linkedAccounts: []
  };
};

export const generateUsers = async (count: number): Promise<User[]> => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateUser());
  }
  return users;
};
