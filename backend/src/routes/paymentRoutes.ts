import express from 'express';
import { createOrder, confirmPayment } from '../controllers/paymentController';
// import { auth } from '../middleware/auth'; // Add auth middleware if needed

const router = express.Router();

// Assuming /api/payments prefix is added in index.ts or app.ts
router.post('/create-order', createOrder); // No auth for creating an order intent
router.post('/confirm', confirmPayment);   // Potentially add auth if only logged-in users can confirm

export default router;