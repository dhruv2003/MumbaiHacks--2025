import { BankData, MerchantCategory } from '../types';

export const INDIAN_FIRST_NAMES = [
  // Male names
  'Aarav', 'Aditya', 'Advait', 'Amit', 'Anand', 'Aniket', 'Ankit', 'Arjun', 'Aryan', 'Ashish',
  'Ayush', 'Chirag', 'Darshan', 'Deepak', 'Dev', 'Dhruv', 'Gaurav', 'Hardik', 'Harsh', 'Ishaan',
  'Jay', 'Karan', 'Kartik', 'Krish', 'Krishna', 'Kunal', 'Manish', 'Mayank', 'Mihir', 'Nakul',
  'Naman', 'Nikhil', 'Nitin', 'Pranav', 'Pratik', 'Raghav', 'Rahul', 'Raj', 'Rajat', 'Rajesh',
  'Ravi', 'Rohit', 'Rohan', 'Sahil', 'Sai', 'Sameer', 'Sanjay', 'Siddharth', 'Suresh', 'Tanmay',
  'Varun', 'Vedant', 'Vikram', 'Vinay', 'Vishal', 'Vivek', 'Yash', 'Yogesh',

  // Female names
  'Aadhya', 'Aanya', 'Aditi', 'Ahana', 'Aisha', 'Ananya', 'Anjali', 'Anushka', 'Aradhya', 'Avni',
  'Diya', 'Divya', 'Ishika', 'Isha', 'Janhvi', 'Kavya', 'Khushi', 'Kiara', 'Kriti', 'Larisa',
  'Meera', 'Myra', 'Naina', 'Neha', 'Nisha', 'Pari', 'Pooja', 'Prachi', 'Priya', 'Radha',
  'Riya', 'Sana', 'Sara', 'Saanvi', 'Shanaya', 'Shivani', 'Shreya', 'Simran', 'Sneha', 'Tanvi',
  'Tara', 'Trisha', 'Vanya', 'Zara'
];

export const INDIAN_LAST_NAMES = [
  'Agarwal', 'Ahuja', 'Bajaj', 'Bansal', 'Bhat', 'Bhatia', 'Bhatt', 'Chandra', 'Chopra', 'Das',
  'Desai', 'Deshpande', 'Dubey', 'Garg', 'Ghosh', 'Goyal', 'Gupta', 'Iyer', 'Jain', 'Joshi',
  'Kapoor', 'Kaur', 'Khan', 'Khanna', 'Kumar', 'Kulkarni', 'Malhotra', 'Mehta', 'Menon', 'Mishra',
  'Nair', 'Naidu', 'Pandey', 'Patel', 'Patil', 'Pillai', 'Rao', 'Reddy', 'Roy', 'Saxena',
  'Shah', 'Sharma', 'Shetty', 'Singh', 'Sinha', 'Trivedi', 'Varma', 'Verma', 'Yadav'
];

