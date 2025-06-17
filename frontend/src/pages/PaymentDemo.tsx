import React, { useState } from "react";
import PaymentPopup from "../components/PaymentPopup";
import ErrorBoundary from "../components/ErrorBoundary";

const PaymentDemo: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <button
          onClick={handleOpenPopup}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Open Payment Popup
        </button>

        <PaymentPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          walletAddress="EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y"
          amount="2.5"
          description="Test payment for BizMall"
        />
      </div>
    </ErrorBoundary>
  );
};

export default PaymentDemo;