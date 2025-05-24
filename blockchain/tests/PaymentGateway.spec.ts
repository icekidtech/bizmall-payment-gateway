import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { PaymentGateway } from '../build/PaymentGateway/PaymentGateway_PaymentGateway';
import '@ton/test-utils';

describe('PaymentGateway', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let paymentGateway: SandboxContract<PaymentGateway>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        paymentGateway = blockchain.openContract(await PaymentGateway.fromInit());

        deployer = await blockchain.treasury('deployer');

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
});
