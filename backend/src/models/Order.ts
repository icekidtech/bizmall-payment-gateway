import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  amount: number;
  paymentAddress: string;
  sellerType: 'merchant' | 'admin';
  sellerWalletAddress: string;
  status: 'pending' | 'confirmed' | 'refunded';
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentAddress: { type: String, required: true },
    sellerType: { type: String, enum: ['merchant', 'admin'], required: true },
    sellerWalletAddress: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'refunded'], default: 'pending' },
    txHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);