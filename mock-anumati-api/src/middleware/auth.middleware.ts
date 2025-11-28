import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { JWTPayload } from '../types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is missing'
      });
      return;
    }

    const payload = AuthService.verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
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
