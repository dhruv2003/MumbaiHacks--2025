
export const BANKS = [
    "HDFC Bank",
    "ICICI Bank",
    "SBI Card",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "IndusInd Bank",
    "Yes Bank",
    "Standard Chartered",
    "American Express",
    "Citi Bank"
] as const;

export const CARD_TYPES = ["VISA", "MASTERCARD", "RUPAY", "AMEX"] as const;

export const CARD_VARIANTS = {
    "HDFC Bank": ["Regalia", "Infinia", "Millennia", "MoneyBack", "Freedom"],
    "ICICI Bank": ["Coral", "Rubyx", "Sapphiro", "Amazon Pay", "Platinum"],
    "SBI Card": ["Elite", "Prime", "SimplyClick", "SimplySave", "Pulse"],
    "Axis Bank": ["Magnus", "Atlas", "Select", "Privilege", "My Zone"],
    "Kotak Mahindra Bank": ["White", "Black", "Zen", "Mojo", "Urbane"],
    "IndusInd Bank": ["Legend", "Pinnacle", "Nexxt", "Platinum", "Aura"],
    "Yes Bank": ["Marquee", "Reserv", "Elite", "Select", "Ace"],
    "Standard Chartered": ["Ultimate", "DigiSmart", "Manhattan", "Super Value", "Platinum"],
    "American Express": ["Platinum", "Gold", "Platinum Travel", "SmartEarn", "Membership Rewards"],
    "Citi Bank": ["Prestige", "PremierMiles", "Rewards", "Cash Back", "IndianOil"]
} as const;

export interface CardData {
    id: string;
    bankName: string;
    cardType: typeof CARD_TYPES[number];
    cardVariant: string;
    cardNumber: string;
    cvv: string;
    expiry: string;
    nameOnCard: string;
    limit: number;
    used: number;
    isCredit: boolean;
}

// Mock data store
let userCards: CardData[] = [
    {
        id: "1",
        bankName: "HDFC Bank",
        cardType: "VISA",
        cardVariant: "Regalia",
        cardNumber: "4567 8901 2345 6789",
        cvv: "123",
        expiry: "12/28",
        nameOnCard: "RAHUL SHARMA",
        limit: 500000,
        used: 45000,
        isCredit: true
    },
    {
        id: "2",
        bankName: "ICICI Bank",
        cardType: "MASTERCARD",
        cardVariant: "Coral",
        cardNumber: "5432 1098 7654 3210",
        cvv: "456",
        expiry: "09/26",
        nameOnCard: "RAHUL SHARMA",
        limit: 200000,
        used: 12000,
        isCredit: true
    }
];

export const getCards = () => userCards;

export const addCard = (card: CardData) => {
    userCards.push(card);
};

export const updateCardLimit = (id: string, newLimit: number) => {
    const card = userCards.find(c => c.id === id);
    if (card) {
        card.limit = newLimit;
    }
};
