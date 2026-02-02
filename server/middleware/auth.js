import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

const JWT_SECRET = 'student-task-manager-secret-key-2026';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Auth middleware - protects routes
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No token provided.', 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token.', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired.', 401));
    } else {
      next(error);
    }
  }
};

export { JWT_SECRET };
