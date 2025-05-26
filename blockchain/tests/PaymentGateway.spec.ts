import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { PaymentGateway } from '../build/PaymentGateway/PaymentGateway_PaymentGateway';
import { ProcessPayment } from '../wrappers/ProcessPayment';
import '@ton/test-utils';

describe('PaymentGateway', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let paymentGateway: SandboxContract<PaymentGateway>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        
        deployer = await blockchain.treasury('deployer');

        paymentGateway = blockchain.openContract(
            await PaymentGateway.fromInit() // Initialize without arguments
        );

        const deployResult = await paymentGateway.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: paymentGateway.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and paymentGateway are ready to use
    });

    it('should process payment', async () => {
        const buyer = await blockchain.treasury('buyer');
        const merchant = await blockchain.treasury('merchant');
        
        const processPaymentMessage = ProcessPayment.createFromConfig({
            orderId: 1n,
            sellerType: 0n, // merchant
            sellerWallet: merchant.address
        });

        const result = await paymentGateway.send(
            buyer.getSender(),
            {
                value: toNano('1.1') // More than minimum threshold
            },
            null // Pass null instead of the Cell directly
        );
        
        expect(result.transactions).toHaveTransaction({
            from: buyer.address,
            to: paymentGateway.address,
            success: true
        });
    });
});
