import express from 'express';
import { login, signup, getProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes
router.get('/profile', auth, getProfile);

export default router;