import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType, 
    ABIGetter, 
    ABIReceiver, 
    TupleBuilder, 
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export type Order = {
    $$type: 'Order';
    amount: bigint;
    buyer: Address;
    sellerType: bigint;
    sellerWallet: Address;
    status: bigint;
    timestamp: bigint;
}

export type ProcessPayment = {
    $$type: 'ProcessPayment';
    orderId: bigint;
    sellerType: bigint;
    sellerWallet: Address;
}

export function storeProcessPayment(src: ProcessPayment) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1684571233, 32);
        b_0.storeUint(src.orderId, 32);
        b_0.storeUint(src.sellerType, 8);
        b_0.storeAddress(src.sellerWallet);
    };
}

export type ConfirmOrder = {
    $$type: 'ConfirmOrder';
    orderId: bigint;
}

export function storeConfirmOrder(src: ConfirmOrder) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2389423884, 32);
        b_0.storeUint(src.orderId, 32);
    };
}

export type ProcessRefund = {
    $$type: 'ProcessRefund';
    orderId: bigint;
}

export function storeProcessRefund(src: ProcessRefund) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1957094775, 32);
        b_0.storeUint(src.orderId, 32);
    };
}

export type UpdateAdmin = {
    $$type: 'UpdateAdmin';
    newAdmin: Address;
}

export function storeUpdateAdmin(src: UpdateAdmin) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(367635210, 32);
        b_0.storeAddress(src.newAdmin);
    };
}

export type UpdateMinThreshold = {
    $$type: 'UpdateMinThreshold';
    newThreshold: bigint;
}

export function storeUpdateMinThreshold(src: UpdateMinThreshold) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2132481761, 32);
        b_0.storeUint(src.newThreshold, 64);
    };
}

 function initPaymentGateway_init_args(src: { $$type: 'PaymentGateway_init_args', admin: Address }) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.admin);
    };
}

async function PaymentGateway_init(admin: Address) {
    const __code = Cell.fromBase64(`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`);
    // Create a builder with the initialization arguments
    const dataBuilder = beginCell();
    dataBuilder.storeAddress(admin);
    dataBuilder.storeInt(1000000, 257); // minThreshold as int257
    dataBuilder.storeDict(Dictionary.empty()); // orders
    dataBuilder.storeInt(0, 257); // nextOrderId as int257
    const __data = dataBuilder.endCell();
    
    return { code: __code, data: __data };
}

const PaymentGateway_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
}

