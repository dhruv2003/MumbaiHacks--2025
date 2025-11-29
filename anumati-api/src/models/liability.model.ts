import mongoose, { Schema, Document } from 'mongoose';
import { Liability } from '../types';

export interface LiabilityDocument extends Omit<Liability, 'id'>, Document {}

const LiabilitySchema = new Schema<LiabilityDocument>({
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ['CREDIT_CARD', 'PERSONAL_LOAN', 'HOME_LOAN', 'CAR_LOAN', 'EDUCATION_LOAN'],
    required: true
  },
  provider: { type: String, required: true },
  accountNumber: { type: String, required: true },
  outstandingAmount: { type: Number, required: true },
  totalLimit: { type: Number },
  emiAmount: { type: Number },
  tenure: { type: Number },
  interestRate: { type: Number, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  status: { type: String, enum: ['ACTIVE', 'CLOSED', 'OVERDUE'], required: true }
}, {
  timestamps: true,
});

export const LiabilityModel = mongoose.model<LiabilityDocument>('Liability', LiabilitySchema);
