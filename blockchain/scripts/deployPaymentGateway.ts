import { toNano, Address } from '@ton/core';
import { PaymentGateway } from '../build/PaymentGateway/PaymentGateway_PaymentGateway';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const adminAddress = provider.sender().address as Address;
    const paymentGateway = provider.open(await PaymentGateway.fromInit(adminAddress));

    await paymentGateway.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(paymentGateway.address);

    // run methods on `paymentGateway`
}
