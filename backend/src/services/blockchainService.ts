import { TonClient, Address, Cell, BOC, Slice } from '@ton/ton'; // Or other TON SDK like tonweb
import { getHttpEndpoint } from '@orbs-network/ton-access'; // For public endpoints
import { toNano } from '@ton/core'; // For amount conversion

interface VerificationParams {
    transactionHash: string;
    expectedDestination: string;
    expectedInternalDestination: string; // BizMall's wallet
    expectedAmount: string | number; // Amount in TON, will be converted to nanotons
    expectedCommentOrderId?: string; // If orderId is in the comment
    tonApiEndpoint: string;
    tonApiKey?: string;
}

interface VerificationResult {
    isValid: boolean;
    error?: string;
    data?: any;
}

// Helper to parse comment for orderId (very basic example)
// Your contract might store orderId more formally in the message body.
const parseCommentForOrderId = (commentCell?: Cell): string | null => {
    if (!commentCell) return null;
    try {
        const slice = Slice.fromCell(commentCell);
        if (slice.remainingBits >= 32 && slice.loadUint(32) === 0) { // Skip text comment prefix 0x00000000
             // This is a simplistic assumption. If ProcessPayment message is used,
             // you'd parse the cell according to storeProcessPayment structure.
             // For example, if orderId is a Uint64 after an op-code:
             // slice.loadUint(32); // op-code
             // return slice.loadUintBig(64).toString();
            return slice.loadStringTail(); // Simplistic: assumes orderId is the rest of the string
        }
        return slice.loadStringTail();
    } catch (e) {
        console.warn('Could not parse comment for Order ID:', e);
        return null;
    }
};


export const verifyTonTransaction = async (params: VerificationParams): Promise<VerificationResult> => {
    try {
        // Initialize TON Client
        // const endpoint = await getHttpEndpoint({ network: process.env.TON_NETWORK === 'mainnet' ? 'mainnet' : 'testnet' }); // Or use params.tonApiEndpoint
        const client = new TonClient({
            endpoint: params.tonApiEndpoint,
            apiKey: params.tonApiKey,
        });

        const txHashBuffer = Buffer.from(params.transactionHash, 'hex'); // Or 'base64' depending on format from frontend
        const transactions = await client.getTransactions(Address.parse(params.expectedDestination), {
            hash: txHashBuffer,
            limit: 1, // We expect only one transaction for this hash on this account
        });

        if (!transactions || transactions.length === 0) {
            return { isValid: false, error: 'Transaction not found on the PaymentGateway contract.' };
        }

        const tx = transactions[0];

        // 1. Check if the transaction was successful on-chain
        if (!tx.description || tx.description.type !== 'generic' || !tx.description.computePhase || tx.description.computePhase.type !== 'vm' || tx.description.computePhase.exitCode !== 0) {
             return { isValid: false, error: `Transaction compute phase failed or was not successful. Exit code: ${tx.description?.type === 'generic' && tx.description.computePhase?.type === 'vm' ? tx.description.computePhase.exitCode : 'N/A'}` };
        }

        // 2. Check incoming message details (User -> PaymentGatewayContract)
        const inMsg = tx.inMessage;
        if (!inMsg) {
            return { isValid: false, error: 'Incoming message not found in transaction.' };
        }
        if (inMsg.info.type !== 'internal') {
            return { isValid: false, error: 'Incoming message is not an internal message.' };
        }
        if (!inMsg.info.dest.equals(Address.parse(params.expectedDestination))) {
            return { isValid: false, error: `Transaction destination mismatch. Expected ${params.expectedDestination}, got ${inMsg.info.dest.toString()}` };
        }

        const expectedAmountNano = toNano(params.expectedAmount.toString());
        if (inMsg.info.value.coins !== expectedAmountNano) {
            return { isValid: false, error: `Amount mismatch. Expected ${expectedAmountNano} nanotons, got ${inMsg.info.value.coins} nanotons` };
        }

        // 3. (Optional but recommended) Check comment/payload for orderId
        // This depends on how your frontend/contract includes the orderId.
        // If the ProcessPayment message is sent, its body will be inMsg.body
        // You'd deserialize it according to your storeProcessPayment logic.
        if (params.expectedCommentOrderId) {
            const messageBodyCell = Cell.fromBoc(inMsg.body)[0]; // Assuming body is a single root cell
            const slice = messageBodyCell.beginParse();
            const opCode = slice.loadUint(32); // Assuming op-code for ProcessPayment
            const receivedOrderId = slice.loadUintBig(64).toString(); // Assuming orderId is Uint64

            // Example op-code for ProcessPayment from your wrapper: 1684571233
            const PROCESS_PAYMENT_OP_CODE = 1684571233;
            if (opCode !== PROCESS_PAYMENT_OP_CODE) {
                 return { isValid: false, error: `Incorrect message op-code. Expected ${PROCESS_PAYMENT_OP_CODE} for ProcessPayment.` };
            }

            if (receivedOrderId !== params.expectedCommentOrderId) {
                return { isValid: false, error: `Order ID in transaction body mismatch. Expected ${params.expectedCommentOrderId}, got ${receivedOrderId}` };
            }
        }


        // 4. Check outgoing messages for forwarding to BizMall's wallet
        let fundsForwardedToBizmall = false;
        for (const outMsg of tx.outMessages) {
            if (outMsg.info.type === 'internal' && outMsg.info.dest.equals(Address.parse(params.expectedInternalDestination))) {
                // Check if the amount forwarded is correct (it might be slightly less due to contract's gas for forwarding)
                // For simplicity, we check if it's greater than some significant portion of the original amount.
                // A more precise check would be `expectedAmountNano - estimated_forwarding_gas_cost`.
                if (outMsg.info.value.coins >= (expectedAmountNano - toNano('0.05'))) { // Allowing for up to 0.05 TON for gas
                    fundsForwardedToBizmall = true;
                    break;
                } else {
                     return { isValid: false, error: `Funds forwarded to BizMall wallet, but amount is too low. Expected ~${expectedAmountNano}, got ${outMsg.info.value.coins}` };
                }
            }
        }

        if (!fundsForwardedToBizmall) {
            return { isValid: false, error: "Transaction did not forward funds to BizMall's central wallet or amount was incorrect." };
        }

        return { isValid: true, data: tx };

    } catch (error: any) {
        console.error('Error verifying TON transaction:', error);
        return { isValid: false, error: error.message || 'Blockchain verification failed' };
    }
};