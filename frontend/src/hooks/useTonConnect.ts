import { useState, useEffect } from 'react';
import { TonConnectUI } from '@tonconnect/ui-react';

let tonConnectUIInstance: TonConnectUI | null = null;

// Create singleton instance to avoid multiple initializations
const getTonConnectUI = (): TonConnectUI => {
  if (!tonConnectUIInstance) {
    tonConnectUIInstance = new TonConnectUI({
      manifestUrl: 'http://localhost:5173/ton-connect-manifest.json',
      //retryLimit: 5, // Add retry attempts
      //connectRequestTimeout: 120_000 // Increase timeout
    });
  }
  return tonConnectUIInstance;
};

export const useTonWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const initWallet = async () => {
      try {
        const tonConnect = getTonConnectUI();
        const unsubscribe = tonConnect.onStatusChange((wallet) => {
          if (wallet) {
            setWallet(wallet);
            setAddress(wallet.account.address);
            setConnected(true);
          } else {
            setWallet(null);
            setAddress(null);
            setConnected(false);
          }
          setConnecting(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Wallet initialization error:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initWallet, 1000 * retryCount);
        }
      }
    };

    initWallet();
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const tonConnect = getTonConnectUI();
      await tonConnect.openModal();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const tonConnect = getTonConnectUI();
      await tonConnect.disconnect();
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
    }
  };

  return { wallet, address, connected, connecting, connectWallet, disconnectWallet };
};