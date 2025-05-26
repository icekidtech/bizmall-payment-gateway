export interface PaymentRequest {
  amount: number;
  cardDetails: {
    number: string;
    expiryDate: string;
    cvv: string;
  };
  // Add other necessary properties
}

export function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  // Implementation here
  return Promise.resolve({ success: true });
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}