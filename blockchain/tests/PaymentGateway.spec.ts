import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, Address } from '@ton/core';
import { PaymentGateway } from '../wrappers/PaymentGateway';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('PaymentGateway', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PaymentGateway');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let merchant: SandboxContract<TreasuryContract>;
    let buyer: SandboxContract<TreasuryContract>;
    let paymentGateway: SandboxContract<PaymentGateway>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        admin = await blockchain.treasury('admin');
        merchant = await blockchain.treasury('merchant');
        buyer = await blockchain.treasury('buyer');
        deployer = await blockchain.treasury('deployer');

        paymentGateway = await blockchain.openContract(
            await PaymentGateway.fromInit(admin.address)
        );

        const deployResult = await paymentGateway.sendDeploy(
            deployer.getSender(),
            toNano('0.05')
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: paymentGateway.address,
            deploy: true,
            success: true,
        });
    });

    describe('Contract Initialization', () => {
        it('should deploy with correct admin wallet', async () => {
            const adminWallet = await paymentGateway.getGetAdmin();
            expect(adminWallet.toString()).toBe(admin.address.toString());
        });

        it('should deploy with default minimum threshold', async () => {
            const minThreshold = await paymentGateway.getGetMinThreshold();
            expect(minThreshold).toBe(1000000n); // 1,000,000 nanotons
        });

        it('should deploy with nextOrderId as 0', async () => {
            const nextOrderId = await paymentGateway.getGetNextOrderId();
            expect(nextOrderId).toBe(0n);
        });
    });

    describe('Payment Processing', () => {
        it('should process payment to merchant wallet successfully', async () => {
            const orderId = 1;
            const paymentAmount = toNano('2'); // 2 TON
            const sellerType = 0; // merchant
            
            const result = await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: orderId,
                    sellerType: sellerType,
                    sellerWallet: merchant.address,
                },
                paymentAmount
            );

            expect(result.transactions).toHaveTransaction({
                from: buyer.address,
                to: paymentGateway.address,
                success: true,
            });

            // Check if payment was sent to merchant (95% of payment)
            const expectedAmount = (paymentAmount * 95n) / 100n;
            expect(result.transactions).toHaveTransaction({
                from: paymentGateway.address,
                to: merchant.address,
                value: expectedAmount,
                success: true,
            });

            // Verify order was created
            const order = await paymentGateway.getGetOrder(orderId);
            expect(order).toBeDefined();
            if (order) {
                expect(order.amount).toBe(paymentAmount);
                expect(order.buyer.toString()).toBe(buyer.address.toString());
                expect(order.sellerType).toBe(0);
                expect(order.status).toBe(0); // pending
            }
        });

        it('should process payment to admin wallet for admin seller type', async () => {
            const orderId = 1;
            const paymentAmount = toNano('2');
            const sellerType = 1; // admin
            
            const result = await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: orderId,
                    sellerType: sellerType,
                    sellerWallet: merchant.address, // This should be ignored for admin type
                },
                paymentAmount
            );

            // Check if payment was sent to admin wallet
            const expectedAmount = (paymentAmount * 95n) / 100n;
            expect(result.transactions).toHaveTransaction({
                from: paymentGateway.address,
                to: admin.address,
                value: expectedAmount,
                success: true,
            });
        });

        it('should reject payment below minimum threshold', async () => {
            const orderId = 1;
            const paymentAmount = toNano('0.0005'); // Below 1,000,000 nanotons
            
            const result = await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: orderId,
                    sellerType: 0,
                    sellerWallet: merchant.address,
                },
                paymentAmount
            );

            expect(result.transactions).toHaveTransaction({
                from: buyer.address,
                to: paymentGateway.address,
                success: false,
            });
        });

        it('should reject duplicate order IDs', async () => {
            const orderId = 1;
            const paymentAmount = toNano('2');
            
            // First payment should succeed
            await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: orderId,
                    sellerType: 0,
                    sellerWallet: merchant.address,
                },
                paymentAmount
            );

            // Second payment with same order ID should fail
            const result = await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: orderId,
                    sellerType: 0,
                    sellerWallet: merchant.address,
                },
                paymentAmount
            );

            expect(result.transactions).toHaveTransaction({
                from: buyer.address,
                to: paymentGateway.address,
                success: false,
            });
        });

        it('should reject invalid seller type', async () => {
            const orderId = 1;
            const paymentAmount = toNano('2');
            
            const result = await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: orderId,
                    sellerType: 2, // Invalid seller type
                    sellerWallet: merchant.address,
                },
                paymentAmount
            );

            expect(result.transactions).toHaveTransaction({
                from: buyer.address,
                to: paymentGateway.address,
                success: false,
            });
        });
    });

    describe('Order Confirmation', () => {
        beforeEach(async () => {
            // Create a test order first
            await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: 1,
                    sellerType: 0,
                    sellerWallet: merchant.address,
                },
                toNano('2')
            );
        });

        it('should allow merchant to confirm their order', async () => {
            const result = await paymentGateway.sendConfirmOrder(
                merchant.getSender(),
                1
            );

            expect(result.transactions).toHaveTransaction({
                from: merchant.address,
                to: paymentGateway.address,
                success: true,
            });

            // Verify order status was updated
            const order = await paymentGateway.getGetOrder(1);
            expect(order?.status).toBe(1); // confirmed
        });

        it('should reject confirmation from unauthorized user', async () => {
            const unauthorizedUser = await blockchain.treasury('unauthorized');
            
            const result = await paymentGateway.sendConfirmOrder(
                unauthorizedUser.getSender(),
                1
            );

            expect(result.transactions).toHaveTransaction({
                from: unauthorizedUser.address,
                to: paymentGateway.address,
                success: false,
            });
        });

        it('should allow admin to confirm admin orders', async () => {
            // Create admin order
            await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: 2,
                    sellerType: 1, // admin
                    sellerWallet: merchant.address,
                },
                toNano('2')
            );

            const result = await paymentGateway.sendConfirmOrder(
                admin.getSender(),
                2
            );

            expect(result.transactions).toHaveTransaction({
                from: admin.address,
                to: paymentGateway.address,
                success: true,
            });
        });
    });

    describe('Refund Processing', () => {
        beforeEach(async () => {
            // Create a test order first
            await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: 1,
                    sellerType: 0,
                    sellerWallet: merchant.address,
                },
                toNano('2')
            );
        });

        it('should allow merchant to refund their order', async () => {
            const result = await paymentGateway.sendProcessRefund(
                merchant.getSender(),
                1
            );

            expect(result.transactions).toHaveTransaction({
                from: merchant.address,
                to: paymentGateway.address,
                success: true,
            });

            // Check if refund was sent to buyer
            expect(result.transactions).toHaveTransaction({
                from: paymentGateway.address,
                to: buyer.address,
                success: true,
            });

            // Verify order status was updated
            const order = await paymentGateway.getGetOrder(1);
            expect(order?.status).toBe(2); // refunded
        });

        it('should reject refund from unauthorized user', async () => {
            const unauthorizedUser = await blockchain.treasury('unauthorized');
            
            const result = await paymentGateway.sendProcessRefund(
                unauthorizedUser.getSender(),
                1
            );

            expect(result.transactions).toHaveTransaction({
                from: unauthorizedUser.address,
                to: paymentGateway.address,
                success: false,
            });
        });

        it('should reject refund for already refunded order', async () => {
            // First refund should succeed
            await paymentGateway.sendProcessRefund(
                merchant.getSender(),
                1
            );

            // Second refund should fail
            const result = await paymentGateway.sendProcessRefund(
                merchant.getSender(),
                1
            );

            expect(result.transactions).toHaveTransaction({
                from: merchant.address,
                to: paymentGateway.address,
                success: false,
            });
        });

        it('should reject refund for non-existent order', async () => {
            const result = await paymentGateway.sendProcessRefund(
                merchant.getSender(),
                999 // Non-existent order
            );

            expect(result.transactions).toHaveTransaction({
                from: merchant.address,
                to: paymentGateway.address,
                success: false,
            });
        });
    });

    describe('Admin Functions', () => {
        it('should allow admin to update admin wallet', async () => {
            const newAdmin = await blockchain.treasury('newAdmin');
            
            const result = await paymentGateway.sendUpdateAdmin(
                admin.getSender(),
                newAdmin.address
            );

            expect(result.transactions).toHaveTransaction({
                from: admin.address,
                to: paymentGateway.address,
                success: true,
            });

            // Verify admin wallet was updated
            const updatedAdmin = await paymentGateway.getGetAdmin();
            expect(updatedAdmin.toString()).toBe(newAdmin.address.toString());
        });

        it('should reject admin update from non-admin', async () => {
            const newAdmin = await blockchain.treasury('newAdmin');
            
            const result = await paymentGateway.sendUpdateAdmin(
                merchant.getSender(),
                newAdmin.address
            );

            expect(result.transactions).toHaveTransaction({
                from: merchant.address,
                to: paymentGateway.address,
                success: false,
            });
        });

        it('should allow admin to update minimum threshold', async () => {
            const newThreshold = 2000000n; // 2,000,000 nanotons
            
            const result = await paymentGateway.sendUpdateMinThreshold(
                admin.getSender(),
                newThreshold
            );

            expect(result.transactions).toHaveTransaction({
                from: admin.address,
                to: paymentGateway.address,
                success: true,
            });

            // Verify threshold was updated
            const updatedThreshold = await paymentGateway.getGetMinThreshold();
            expect(updatedThreshold).toBe(newThreshold);
        });

        it('should reject threshold update from non-admin', async () => {
            const newThreshold = 2000000n;
            
            const result = await paymentGateway.sendUpdateMinThreshold(
                merchant.getSender(),
                newThreshold
            );

            expect(result.transactions).toHaveTransaction({
                from: merchant.address,
                to: paymentGateway.address,
                success: false,
            });
        });
    });

    describe('Getter Functions', () => {
        it('should return correct order details', async () => {
            const orderId = 1;
            const paymentAmount = toNano('2');
            
            await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: orderId,
                    sellerType: 0,
                    sellerWallet: merchant.address,
                },
                paymentAmount
            );

            const order = await paymentGateway.getGetOrder(orderId);
            expect(order).toBeDefined();
            if (order) {
                expect(order.amount).toBe(paymentAmount);
                expect(order.buyer.toString()).toBe(buyer.address.toString());
                expect(order.sellerType).toBe(0);
                expect(order.sellerWallet.toString()).toBe(merchant.address.toString());
                expect(order.status).toBe(0);
            }
        });

        it('should return null for non-existent order', async () => {
            const order = await paymentGateway.getGetOrder(999);
            expect(order).toBeNull();
        });

        it('should return correct next order ID', async () => {
            const initialNextOrderId = await paymentGateway.getGetNextOrderId();
            expect(initialNextOrderId).toBe(0n);

            // Process a payment
            await paymentGateway.sendProcessPayment(
                buyer.getSender(),
                {
                    orderId: 1,
                    sellerType: 0,
                    sellerWallet: merchant.address,
                },
                toNano('2')
            );

            const updatedNextOrderId = await paymentGateway.getGetNextOrderId();
            expect(updatedNextOrderId).toBe(1n);
        });
    });

    describe('Fallback Function', () => {
        it('should accept direct TON transfers', async () => {
            const result = await buyer.send({
                to: paymentGateway.address,
                value: toNano('1'),
            });

            expect(result.transactions).toHaveTransaction({
                from: buyer.address,
                to: paymentGateway.address,
                success: true,
            });
        });
    });
});