export const INDIAN_CITIES = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Thane', state: 'Maharashtra' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vadodara', state: 'Gujarat' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Faridabad', state: 'Haryana' },
  { name: 'Meerut', state: 'Uttar Pradesh' },
  { name: 'Rajkot', state: 'Gujarat' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Srinagar', state: 'Jammu and Kashmir' },
  { name: 'Aurangabad', state: 'Maharashtra' },
  { name: 'Dhanbad', state: 'Jharkhand' },
  { name: 'Amritsar', state: 'Punjab' },
  { name: 'Navi Mumbai', state: 'Maharashtra' },
  { name: 'Allahabad', state: 'Uttar Pradesh' },
  { name: 'Ranchi', state: 'Jharkhand' },
  { name: 'Howrah', state: 'West Bengal' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Jabalpur', state: 'Madhya Pradesh' },
  { name: 'Gwalior', state: 'Madhya Pradesh' },
  { name: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Kota', state: 'Rajasthan' }
];

export const BANKS: BankData[] = [
  // Public Sector Banks
  { code: 'SBIN', name: 'State Bank of India', ifscPrefix: 'SBIN0' },
  { code: 'PUNB', name: 'Punjab National Bank', ifscPrefix: 'PUNB0' },
  { code: 'BARB', name: 'Bank of Baroda', ifscPrefix: 'BARB0' },
  { code: 'CNRB', name: 'Canara Bank', ifscPrefix: 'CNRB0' },
  { code: 'UBIN', name: 'Union Bank of India', ifscPrefix: 'UBIN0' },
  { code: 'BKID', name: 'Bank of India', ifscPrefix: 'BKID0' },
  { code: 'IDIB', name: 'Indian Bank', ifscPrefix: 'IDIB0' },
  { code: 'CBIN', name: 'Central Bank of India', ifscPrefix: 'CBIN0' },

  // Private Sector Banks
  { code: 'HDFC', name: 'HDFC Bank', ifscPrefix: 'HDFC0' },
  { code: 'ICIC', name: 'ICICI Bank', ifscPrefix: 'ICIC0' },
  { code: 'UTIB', name: 'Axis Bank', ifscPrefix: 'UTIB0' },
  { code: 'KKBK', name: 'Kotak Mahindra Bank', ifscPrefix: 'KKBK0' },
  { code: 'INDB', name: 'IndusInd Bank', ifscPrefix: 'INDB0' },
  { code: 'YESB', name: 'Yes Bank', ifscPrefix: 'YESB0' },
  { code: 'IDFB', name: 'IDFC First Bank', ifscPrefix: 'IDFB0' },
  { code: 'FDRL', name: 'Federal Bank', ifscPrefix: 'FDRL0' },

  // Payment Banks
  { code: 'PYTM', name: 'Paytm Payments Bank', ifscPrefix: 'PYTM0' },
  { code: 'AIRP', name: 'Airtel Payments Bank', ifscPrefix: 'AIRP0' }
];

export const UPI_HANDLES = [
  'okicici',
  'paytm',
  'ybl',
  'oksbi',
  'axisbank',
  'okhdfcbank',
  'okaxis',
  'ibl',
  'apl',
  'fbl',
  'indianbank',
  'cnrb',
  'barodampay',
  'pnb',
  'upi'
];

export const MERCHANTS: MerchantCategory = {
  food: [
    'Swiggy', 'Zomato', 'Dominos Pizza', 'McDonalds', 'KFC', 'Burger King',
    'Subway', 'Pizza Hut', 'Starbucks Coffee', 'Cafe Coffee Day',
    'Wow Momo', 'Faasos', 'Behrouz Biryani', 'Oven Story',
    'Haldirams', 'Bikanervala', 'Sagar Ratna', 'Saravana Bhavan'
  ],
  ecommerce: [
    'Amazon India', 'Flipkart', 'Myntra', 'Ajio', 'Meesho',
    'Snapdeal', 'Nykaa', 'FirstCry', 'Pepperfry',
    'Urban Ladder', 'Lenskart', 'Boat Lifestyle'
  ],
  grocery: [
    'BigBasket', 'Blinkit', 'Zepto', 'Swiggy Instamart',
    'JioMart', 'DMart Ready', 'Amazon Fresh', 'Dunzo',
    'Milkbasket', 'Nature\'s Basket', 'Spencer\'s Retail'
  ],
  transport: [
    'Ola Cabs', 'Uber India', 'Rapido', 'Blu Smart',
    'Delhi Metro', 'Mumbai Metro', 'Bangalore Metro',
    'IRCTC', 'Redbus', 'MakeMyTrip', 'Goibibo',
    'Indian Oil Fuel', 'Bharat Petroleum', 'HP Petrol Pump'
  ],
  utilities: [
    'Reliance Jio', 'Airtel', 'Vi Vodafone Idea', 'BSNL',
    'Tata Power', 'Adani Electricity', 'BESCOM', 'MSEDCL',
    'Indraprastha Gas', 'Mahanagar Gas',
    'Tata Sky', 'Dish TV', 'Airtel Digital TV'
  ],
  entertainment: [
    'Netflix India', 'Amazon Prime Video', 'Disney+ Hotstar',
    'Zee5', 'SonyLIV', 'Voot', 'Apple TV+',
    'Spotify India', 'YouTube Premium', 'Gaana',
    'BookMyShow', 'PVR Cinemas', 'INOX Movies'
  ],
  education: [
    'Byju\'s', 'Unacademy', 'Vedantu', 'Toppr',
    'upGrad', 'Coursera', 'Udemy',
    'Simplilearn', 'Great Learning', 'Testbook'
  ],
  healthcare: [
    'Apollo Pharmacy', '1mg', 'PharmEasy', 'Netmeds',
    'Practo', 'Apollo Hospitals', 'Fortis Healthcare',
    'Max Healthcare', 'Manipal Hospitals'
  ],
  shopping: [
    'Reliance Digital', 'Croma', 'Vijay Sales',
    'Lifestyle', 'Westside', 'Pantaloons', 'Max Fashion',
    'Decathlon Sports', 'Tanishq Jewellers', 'Kalyan Jewellers'
  ],
  others: [
    'CRED', 'Groww', 'Zerodha', 'Upstox',
    'Policy Bazaar', 'Paytm', 'PhonePe', 'Google Pay',
    'Amazon Pay', 'FreeCharge', 'MobiKwik'
  ]
};

export const MUTUAL_FUND_HOUSES = [
  'SBI Mutual Fund',
  'HDFC Mutual Fund',
  'ICICI Prudential Mutual Fund',
  'Aditya Birla Sun Life Mutual Fund',
  'Nippon India Mutual Fund',
  'Kotak Mahindra Mutual Fund',
  'UTI Mutual Fund',
  'Axis Mutual Fund',
  'DSP Mutual Fund',
  'Franklin Templeton Mutual Fund',
  'Mirae Asset Mutual Fund',
  'Tata Mutual Fund',
  'IDFC Mutual Fund',
  'Invesco Mutual Fund'
];

export const MUTUAL_FUND_SCHEMES = [
  'Equity Large Cap Fund',
  'Equity Mid Cap Fund',
  'Small Cap Fund',
  'Multi Cap Fund',
  'Focused Equity Fund',
  'Blue Chip Fund',
  'Balanced Advantage Fund',
  'Hybrid Equity Fund',
  'Tax Saver Fund (ELSS)',
  'Index Fund - Nifty 50',
  'Index Fund - Sensex',
  'Liquid Fund',
  'Ultra Short Duration Fund',
  'Corporate Bond Fund',
  'Banking & PSU Fund'
];

export const INSURANCE_COMPANIES = {
  life: [
    'SBI Life Insurance',
    'HDFC Life Insurance',
    'ICICI Prudential Life',
    'Max Life Insurance',
    'Bajaj Allianz Life',
    'Aditya Birla Sun Life Insurance',
    'LIC of India'
  ],
  general: [
    'ICICI Lombard',
    'HDFC ERGO',
    'Bajaj Allianz General Insurance',
    'Reliance General Insurance',
    'New India Assurance',
    'National Insurance Company'
  ]
};

export const TRANSACTION_CATEGORIES = {
  CREDIT: [
    'Salary',
    'Freelance Income',
    'Investment Returns',
    'Refund',
    'Cashback',
    'Transfer from Savings',
    'Interest Credit',
    'Dividend',
    'Rental Income',
    'Other Income'
  ],
  DEBIT: [
    'Food & Dining',
    'Shopping',
    'Groceries',
    'Transport',
    'Fuel',
    'Utilities',
    'Entertainment',
    'Education',
    'Healthcare',
    'Rent',
    'EMI',
    'Insurance',
    'Investment',
    'Transfer',
    'ATM Withdrawal',
    'Bill Payment',
    'Other Expenses'
  ]
};

export const COMPANY_NAMES = [
  'Tata Consultancy Services',
  'Infosys Technologies',
  'Wipro Limited',
  'HCL Technologies',
  'Tech Mahindra',
  'Reliance Industries',
  'HDFC Bank',
  'ICICI Bank',
  'Amazon India',
  'Flipkart',
  'Ola Cabs',
  'Paytm',
  'Swiggy',
  'Zomato',
  'Byju\'s',
  'Accenture India',
  'Cognizant Technology Solutions',
  'IBM India',
  'Microsoft India',
  'Google India',
  'Larsen & Toubro',
  'Bharti Airtel',
  'Asian Paints',
  'Maruti Suzuki',
  'Mahindra & Mahindra'
];

export const PURPOSE_CODES = [
  { code: '101', text: 'Wealth management service' },
  { code: '102', text: 'Customer spending patterns, budget or other reportings' },
  { code: '103', text: 'To process borrower\'s loan application' },
  { code: '104', text: 'Check credit eligibility' },
  { code: '105', text: 'To process insurance application' },
  { code: '106', text: 'To process investment application' },
  { code: '107', text: 'To check account balance' },
  { code: '108', text: 'To verify identity' }
];

export const CONSENT_MODES = ['STORE', 'VIEW', 'QUERY', 'STREAM'] as const;
export const FETCH_TYPES = ['ONETIME', 'PERIODIC'] as const;
export const CONSENT_TYPES = ['PROFILE', 'SUMMARY', 'TRANSACTIONS'] as const;

export const CREDIT_CARD_BANKS = [
  'HDFC Bank',
  'ICICI Bank',
  'SBI Card',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'Standard Chartered',
  'Citibank',
  'HSBC',
  'American Express',
  'Yes Bank',
  'IDFC First Bank',
  'RBL Bank',
  'AU Small Finance Bank'
];

export const CREDIT_CARD_VARIANTS = [
  'Regalia',
  'Infinia',
  'Diners Club Black',
  'Signature',
  'Platinum',
  'Gold',
  'Silver',
  'Titanium',
  'Privilege',
  'Coral',
  'MoneyBack',
  'Cashback',
  'Rewards',
  'Miles',
  'Amazon Pay',
  'Flipkart',
  'SimplyCLICK',
  'SuperValue'
];

export const RELATIONSHIPS = [
  'Father',
  'Mother',
  'Spouse',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Grandfather',
  'Grandmother'
];

export const FINANCIAL_PERSONAS = [
  'Conservative Saver',
  'Aggressive Investor',
  'Balanced Investor',
  'Risk Averse',
  'Growth Oriented',
  'Income Focused',
  'Wealth Builder',
  'Retirement Planner',
  'Young Professional',
  'Family Provider'
];

export const USER_PERSONAS = [
  'Tech Savvy Professional',
  'Traditional Conservative',
  'Young Entrepreneur',
  'Family Oriented',
  'Career Focused',
  'Lifestyle Enthusiast',
  'Budget Conscious',
  'Premium Customer',
  'Digital Native',
  'Value Seeker'
];
