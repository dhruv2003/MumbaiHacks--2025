import mongoose, { Schema, Document } from 'mongoose';
import { Account, AccountSummary, Transaction } from '../types';

export interface AccountDocument extends Omit<Account, 'id'>, Document {}

const AccountProfileSchema = new Schema({
  holders: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const AccountSummarySchema = new Schema<AccountSummary>({
  currentBalance: { type: Number, required: true },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  balanceDateTime: { type: String, required: true },
  type: { type: String, enum: ['SAVINGS', 'CURRENT', 'CREDIT', 'FD', 'RD'], required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'CLOSED'], required: true },
  branch: { type: String, required: true },
  ifscCode: { type: String, required: true },
  micrCode: { type: String },
  openingDate: { type: String, required: true },
  closingDate: { type: String },
  currentODLimit: { type: Number },
  drawingLimit: { type: Number },
  facility: { type: String, enum: ['OD', 'CC'] }
}, { _id: false });

const TransactionSchema = new Schema<Transaction>({
  id: { type: String, required: true },
  accountId: { type: String, required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  mode: { type: String, enum: ['CASH', 'ATM', 'CARD', 'UPI', 'FT', 'OTHERS'], required: true },
  amount: { type: Number, required: true },
  currentBalance: { type: Number, required: true },
  txnId: { type: String, required: true },
  narration: { type: String, required: true },
  reference: { type: String, required: true },
  transactionTimestamp: { type: String, required: true },
  valueDate: { type: String, required: true },
  category: { type: String },
  merchantName: { type: String },
  merchantUPI: { type: String },
  embedding: { type: [Number] }
}, { _id: false });

const AccountSchema = new Schema<AccountDocument>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['DEPOSIT', 'CREDIT_CARD', 'TERM_DEPOSIT', 'RECURRING_DEPOSIT'], required: true },
  fipId: { type: String, required: true },
  fipName: { type: String, required: true },
  maskedAccNumber: { type: String, required: true },
  actualAccNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branch: { type: String, required: true },
  accountType: { type: String, enum: ['SAVINGS', 'CURRENT', 'CREDIT', 'FD', 'RD'], required: true },
  currentBalance: { type: Number, required: true },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'CLOSED'], required: true },
  openingDate: { type: String, required: true },
  closingDate: { type: String },
  linkRefNumber: { type: String, required: true },
  profile: { type: AccountProfileSchema, required: true },
  summary: { type: AccountSummarySchema, required: true },
  transactions: { type: [TransactionSchema], default: [] }
}, {
  timestamps: true,
});

export const AccountModel = mongoose.model<AccountDocument>('Account', AccountSchema);
