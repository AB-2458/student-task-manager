import bcrypt from 'bcryptjs';
import db from '../db/database.js';
import { generateToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

// Register new user
export const register = (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Insert user
    const result = db.prepare(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
    ).run(email, hashedPassword, name || null);
    
    const token = generateToken(result.lastInsertRowid);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: result.lastInsertRowid,
        email,
        name,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    
    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }
    
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = (req, res, next) => {
  try {
    const user = db.prepare('SELECT id, email, name, createdAt FROM users WHERE id = ?').get(req.userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
