import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { db } from '../services/mongodb.service';
import { isMasterUser } from '../middleware/auth.middleware';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { aaHandle, pin } = req.body;

      if (!aaHandle || !pin) {
        res.status(400).json({
          success: false,
          error: 'AA Handle and PIN are required'
        });
        return;
      }

      const { user, token } = await AuthService.login(aaHandle, pin);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            _id: (user as any)._id || user.id, // MongoDB ID for querying as master user
            aaHandle: user.aaHandle,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            pan: user.pan
          }
        }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  static async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { mobile, otp } = req.body;

      if (!mobile || !otp) {
        res.status(400).json({
          success: false,
          error: 'Mobile and OTP are required'
        });
        return;
      }

      const isValid = await AuthService.verifyOTP(mobile, otp);

      if (!isValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid OTP'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          verified: true
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // Check if master user is querying another user
      const queryUserId = req.query.user_id as string;
      const isMaster = isMasterUser(req.user?.aaHandle || '');
      
      // Regular users cannot query other users
      if (queryUserId && !isMaster) {
        res.status(403).json({
          success: false,
          error: 'Access denied: Only master user can query other users'
        });
        return;
      }

      const userId = queryUserId && isMaster ? queryUserId : req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
        return;
      }

      const user = await db.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          _id: (user as any)._id || user.id, // MongoDB ID for querying as master user
          aaHandle: user.aaHandle,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          pan: user.pan,
          dob: user.dob,
          linkedAccounts: user.linkedAccounts.length
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      data: {
        message: 'Logged out successfully'
      }
    });
  }

  static async listUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await db.getAllUsers();

      res.json({
        success: true,
        data: {
          count: users.length,
          users: users.map(user => ({
            id: user.id,
            _id: (user as any)._id || user.id, // MongoDB ID for querying as master user
            aaHandle: user.aaHandle,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            linkedAccounts: user.linkedAccounts.length
          }))
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
