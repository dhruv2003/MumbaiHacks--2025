import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { JWTPayload } from '../types';
import { logger } from '../utils/logger';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Check if user is master user
export const isMasterUser = (aaHandle: string): boolean => {
  const masterHandle = process.env.MASTER_AA_HANDLE || '9999999999@anumati';
  return aaHandle === masterHandle;
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // NO-AUTH MODE: Skip all authentication for easy AI agent access
    
    // Create a mock master user for all requests
    req.user = {
      userId: '692a1b6332c754e3cdfc4a51',
      aaHandle: '9999999999@anumati',
      mobile: '9999999999'
    };

    // Log access for audit trail (optional)
    const userId = req.query.user_id || req.body.user_id || 'none';
    logger.info(`🔓 No-auth access: user_id=${userId} endpoint=${req.path}`);

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const payload = AuthService.verifyToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};
