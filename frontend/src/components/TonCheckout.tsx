import { useState } from 'react';
import { useApiCall } from '../hooks/useApi';

const TonCheckout: React.FC = () => {
  const { loading, error, callApi } = useApiCall();
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  
  // Mock wallet addresses
  const shopperWallet = 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y-mockBuyer';
  const sellerWallet = 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y-mockSeller';
  
  const handlePayWithTon = async () => {
    try {
      const response = await callApi('/health');
      setBackendStatus(response.status);
    } catch (err) {
      console.error('Failed to check backend health:', err);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">TON Payment Checkout</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Paying from:</p>
        <p className="font-mono bg-gray-100 p-2 rounded text-sm overflow-hidden text-ellipsis">
          Shopper Wallet: {shopperWallet}
        </p>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Paying to:</p>
        <p className="font-mono bg-gray-100 p-2 rounded text-sm overflow-hidden text-ellipsis">
          Seller Wallet: {sellerWallet}
        </p>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Amount:</p>
        <p className="text-lg font-bold">2.5 TON</p>
      </div>
      
      <button
        onClick={handlePayWithTon}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay with TON'}
      </button>
      
      {backendStatus && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          Backend Status: {backendStatus}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default TonCheckout;