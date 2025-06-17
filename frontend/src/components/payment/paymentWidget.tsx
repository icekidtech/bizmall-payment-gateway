import React, { useState, useEffect } from 'react';
import { useTonWallet } from '../../hooks/useTonWallet';
import { createPaymentService } from '../../services/paymentService';
import { api } from '../../services/api';
import { formatTonAmount } from '../../utils/formatters';

interface PaymentWidgetProps {
  merchantId: string;
  orderId: string;
  amount: string;
  description?: string;
  successCallback?: (txHash: string) => void;
  errorCallback?: (error: any) => void;
  theme?: 'light' | 'dark';
}

export const PaymentWidget: React.FC<PaymentWidgetProps> = ({
  merchantId,
  orderId,
  amount,
  description = 'Payment for order',
  successCallback,
  errorCallback,
  theme = 'light'
}) => {
  const { wallet, address, connected, connecting, connectWallet } = useTonWallet();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [merchantInfo, setMerchantInfo] = useState<any>(null);

  // Get merchant info
  useEffect(() => {
    const fetchMerchantInfo = async () => {
      try {
        const response = await api.payments.getOrder(orderId);
        setMerchantInfo(response.data);
      } catch (err) {
        console.error('Failed to fetch merchant info:', err);
        setError('Could not load merchant information');
      }
    };

    fetchMerchantInfo();
  }, [orderId]);

  // Process payment
  const handlePayment = async () => {
    if (!connected || !wallet || !merchantInfo) {
      setError('Wallet not connected or merchant info not available');
      return;
    }

    setStatus('processing');
    setError(null);

    try {
      const paymentService = createPaymentService(wallet);
      
      // Send TON transaction
      const result = await paymentService.sendTransaction({
        to: merchantInfo.sellerWalletAddress,
        amount: amount,
        data: `Order #${orderId}`
      });

      if (result.success && result.hash) {
        setTxHash(result.hash);
        
        // Confirm payment on backend
        await api.payments.confirmPayment(orderId, result.hash);
        
        setStatus('success');
        successCallback?.(result.hash);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setStatus('error');
      setError(err.message || 'Payment failed');
      errorCallback?.(err);
    }
  };

  // Choose theme colors
  const themeColors = theme === 'light' 
    ? { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200' }
    : { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-700' };

  return (
    <div className={`max-w-md rounded-lg shadow-lg overflow-hidden ${themeColors.bg} ${themeColors.text}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Pay with TON</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Amount */}
        <div className={`text-center p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900'}`}>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-2xl font-bold">{amount} TON</p>
        </div>

        {/* Wallet Connection */}
        {!connected ? (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            {connecting ? 'Connecting...' : 'Connect TON Wallet'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded text-sm">
              <p className="text-gray-500">Connected Wallet</p>
              <p className="font-mono">{address?.slice(0, 10)}...{address?.slice(-6)}</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={status === 'processing'}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              {status === 'processing' ? 'Processing...' : `Pay ${amount} TON`}
            </button>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center p-4 rounded-lg bg-green-50 text-green-700">
            <svg className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="mt-2 font-medium">Payment Successful!</p>
            {txHash && (
              <p className="text-xs mt-1 font-mono">TX: {txHash.slice(0, 10)}...{txHash.slice(-6)}</p>
            )}
          </div>
        )}

        {/* Error State */}
        {status === 'error' && error && (
          <div className="text-center p-4 rounded-lg bg-red-50 text-red-700">
            <svg className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="mt-2 font-medium">Payment Failed</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 text-center text-xs text-gray-500">
        Powered by BizMall Payment Gateway
      </div>
    </div>
  );
};

export default PaymentWidget;