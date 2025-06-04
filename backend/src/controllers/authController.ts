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