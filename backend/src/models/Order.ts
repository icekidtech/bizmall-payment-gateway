import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    orderId: string;
    merchantId?: string; // For off-chain accounting
    amount: string; // Store as string to maintain precision, convert to BigInt for nanoTONs
    currency: string;
    description?: string;
    status: 'pending' | 'paid' | 'failed' | 'expired' | 'completed';
    transactionHash?: string;
    paymentGatewayContractAddress?: string; // Could store this for reference
    createdAt: Date;
    paymentConfirmedAt?: Date;
}

const OrderSchema: Schema = new Schema({
    orderId: { type: String, required: true, unique: true, index: true },
    merchantId: { type: String, index: true },
    amount: { type: String, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true, default: 'pending' },
    transactionHash: { type: String },
    paymentGatewayContractAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
    paymentConfirmedAt: { type: Date },
});

export default mongoose.model<IOrder>('Order', OrderSchema);