import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../src/models/Order';
import Transaction from '../src/models/Transaction';
import User from '../src/models/User';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clean up any previous test data
      await Order.deleteOne({ orderId: 'order1' });
      await Transaction.deleteOne({ txId: 'tx1' });
      await User.deleteOne({ userId: 'user1' });
      
      // Create test Order
      const order = new Order({
        orderId: 'order1',
        amount: 2000000000,
        paymentAddress: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y-test',
        sellerType: 'merchant',
        sellerWalletAddress: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y-merchant',
        status: 'pending'
      });
      await order.save();
      console.log('✅ Order created successfully:', order);
      
      // Create test Transaction
      const transaction = new Transaction({
        txId: 'tx1',
        orderId: 'order1',
        amount: 2000000000,
        buyerAddress: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y-buyer',
        status: 'pending'
      });
      await transaction.save();
      console.log('✅ Transaction created successfully:', transaction);
      
      // Create test User
      const user = new User({
        userId: 'user1',
        userType: 'shopper',
        walletAddress: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y-wallet'
      });
      await user.save();
      console.log('✅ User created successfully:', user);
      
      // Fetch the data to verify
      const savedOrder = await Order.findOne({ orderId: 'order1' });
      const savedTransaction = await Transaction.findOne({ txId: 'tx1' });
      const savedUser = await User.findOne({ userId: 'user1' });
      
      console.log('\n📊 Database verification:');
      console.log('Order found:', !!savedOrder);
      console.log('Transaction found:', !!savedTransaction);
      console.log('User found:', !!savedUser);
      
    } catch (error) {
      console.error('❌ Error during testing:', error);
    } finally {
      // Close the connection
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(error => {
    console.error('❌ Failed to connect to MongoDB:', error.message);
  });