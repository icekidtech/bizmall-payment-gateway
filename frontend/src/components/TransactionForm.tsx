import { useState } from 'react';
import { useApiCall } from '../hooks/useApi';

const TransactionForm = () => {
  const { loading, error, callApi } = useApiCall();
  
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    sellerType: '0', // 0 for merchant, 1 for admin
    sellerWalletAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await callApi('/api/transactions/process-payment', {
        method: 'POST',
        data: formData
      });
      
      // Reset form on success
      setFormData({
        orderId: '',
        amount: '',
        sellerType: '0',
        sellerWalletAddress: ''
      });
      
      // In a real app, we would handle the success response
      alert('Payment processed successfully!');
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
            Order ID
          </label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (TON)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.1"
            min="0.1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="sellerType" className="block text-sm font-medium text-gray-700">
            Seller Type
          </label>
          <select
            id="sellerType"
            name="sellerType"
            value={formData.sellerType}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="0">Merchant</option>
            <option value="1">Admin</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="sellerWalletAddress" className="block text-sm font-medium text-gray-700">
            Seller Wallet Address
          </label>
          <input
            type="text"
            id="sellerWalletAddress"
            name="sellerWalletAddress"
            value={formData.sellerWalletAddress}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Process Payment'}
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded">
            Error: {error.message}
          </div>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;