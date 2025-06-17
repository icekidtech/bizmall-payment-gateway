import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../services/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { userId, walletAddress } = req.body;
    
    if (!userId || !walletAddress) {
      return res.status(400).json({ message: 'User ID and wallet address are required' });
    }
    
    // Find user by ID
    let user = await User.findOne({ userId });
    
    // If user doesn't exist, create a new one (this is simplified, in production 
    // you might want a separate registration endpoint)
    if (!user) {
      user = await User.create({
        userId,
        walletAddress,
        userType: 'shopper' // Default to shopper for new users
      });
    } else {
      // Update wallet address if it changed
      if (user.walletAddress !== walletAddress) {
        user.walletAddress = walletAddress;
        await user.save();
      }
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

// Add this signup function
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, userType } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ userId: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      userId: email, // Using email as userId for now
      userType: userType || 'shopper',
      // Note: In production, you should hash passwords
      // For now, we're keeping it simple since this is a wallet-based system
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        userId: user.userId,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const user = await User.findOne({ userId: req.user.userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      userId: user.userId,
      userType: user.userType,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Failed to retrieve profile' });
  }
};