const PaymentGateway_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Order","header":null,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}},{"name":"sellerType","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"sellerWallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"status","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"timestamp","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"PaymentReceived","header":null,"fields":[{"name":"orderId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}},{"name":"sellerWallet","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"OrderConfirmed","header":null,"fields":[{"name":"orderId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"OrderRefunded","header":null,"fields":[{"name":"orderId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ProcessPayment","header":1684571233,"fields":[{"name":"orderId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"sellerType","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"sellerWallet","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ConfirmOrder","header":2389423884,"fields":[{"name":"orderId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ProcessRefund","header":1957094775,"fields":[{"name":"orderId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"UpdateAdmin","header":367635210,"fields":[{"name":"newAdmin","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"UpdateMinThreshold","header":2132481761,"fields":[{"name":"newThreshold","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const PaymentGateway_getters: ABIGetter[] = [
    {"name":"getOrder","arguments":[{"name":"orderId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"Order","optional":true}},
    {"name":"getAdmin","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getMinThreshold","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"getNextOrderId","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

const PaymentGateway_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"ProcessPayment"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ConfirmOrder"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ProcessRefund"}},
    {"receiver":"internal","message":{"kind":"typed","type":"UpdateAdmin"}},
    {"receiver":"internal","message":{"kind":"typed","type":"UpdateMinThreshold"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
    {"receiver":"internal","message":{"kind":"empty"}},
]

export class PaymentGateway implements Contract {
    
    static async init(admin: Address) {
        return await PaymentGateway_init(admin);
    }
    
    static async fromInit(admin: Address, code: Cell) {
        const data = beginCell()
            .storeAddress(admin)
            .storeInt(1000000, 257)
            .storeDict(Dictionary.empty())
            .storeInt(0, 257)
            .endCell();
        const init = { code, data };
        const address = contractAddress(0, init);
        return new PaymentGateway(address, init);
    }
    
    static fromAddress(address: Address) {
        return new PaymentGateway(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types: PaymentGateway_types,
        getters: PaymentGateway_getters,
        receivers: PaymentGateway_receivers,
        errors: PaymentGateway_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: 1,
            body: null,
        });
    }
    
    async sendProcessPayment(provider: ContractProvider, via: Sender, opts: {
        orderId: number;
        sellerType: number;
        sellerWallet: Address;
    }, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: 1,
            body: beginCell()
                .store(storeProcessPayment({
                    $$type: 'ProcessPayment',
                    orderId: BigInt(opts.orderId),
                    sellerType: BigInt(opts.sellerType),
                    sellerWallet: opts.sellerWallet,
                }))
                .endCell(),
        });
    }
    
    async sendConfirmOrder(provider: ContractProvider, via: Sender, orderId: number) {
        await provider.internal(via, {
            value: "0.05",
            sendMode: 1,
            body: null,
        });
    }
    
    async sendProcessRefund(provider: ContractProvider, via: Sender, orderId: number) {
        await provider.internal(via, {
            value: "0.05",
            sendMode: 1,
            body: null,
        });
    }
    
    async sendUpdateAdmin(provider: ContractProvider, via: Sender, newAdmin: Address) {
        await provider.internal(via, {
            value: "0.05",
            sendMode: 1,
            body: null,
        });
    }
    
    async sendUpdateMinThreshold(provider: ContractProvider, via: Sender, newThreshold: bigint) {
        await provider.internal(via, {
            value: "0.05",
            sendMode: 1,
            body: null,
        });
    }
    
    async getGetOrder(provider: ContractProvider, orderId: number): Promise<Order | null> {
        let builder = new TupleBuilder();
        builder.writeNumber(BigInt(orderId));
        let source = (await provider.get('getOrder', builder.build())).stack;
        const result = source.readCellOpt();
        if (result === null) { return null; }
        return loadOrder(result.asSlice());
    }
    
    async getGetAdmin(provider: ContractProvider): Promise<Address> {
        let builder = new TupleBuilder();
        let source = (await provider.get('getAdmin', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getGetMinThreshold(provider: ContractProvider): Promise<bigint> {
        let builder = new TupleBuilder();
        let source = (await provider.get('getMinThreshold', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getGetNextOrderId(provider: ContractProvider): Promise<bigint> {
        let builder = new TupleBuilder();
        let source = (await provider.get('getNextOrderId', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    static createFromConfig(config: { admin: Address }, code: Cell, workchain = 0) {
        const data = beginCell()
            .storeAddress(config.admin)
            .storeInt(1000000, 257) // minThreshold as int257
            .storeDict(Dictionary.empty()) // orders
            .storeInt(0, 257) // nextOrderId as int257
            .endCell();
        const init = { code, data };
        return new PaymentGateway(contractAddress(workchain, init), init);
    }
}

function loadOrder(slice: Slice): Order {
    let sc_0 = slice;
    let _amount = sc_0.loadIntBig(257);
    let _buyer = sc_0.loadAddress();
    let _sellerType = sc_0.loadIntBig(257);
    let _sellerWallet = sc_0.loadAddress();
    let _status = sc_0.loadIntBig(257);
    let _timestamp = sc_0.loadIntBig(257);
    return { 
        $$type: 'Order' as const, 
        amount: _amount, 
        buyer: _buyer, 
        sellerType: _sellerType, 
        sellerWallet: _sellerWallet, 
        status: _status, 
        timestamp: _timestamp 
    };
}