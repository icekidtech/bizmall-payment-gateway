import React, { useState } from "react";

interface PaymentWidgetProps {
  orderId: string;
  amount: string;
  description?: string;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
}

const PaymentWidget: React.FC<PaymentWidgetProps> = ({
  orderId,
  amount,
  description,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment process (replace with actual TON wallet integration)
      const txHash = "0x123456789abcdef"; // Mock transaction hash
      setTimeout(() => {
        setLoading(false);
        onSuccess(txHash);
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      onError(error.message || "Payment failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-black mb-4">Pay with TON</h2>
      <p className="text-black mb-2">Order ID: {orderId}</p>
      <p className="text-black mb-4">Amount: {amount} TON</p>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
      >
        {loading ? "Processing..." : `Pay ${amount} TON`}
      </button>
    </div>
  );
};

export default PaymentWidget;