import { useState, useEffect } from 'react';
import { TonConnectUI } from '@tonconnect/ui-react';

let tonConnectUIInstance: TonConnectUI | null = null;

// Create singleton instance to avoid multiple initializations
const getTonConnectUI = (): TonConnectUI => {
  if (!tonConnectUIInstance) {
    try {
      tonConnectUIInstance = new TonConnectUI({
        manifestUrl: '/ton-connect-manifest.json',
      });
    } catch (error) {
      console.error('Failed to initialize TonConnectUI:', error);
    }
  }
  return tonConnectUIInstance as TonConnectUI;
};

export const useTonWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
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
      
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Error in wallet hook:', error);
    }
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