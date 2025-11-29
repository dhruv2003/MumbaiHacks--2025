import { Request, Response } from 'express';
import { db } from '../services/mongodb.service';
import { Dependent, CreditCard, User } from '../types';
import { generateAccounts } from '../generators/account.generator';
import { generateMonthlyTransactions } from '../generators/transaction.generator';
import { generateInvestments } from '../generators/investment.generator';
import { generateLiabilities } from '../generators/liability.generator';
import { randomInt } from '../utils/helpers';
import { config } from '../config/env';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface FormData {
  name: string;
  email: string;
  phone: string;
  pan: string;
  dob?: string;
  pin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dependents?: Dependent[];
  creditCards?: CreditCard[];
  goldGrams?: number;
  silverGrams?: number;
}

export class FormController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const formData: FormData = req.body;

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.pan) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, phone, pan'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await db.getUserByMobile(formData.phone);
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User with this mobile number already exists'
        });
        return;
      }

      // Hash PIN (default to 1234 if not provided)
      const pin = formData.pin || '1234';
      const hashedPin = await bcrypt.hash(pin, 10);

      // Create user object
      const newUser: User = {
        id: '', // Will be set by MongoDB
        aaHandle: `${formData.phone}@anumati`,
        mobile: formData.phone,
        name: formData.name,
        email: formData.email,
        pan: formData.pan,
        dob: formData.dob || new Date(1990, 0, 1).toISOString(),
        pin: hashedPin,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        dependents: formData.dependents || [],
        creditCards: formData.creditCards || [],
        preciousMetals: {
          gold: formData.goldGrams || 0,
          silver: formData.silverGrams || 0
        },
        financialPersona: 'Balanced Investor',
        userPersona: 'Tech Savvy Professional',
        linkedAccounts: [],
        createdAt: new Date()
      };

      // Create user in database
      const userId = await db.createUser(newUser);

      // Get created user
      const createdUser = await db.getUserById(userId);

      // Generate financial data
      const monthsOfHistory = config.dataGeneration.monthsOfHistory;

      // Generate 2-5 accounts
      const accountsCount = randomInt(2, 5);
      const accounts = generateAccounts(createdUser!, accountsCount);

      for (const account of accounts) {
        account.userId = userId;

        // Generate transactions
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsOfHistory);

        const transactions = generateMonthlyTransactions(account, startDate, monthsOfHistory);
        account.transactions = transactions;

        // Update balance
        if (transactions.length > 0) {
          const lastTransaction = transactions[transactions.length - 1];
          account.currentBalance = lastTransaction.currentBalance;
          account.summary.currentBalance = lastTransaction.currentBalance;
        }

        await db.createAccount(account);
      }

      // Generate investments
      const investmentsCount = randomInt(3, 8);
      const investments = generateInvestments(createdUser!, investmentsCount);

      for (const investment of investments) {
        investment.userId = userId;
        await db.createInvestment(investment);
      }

      // Generate liabilities
      const liabilitiesCount = randomInt(0, 3);
      if (liabilitiesCount > 0) {
        const liabilities = generateLiabilities(createdUser!, liabilitiesCount);

        for (const liability of liabilities) {
          liability.userId = userId;
          await db.createLiability(liability);
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId, aaHandle: createdUser!.aaHandle },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as any
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully with financial data',
        data: {
          token,
          user: {
            id: createdUser!.id,
            aaHandle: createdUser!.aaHandle,
            name: createdUser!.name,
            mobile: createdUser!.mobile,
            email: createdUser!.email,
            pan: createdUser!.pan
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async submitForm(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const formData: FormData = req.body;

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.pan) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, phone, pan'
        });
        return;
      }

      // Get current user
      const user = await db.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Update user with form data
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        pan: formData.pan
      };

      if (formData.address) updateData.address = formData.address;
      if (formData.city) updateData.city = formData.city;
      if (formData.state) updateData.state = formData.state;
      if (formData.pincode) updateData.pincode = formData.pincode;

      if (formData.dependents && Array.isArray(formData.dependents)) {
        // Validate dependents
        for (const dep of formData.dependents) {
          if (!dep.name || !dep.age || !dep.sex) {
            res.status(400).json({
              success: false,
              error: 'Invalid dependent data. Each dependent must have name, age, and sex'
            });
            return;
          }
        }
        updateData.dependents = formData.dependents;
      }

      if (formData.creditCards && Array.isArray(formData.creditCards)) {
        // Validate credit cards
        for (const card of formData.creditCards) {
          if (!card.bankName || !card.cardType) {
            res.status(400).json({
              success: false,
              error: 'Invalid credit card data. Each card must have bankName and cardType'
            });
            return;
          }
        }
        updateData.creditCards = formData.creditCards;
      }

      if (formData.goldGrams !== undefined || formData.silverGrams !== undefined) {
        updateData.preciousMetals = {
          gold: formData.goldGrams || user.preciousMetals.gold || 0,
          silver: formData.silverGrams || user.preciousMetals.silver || 0
        };
      }

      // Update user in database
      await db.updateUser(userId, updateData);

      // Get updated user
      const updatedUser = await db.getUserById(userId);

      // Check if user has any financial data, if not generate it
      const existingAccounts = await db.getAccountsByUserId(userId);

      if (existingAccounts.length === 0) {
        // Generate financial data for this user
        const monthsOfHistory = config.dataGeneration.monthsOfHistory;

        // Generate 2-5 accounts
        const accountsCount = randomInt(2, 5);
        const accounts = generateAccounts(updatedUser!, accountsCount);

        for (const account of accounts) {
          account.userId = userId;

          // Generate transactions for each account
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - monthsOfHistory);

          const transactions = generateMonthlyTransactions(account, startDate, monthsOfHistory);
          account.transactions = transactions;

          // Update account balance to match last transaction
          if (transactions.length > 0) {
            const lastTransaction = transactions[transactions.length - 1];
            account.currentBalance = lastTransaction.currentBalance;
            account.summary.currentBalance = lastTransaction.currentBalance;
          }

          await db.createAccount(account);
        }

        // Generate 3-8 investments
        const investmentsCount = randomInt(3, 8);
        const investments = generateInvestments(updatedUser!, investmentsCount);

        for (const investment of investments) {
          investment.userId = userId;
          await db.createInvestment(investment);
        }

        // Generate 0-3 liabilities
        const liabilitiesCount = randomInt(0, 3);
        if (liabilitiesCount > 0) {
          const liabilities = generateLiabilities(updatedUser!, liabilitiesCount);

          for (const liability of liabilities) {
            liability.userId = userId;
            await db.createLiability(liability);
          }
        }
      }

      res.json({
        success: true,
        message: 'User information updated successfully',
        data: {
          user: {
            id: updatedUser!.id,
            name: updatedUser!.name,
            email: updatedUser!.email,
            mobile: updatedUser!.mobile,
            pan: updatedUser!.pan,
            address: updatedUser!.address,
            city: updatedUser!.city,
            state: updatedUser!.state,
            pincode: updatedUser!.pincode,
            dependents: updatedUser!.dependents,
            creditCards: updatedUser!.creditCards,
            preciousMetals: updatedUser!.preciousMetals,
            financialPersona: updatedUser!.financialPersona,
            userPersona: updatedUser!.userPersona
          },
          financialDataGenerated: existingAccounts.length === 0
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
