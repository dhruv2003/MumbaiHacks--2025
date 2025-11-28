import mongoose, { Schema, Document } from 'mongoose';
import { User, Dependent, CreditCard, PreciousMetals } from '../types';

export interface UserDocument extends Omit<User, 'id' | 'createdAt'>, Document {}

const DependentSchema = new Schema<Dependent>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  relationship: { type: String }
}, { _id: false });

const CreditCardSchema = new Schema<CreditCard>({
  bankName: { type: String, required: true },
  cardType: { type: String, enum: ['VISA', 'MASTERCARD', 'RUPAY', 'AMEX'], required: true },
  cardVariant: { type: String }
}, { _id: false });

const PreciousMetalsSchema = new Schema<PreciousMetals>({
  gold: { type: Number, default: 0 },
  silver: { type: Number, default: 0 }
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
  aaHandle: { type: String, required: true, unique: true, index: true },
  mobile: { type: String, required: true, unique: true, index: true },
  pin: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  pan: { type: String, required: true },
  dob: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  dependents: { type: [DependentSchema], default: [] },
  creditCards: { type: [CreditCardSchema], default: [] },
  preciousMetals: { type: PreciousMetalsSchema, default: { gold: 0, silver: 0 } },
  financialPersona: { type: String },
  userPersona: { type: String },
  linkedAccounts: { type: [String], default: [] }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
