import { NextFunction, Request, Response } from 'express';
import { AuthUser } from '../types';
import { extractTokenFromHeader, verifyAuthToken } from '../utils/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No authorization token provided',
        statusCode: 401
      });
      return;
    }

    const user = await verifyAuthToken(token);
    
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        statusCode: 401
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
      statusCode: 500
    });
  }
}
