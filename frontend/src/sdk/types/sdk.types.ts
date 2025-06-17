export interface SDKConfig {
  merchantId: string;
  apiKey: string;
  environment?: 'sandbox' | 'production';
  apiUrl?: string;
  theme?: 'light' | 'dark';
  currency?: 'TON' | 'USD';
  defaultLanguage?: string;
}

export interface PaymentOptions {
  orderId: string;
  amount: string;
  description?: string;
  metadata?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
  webhookUrl?: string;
  expiresIn?: number; // minutes
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  orderId: string;
  amount: string;
  status: PaymentStatus;
  timestamp: number;
  error?: string;
}

export type PaymentStatus = 
  | 'idle' 
  | 'connecting' 
  | 'processing' 
  | 'success' 
  | 'error' 
  | 'cancelled' 
  | 'expired';

export interface PaymentWidgetProps {
  orderId: string;
  amount: string;
  description?: string;
  metadata?: Record<string, any>;
  theme?: 'light' | 'dark';
  width?: string;
  height?: string;
  borderRadius?: string;
  primaryColor?: string;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: PaymentStatus) => void;
  sdk: any; // Will be typed properly
}

export interface WalletConnection {
  address: string;
  balance: string;
  network: 'mainnet' | 'testnet';
  provider: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}