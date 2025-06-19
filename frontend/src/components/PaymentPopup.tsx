import React, { useState } from "react";
import { useTonWallet } from "../hooks/useTonConnect";
import { TonConnectButton } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
import QRCode from 'qrcode';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  amount: string;
  description?: string;
  orderId?: string;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  walletAddress,
  amount,
  description,
  orderId,
}) => {
  const { wallet, address, connected } = useTonWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  React.useEffect(() => {
    if (walletAddress && amount) {
      generatePaymentQR();
    }
  }, [walletAddress, amount]);

  const generatePaymentQR = async () => {
    try {
      const tonDeepLink = `ton://transfer/${walletAddress}?amount=${Math.floor(parseFloat(amount) * 1e9)}&text=${encodeURIComponent(description || '')}`;
      const qr = await QRCode.toDataURL(tonDeepLink);
      setQrCode(qr);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  const handlePayment = async () => {
    if (!connected || !wallet) {
      setError("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const destination = Address.parse(walletAddress);
      const amountNano = Math.floor(parseFloat(amount) * 1e9); // Convert TON to nanotons

      // Create transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        messages: [
          {
            address: destination.toString(),
            amount: amountNano.toString(),
            payload: orderId ? `order:${orderId}` : '', // Optional order reference
          },
        ],
      };

      // Send transaction
      const result = await wallet.send(transaction);
      console.log('Transaction sent:', result);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pay with TON</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <div className="mt-1 flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">{amount}</span>
              <span className="ml-1 text-xl text-gray-600">TON</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Recipient</label>
            <div className="mt-1 font-mono text-sm bg-gray-50 p-3 rounded-lg break-all">
              {walletAddress}
            </div>
          </div>

          {description && (
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-gray-600">{description}</p>
            </div>
          )}

          {qrCode && (
            <div className="flex justify-center py-4">
              <img src={qrCode} alt="Payment QR Code" className="w-48 h-48" />
              <p className="text-sm text-gray-500 text-center mt-2">
                Scan with your TON wallet
              </p>
            </div>
          )}

          <div className="space-y-4">
            {!connected ? (
              <div className="flex justify-center">
                <TonConnectButton />
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ${amount} TON`
                )}
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Payment successful!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;