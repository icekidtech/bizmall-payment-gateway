import { Address, Cell, beginCell } from '@ton/core';

export interface PaymentRequest {
  amount: number;
  cardDetails: {
    number: string;
    expiryDate: string;
    cvv: string;
  };
  // Add other necessary properties
}


export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class ProcessPayment {
  static createFromConfig(config: {
    orderId: bigint;
    sellerType: bigint;
    sellerWallet: Address;
  }): Cell {
    return beginCell()
      .storeUint(1, 32) // op code for process payment
      .storeUint(Number(config.orderId), 64)
      .storeUint(Number(config.sellerType), 8)
      .storeAddress(config.sellerWallet)
      .endCell();
  }
}