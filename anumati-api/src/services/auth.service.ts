import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, JWTPayload } from '../types';
import { config } from '../config/env';
import { db } from './mongodb.service';
import { validateAAHandle, validatePIN, validateMobile } from '../utils/validators';

export class AuthService {
  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      aaHandle: user.aaHandle,
      mobile: user.mobile
    };

    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as any);
  }

  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async hashPIN(pin: string): Promise<string> {
    return bcrypt.hash(pin, 10);
  }

  static async comparePIN(pin: string, hashedPin: string): Promise<boolean> {
    return bcrypt.compare(pin, hashedPin);
  }

  static async register(mobile: string, pin: string, _name: string): Promise<{ user: User; token: string }> {
    // Validate mobile
    if (!validateMobile(mobile)) {
      throw new Error('Invalid mobile number');
    }

    // Validate PIN
    if (!validatePIN(pin)) {
      throw new Error('PIN must be 4 digits');
    }

    // Check if user already exists
    const existingUser = await db.getUserByMobile(mobile);
    if (existingUser) {
      throw new Error('User with this mobile number already exists');
    }

    // Create new user (will be done manually in real scenario - this is just for testing)
    throw new Error('Registration is disabled. Use pre-generated users for testing.');
  }

  static async login(aaHandle: string, pin: string): Promise<{ user: User; token: string }> {
    // Validate AA Handle
    if (!validateAAHandle(aaHandle)) {
      throw new Error('Invalid AA Handle format. Expected: {10-digit-mobile}@anumati');
    }

    // Find user
    const user = await db.getUserByAAHandle(aaHandle);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify PIN
    const isValidPIN = await this.comparePIN(pin, user.pin);
    if (!isValidPIN) {
      throw new Error('Invalid PIN');
    }

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  static async verifyOTP(_mobile: string, otp: string): Promise<boolean> {
    // Mock OTP verification - always accept '1234' for testing
    return otp === '1234';
  }
}
