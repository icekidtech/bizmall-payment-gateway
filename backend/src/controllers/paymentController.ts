import { Request, Response } from 'express';
import crypto from 'crypto'; // For generating unique order IDs
// Assuming you have an Order model and a service for blockchain interactions
import Order from '../models/Order'; // Example Order model
import { verifyTonTransaction } from '../services/blockchainService'; // We'll define this conceptually

// --- Create Order ---
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, currency, description, merchantId } = req.body; // merchantId is for off-chain accounting

        if (!amount || !currency) {
            return res.status(400).json({ message: 'Amount and currency are required' });
        }
        if (currency !== 'TON') {
            return res.status(400).json({ message: 'Currently only TON currency is supported' });
        }

        const orderId = crypto.randomBytes(16).toString('hex'); // Generate a unique order ID

        // Retrieve contract and BizMall wallet addresses from environment variables
        const paymentGatewayContractAddress = process.env.PAYMENT_GATEWAY_CONTRACT_ADDRESS;
        const bizmallCentralWalletAddress = process.env.BIZMALL_MAIN_WALLET_ADDRESS;

        if (!paymentGatewayContractAddress || !bizmallCentralWalletAddress) {
            console.error('Payment gateway contract address or BizMall wallet address not configured');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Save the order to your database
        const newOrder = new Order({
            orderId,
            merchantId, // For your internal records and future payouts
            amount, // Store amount in the smallest unit (nanotons) or as a string and convert later
            currency,
            description,
            status: 'pending',
            createdAt: new Date(),
        });
        await newOrder.save();

        res.status(201).json({
            message: 'Order created successfully',
            orderId,
            amount, // Send amount back for frontend display
            currency,
            description,
            paymentGatewayContractAddress, // Address user needs to send funds to
            // bizmallCentralWalletAddress, // Optionally send this if FE needs to display it for info
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// --- Confirm Payment ---
export const confirmPayment = async (req: Request, res: Response) => {
    try {
        const { orderId, transactionHash } = req.body;

        if (!orderId || !transactionHash) {
            return res.status(400).json({ message: 'Order ID and transaction hash are required' });
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'paid' || order.status === 'completed') {
            return res.status(200).json({ message: 'Order already confirmed', order });
        }

        const paymentGatewayContractAddress = process.env.PAYMENT_GATEWAY_CONTRACT_ADDRESS;
        const bizmallCentralWalletAddress = process.env.BIZMALL_MAIN_WALLET_ADDRESS;
        const tonApiEndpoint = process.env.TON_API_ENDPOINT;
        const tonApiKey = process.env.TON_API_KEY;

        if (!paymentGatewayContractAddress || !bizmallCentralWalletAddress || !tonApiEndpoint) {
            console.error('Server configuration missing for payment confirmation');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const verificationResult = await verifyTonTransaction({
            transactionHash,
            expectedDestination: paymentGatewayContractAddress, // User pays the contract
            expectedInternalDestination: bizmallCentralWalletAddress, // Contract forwards to BizMall
            expectedAmount: order.amount, // Ensure this is in nanotons if comparing directly
            expectedCommentOrderId: orderId, // If you plan to include orderId in the tx comment
            tonApiEndpoint,
            tonApiKey,
        });

        if (verificationResult.isValid) {
            order.status = 'paid'; // Or 'completed'
            order.transactionHash = transactionHash;
            order.paymentConfirmedAt = new Date();
            await order.save();
            // TODO: Optionally, trigger notifications or other post-payment processes here
            return res.status(200).json({ message: 'Payment confirmed successfully', order });
        } else {
            return res.status(400).json({ message: 'Payment verification failed', details: verificationResult.error });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ message: 'Failed to confirm payment' });
    }
};