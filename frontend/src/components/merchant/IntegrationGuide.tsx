import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { formatAddress } from '../../utils/formatters';

const IntegrationGuide: React.FC = () => {
  const { walletAddress } = useUserStore();
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'vanilla' | 'vue'>('react');

  const merchantId = 'YOUR_MERCHANT_ID'; // Would come from API in a real implementation

  const codeExamples = {
    react: `import { PaymentWidget } from '@bizmall/ton-payment';

function Checkout() {
  return (
    <PaymentWidget
      merchantId="${merchantId}"
      orderId="ORDER123"
      amount="2.5"
      description="Premium Plan"
      onSuccess={(txHash) => console.log('Payment successful:', txHash)}
      onError={(error) => console.error('Payment failed:', error)}
    />
  );
}`,
    vanilla: `<div id="payment-container"></div>

<script src="https://cdn.bizmall.io/ton-payment.js"></script>
<script>
  BizmallPayment.render({
    container: '#payment-container',
    merchantId: '${merchantId}',
    orderId: 'ORDER123',
    amount: '2.5',
    description: 'Premium Plan',
    onSuccess: function(txHash) {
      console.log('Payment successful:', txHash);
    },
    onError: function(error) {
      console.error('Payment failed:', error);
    }
  });
</script>`,
    vue: `<template>
  <PaymentWidget
    merchantId="${merchantId}"
    orderId="ORDER123"
    amount="2.5"
    description="Premium Plan"
    @success="onSuccess"
    @error="onError"
  />
</template>

<script>
import { PaymentWidget } from '@bizmall/ton-payment-vue';

export default {
  components: {
    PaymentWidget
  },
  methods: {
    onSuccess(txHash) {
      console.log('Payment successful:', txHash);
    },
    onError(error) {
      console.error('Payment failed:', error);
    }
  }
}
</script>`
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="space-y-8">
      {/* API Credentials */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Your API Credentials</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant ID
            </label>
            <div className="flex">
              <input
                type="text"
                value={merchantId}
                readOnly
                className="flex-1 p-2 border rounded-l-lg bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(merchantId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address
            </label>
            <div className="flex">
              <input
                type="text"
                value={walletAddress || ''}
                readOnly
                className="flex-1 p-2 border rounded-l-lg bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(walletAddress || '')}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Code */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Integration Code</h3>
        
        <div className="flex space-x-2 mb-4">
          {(Object.keys(codeExamples) as Array<keyof typeof codeExamples>).map((framework) => (
            <button
              key={framework}
              onClick={() => setSelectedFramework(framework)}
              className={`px-4 py-2 rounded-lg capitalize ${
                selectedFramework === framework
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {framework}
            </button>
          ))}
        </div>

        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{codeExamples[selectedFramework]}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(codeExamples[selectedFramework])}
            className="absolute top-4 right-4 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Installation</h3>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">1. Install the package</h4>
          <div className="bg-gray-900 p-3 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
            {selectedFramework === 'vue' 
              ? 'npm install @bizmall/ton-payment-vue' 
              : selectedFramework === 'react' 
                ? 'npm install @bizmall/ton-payment' 
                : '<!-- No installation needed for vanilla JS -->'}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">2. Add the code to your project</h4>
          <p className="text-gray-600 text-sm mb-2">
            Copy the code example above and paste it into your application.
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
          <p className="flex items-center">
            <span className="mr-2">ℹ️</span>
            <span>For complete documentation, visit our <a href="#" className="text-blue-600 hover:underline">Developer Portal</a>.</span>
          </p>
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Testing your Integration</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Test Cards</h4>
            <p className="text-sm text-gray-600 mb-2">
              Use these test wallets for testing payments:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>For successful payments: Any amount</li>
              <li>For failed payments: Use amount exactly 0.1 TON</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Test Environment</h4>
            <p className="text-sm text-gray-700">
              All integrations use TON testnet by default in development mode.
              Switch to production by adding <code className="bg-gray-100 px-1 py-0.5 rounded">mode="production"</code> to your widget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;