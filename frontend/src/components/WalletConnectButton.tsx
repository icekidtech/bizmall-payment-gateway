import { useState } from 'react';
import { useUserStore } from '../store/userStore';

const WalletConnectButton = () => {
  const [connecting, setConnecting] = useState(false);
  const { walletAddress, setWalletAddress } = useUserStore();

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // This is a placeholder - actual TON Connect implementation will be added later
      setTimeout(() => {
        const mockWalletAddress = 'UQBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxJ7';
        setWalletAddress(mockWalletAddress);
        setConnecting(false);
      }, 1000);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  return (
    <div>
      {walletAddress ? (
        <div className="flex items-center">
          <span className="mr-2 text-sm truncate max-w-[120px]">{walletAddress}</span>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-blue-400"
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default WalletConnectButton;