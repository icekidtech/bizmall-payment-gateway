import { useState } from 'react';
import { useUserStore } from '../store/userStore';

const WalletConnectButton = () => {
  const [connecting, setConnecting] = useState(false);
  const { walletAddress, setWalletAddress } = useUserStore();

  const handleConnectWallet = () => {
    setConnecting(true);

    // In a real implementation, this would use @tonconnect/ui-react
    // For now, we'll simulate with a mock wallet address
    setTimeout(() => {
      const mockAddress = 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y';
      setWalletAddress(mockAddress);
      setConnecting(false);
    }, 1000);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
  };

  if (walletAddress) {
    return (
      <div className="flex items-center">
        <span className="font-mono text-xs text-gray-600 mr-2">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
        <button
          onClick={handleDisconnectWallet}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnectWallet}
      disabled={connecting}
      className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-2 rounded-md text-sm font-medium"
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnectButton;