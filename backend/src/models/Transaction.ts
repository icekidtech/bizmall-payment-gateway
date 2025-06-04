import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  txId: string;
  orderId: string;
  amount: number;
  buyerAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

const TransactionSchema: Schema = new Schema({
  txId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  buyerAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);