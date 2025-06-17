import { PaymentProcessor } from './PaymentProcessor';
import { TonWalletManager } from './TonWalletManager';
import { ApiClient } from './ApiClient';
import { PaymentWidget } from '../components/PaymentWidget';
import { PaymentModal } from '../components/PaymentModal';
import { PaymentButton } from '../components/PaymentButton';
import { SDKConfig, PaymentOptions, PaymentResult } from '../types/sdk.types';

export class BizmallSDK {
  private config: SDKConfig;
  private apiClient: ApiClient;
  private walletManager: TonWalletManager;
  private paymentProcessor: PaymentProcessor;
  private initialized: boolean = false;

  constructor(config: SDKConfig) {
    this.config = this.validateConfig(config);
    this.apiClient = new ApiClient(this.config);
    this.walletManager = new TonWalletManager(this.config);
    this.paymentProcessor = new PaymentProcessor(
      this.apiClient,
      this.walletManager,
      this.config
    );
  }

  /**
   * Initialize the SDK
   */
  async init(): Promise<void> {
    try {
      await this.walletManager.init();
      await this.apiClient.validateMerchant();
      this.initialized = true;
      console.log('BizmallSDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize BizmallSDK:', error);
      throw error;
    }
  }

  /**
   * Create and render a payment widget
   */
  renderWidget(containerId: string, options: PaymentOptions): void {
    this.ensureInitialized();
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with ID '${containerId}' not found`);
    }

    // Clear existing content
    container.innerHTML = '';

    // Create widget with React or vanilla JS
    const widget = new PaymentWidget({
      ...options,
      sdk: this,
      container: container
    });

    widget.render();
  }

  /**
   * Create a payment modal
   */
  openModal(options: PaymentOptions): Promise<PaymentResult> {
    this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const modal = new PaymentModal({
        ...options,
        sdk: this,
        onSuccess: resolve,
        onError: reject,
        onCancel: () => reject(new Error('Payment cancelled'))
      });

      modal.open();
    });
  }

  /**
   * Create a simple payment button
   */
  createButton(options: PaymentOptions): HTMLElement {
    this.ensureInitialized();
    const button = new PaymentButton({
      ...options,
      sdk: this
    });

    return button.render();
  }

  /**
   * Process payment programmatically
   */
  async processPayment(options: PaymentOptions): Promise<PaymentResult> {
    this.ensureInitialized();
    return await this.paymentProcessor.process(options);
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string): Promise<any> {
    this.ensureInitialized();
    return await this.apiClient.getPaymentStatus(orderId);
  }

  /**
   * Connect wallet
   */
  async connectWallet(): Promise<void> {
    return await this.walletManager.connect();
  }

  /**
   * Get wallet connection status
   */
  isWalletConnected(): boolean {
    return this.walletManager.isConnected();
  }

  /**
   * Get connected wallet address
   */
  getWalletAddress(): string | null {
    return this.walletManager.getAddress();
  }

  /**
   * Event listeners
   */
  on(event: string, callback: Function): void {
    // Implement event system for payment status updates
  }

  private validateConfig(config: SDKConfig): SDKConfig {
    if (!config.merchantId) {
      throw new Error('merchantId is required');
    }
    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }
    
    return {
      environment: 'sandbox',
      theme: 'light',
      currency: 'TON',
      ...config
    };
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('SDK not initialized. Call init() first.');
    }
  }
}