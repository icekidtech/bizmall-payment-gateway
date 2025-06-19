import { useTonWallet } from '../hooks/useTonConnect';
import { TonConnectButton } from '@tonconnect/ui-react';

const WalletConnectButton = () => {
  const { address, connected } = useTonWallet();

  if (connected && address) {
    return (
      <div className="flex items-center space-x-4">
        <span className="font-mono text-sm bg-gray-100 rounded-lg px-3 py-1">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <TonConnectButton />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <TonConnectButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all" />
    </div>
  );
};

export default WalletConnectButton;