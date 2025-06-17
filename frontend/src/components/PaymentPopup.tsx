import React, { useState } from "react";
import { useTonWallet } from "../hooks/useTonConnect";

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string; // BizMall's wallet address
  amount: string; // Amount to pay in TON
  description?: string; // Optional description of the payment
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  walletAddress,
  amount,
  description,
}) => {
  const { connectWallet, disconnectWallet, address, connected, connecting } =
    useTonWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!connected) {
      setError("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate sending TON (replace with actual TON wallet integration)
      console.log(`Sending ${amount} TON to ${walletAddress} from ${address}`);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Payment failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-black mb-4">Pay with TON</h2>
        <p className="text-black mb-2">Recipient Wallet:</p>
        <p className="font-mono bg-gray-100 p-2 rounded text-sm overflow-hidden text-ellipsis mb-4">
          {walletAddress}
        </p>
        <p className="text-black mb-2">Amount:</p>
        <p className="text-lg font-bold mb-4">{amount} TON</p>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}

        {!connected ? (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            {loading ? "Processing..." : `Pay ${amount} TON`}
          </button>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            Error: {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            Payment successful!
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentPopup;