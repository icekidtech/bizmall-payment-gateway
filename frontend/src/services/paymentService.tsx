import { Address, toNano } from '@ton/core';

interface SendTransactionOptions {
  to: string;
  amount: string;
  data?: string;
}

export class PaymentService {
  private walletProvider: any;

  constructor(walletProvider: any) {
    this.walletProvider = walletProvider;
  }

  async sendTransaction(options: SendTransactionOptions) {
    try {
      if (!this.walletProvider) {
        throw new Error('Wallet not connected');
      }

      // Convert TON amount to nanoTON
      const amountNano = toNano(options.amount);

      // Create transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360, // 5 minutes from now
        messages: [
          {
            address: options.to,
            amount: amountNano.toString(),
            payload: options.data || '',
          },
        ],
      };

      // Send transaction
      const result = await this.walletProvider.sendTransaction(transaction);
      return { success: true, hash: result.boc };
    } catch (error) {
      console.error('Payment failed:', error);
      return { success: false, error };
    }
  }
}

export const createPaymentService = (walletProvider: any) => {
  return new PaymentService(walletProvider);
};