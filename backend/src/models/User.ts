import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  userType: 'admin' | 'shopper' | 'merchant';
  walletAddress?: string;
}

const UserSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['admin', 'shopper', 'merchant'], required: true },
  walletAddress: { type: String }
});

export default mongoose.model<IUser>('User', UserSchema);