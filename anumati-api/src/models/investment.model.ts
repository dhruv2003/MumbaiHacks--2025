import mongoose, { Schema, Document } from 'mongoose';
import { Investment } from '../types';

export interface InvestmentDocument extends Omit<Investment, 'id'>, Document {}

const InvestmentSchema = new Schema<InvestmentDocument>({
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ['MUTUAL_FUNDS', 'EQUITIES', 'BONDS', 'NPS', 'PPF', 'EPF', 'TERM_DEPOSIT'],
    required: true
  },
  provider: { type: String, required: true },
  schemeName: { type: String },
  folioNumber: { type: String },
  units: { type: Number },
  nav: { type: Number },
  currentValue: { type: Number, required: true },
  investedAmount: { type: Number, required: true },
  returns: { type: Number, required: true },
  returnsPercentage: { type: Number, required: true },
  maturityDate: { type: String },
  startDate: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'MATURED', 'CLOSED'], required: true }
}, {
  timestamps: true,
});

export const InvestmentModel = mongoose.model<InvestmentDocument>('Investment', InvestmentSchema);
