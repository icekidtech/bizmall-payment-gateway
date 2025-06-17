import React, { useState, useEffect } from 'react';
import { PaymentWidgetProps, PaymentStatus } from '../types/sdk.types';
import { formatTonAmount, formatAddress } from '../utils/formatters';

export const PaymentWidget: React.FC<PaymentWidgetProps> = ({
  orderId,
  amount,
  description,
  metadata,
  theme = 'light',
  width = '400px',
  borderRadius = '8px',
  primaryColor = '#0088ff',
  onSuccess,
  onError,
  onStatusChange,
  sdk
}) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    // Check initial wallet status
    setWalletConnected(sdk.isWalletConnected());
    setWalletAddress(sdk.getWalletAddress());

    // Listen for wallet events
    sdk.on('walletConnected', handleWalletConnected);
    sdk.on('walletDisconnected', handleWalletDisconnected);
    sdk.on('paymentStatusChange', handlePaymentStatusChange);

    return () => {
      // Cleanup event listeners
    };
  }, []);

  const handleWalletConnected = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
  };

  const handleWalletDisconnected = () => {
    setWalletConnected(false);
    setWalletAddress(null);
  };

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const handleConnectWallet = async () => {
    try {
      setStatus('connecting');
      await sdk.connectWallet();
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
      onError?.(err);
    }
  };

  const handlePayment = async () => {
    try {
      setStatus('processing');
      setError(null);

      const result = await sdk.processPayment({
        orderId,
        amount,
        description,
        metadata
      });

      if (result.success) {
        setTxHash(result.transactionHash);
        setStatus('success');
        onSuccess?.(result);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
      onError?.(err);
    }
  };

  const themeStyles = getThemeStyles(theme, primaryColor);

  return (
    <div 
      className="bizmall-payment-widget"
      style={{
        width,
        borderRadius,
        ...themeStyles.container
      }}
    >
      {/* Header */}
      <div style={themeStyles.header}>
        <div style={themeStyles.headerContent}>
          <div style={themeStyles.logo}>₿</div>
          <div>
            <h3 style={themeStyles.title}>Pay with TON</h3>
            <p style={themeStyles.subtitle}>Secure blockchain payment</p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div style={themeStyles.content}>
        <div style={themeStyles.amountSection}>
          <div style={themeStyles.amountLabel}>Amount</div>
          <div style={themeStyles.amountValue}>
            {formatTonAmount(amount)} TON
          </div>
          {description && (
            <div style={themeStyles.description}>{description}</div>
          )}
        </div>

        {/* Wallet Section */}
        {!walletConnected ? (
          <button
            onClick={handleConnectWallet}
            disabled={status === 'connecting'}
            style={{
              ...themeStyles.button,
              ...themeStyles.primaryButton
            }}
          >
            {status === 'connecting' ? 'Connecting...' : 'Connect TON Wallet'}
          </button>
        ) : (
          <div style={themeStyles.walletSection}>
            <div style={themeStyles.walletInfo}>
              <div style={themeStyles.walletLabel}>Connected Wallet</div>
              <div style={themeStyles.walletAddress}>
                {formatAddress(walletAddress)}
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={status === 'processing'}
              style={{
                ...themeStyles.button,
                ...themeStyles.primaryButton
              }}
            >
              {status === 'processing' 
                ? 'Processing...' 
                : `Pay ${formatTonAmount(amount)} TON`
              }
            </button>
          </div>
        )}

        {/* Status Messages */}
        {status === 'success' && (
          <div style={themeStyles.successMessage}>
            <div style={themeStyles.successIcon}>✓</div>
            <div>
              <div style={themeStyles.successTitle}>Payment Successful!</div>
              {txHash && (
                <div style={themeStyles.txHash}>
                  TX: {formatAddress(txHash)}
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'error' && error && (
          <div style={themeStyles.errorMessage}>
            <div style={themeStyles.errorIcon}>✗</div>
            <div>
              <div style={themeStyles.errorTitle}>Payment Failed</div>
              <div style={themeStyles.errorText}>{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={themeStyles.footer}>
        <div style={themeStyles.footerText}>
          🔒 Secured by BizMall Payment Gateway
        </div>
      </div>
    </div>
  );
};

// Theme styling function
const getThemeStyles = (theme: string, primaryColor: string) => {
  const baseColors = {
    light: {
      background: '#ffffff',
      text: '#1a1a1a',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      backgroundSecondary: '#f9fafb'
    },
    dark: {
      background: '#1f2937',
      text: '#ffffff',
      textSecondary: '#9ca3af',
      border: '#374151',
      backgroundSecondary: '#111827'
    }
  };

  const colors = baseColors[theme as keyof typeof baseColors] || baseColors.light;

  return {
    container: {
      backgroundColor: colors.background,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    },
    header: {
      padding: '20px',
      borderBottom: `1px solid ${colors.border}`
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logo: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: primaryColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '18px'
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600'
    },
    subtitle: {
      margin: 0,
      fontSize: '14px',
      color: colors.textSecondary
    },
    content: {
      padding: '20px'
    },
    amountSection: {
      textAlign: 'center' as const,
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: '8px'
    },
    amountLabel: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '4px'
    },
    amountValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.text
    },
    description: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginTop: '8px'
    },
    walletSection: {
      marginBottom: '16px'
    },
    walletInfo: {
      padding: '12px',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: '6px',
      marginBottom: '16px'
    },
    walletLabel: {
      fontSize: '12px',
      color: colors.textSecondary,
      marginBottom: '4px'
    },
    walletAddress: {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: colors.text
    },
    button: {
      width: '100%',
      padding: '16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    primaryButton: {
      backgroundColor: primaryColor,
      color: 'white'
    },
    successMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#f0fdf4',
      borderRadius: '8px',
      border: '1px solid #bbf7d0',
      marginTop: '16px'
    },
    successIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#22c55e',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px'
    },
    successTitle: {
      fontWeight: '600',
      color: '#16a34a'
    },
    txHash: {
      fontSize: '12px',
      color: '#65a30d',
      fontFamily: 'monospace'
    },
    errorMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      marginTop: '16px'
    },
    errorIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#ef4444',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px'
    },
    errorTitle: {
      fontWeight: '600',
      color: '#dc2626'
    },
    errorText: {
      fontSize: '12px',
      color: '#b91c1c'
    },
    footer: {
      padding: '16px 20px',
      borderTop: `1px solid ${colors.border}`,
      backgroundColor: colors.backgroundSecondary
    },
    footerText: {
      fontSize: '12px',
      color: colors.textSecondary,
      textAlign: 'center' as const
    }
  };
};