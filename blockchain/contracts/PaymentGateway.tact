import "@stdlib/deploy";

// Data structures for order management
struct Order {
    amount: Int;
    buyer: Address;
    sellerType: Int; // 0 for merchant, 1 for admin
    sellerWallet: Address;
    status: Int; // 0: pending, 1: confirmed, 2: refunded
    timestamp: Int;
}

// Message types for contract interaction
message PaymentReceived {
    orderId: Int;
    amount: Int;
    buyer: Address;
    sellerWallet: Address;
}

message OrderConfirmed {
    orderId: Int;
}

message OrderRefunded {
    orderId: Int;
}

// Remove the struct event types - use messages instead

message ProcessPayment {
    orderId: Int;
    sellerType: Int;
    sellerWallet: Address;
}

message ConfirmOrder {
    orderId: Int;
}

message ProcessRefund {
    orderId: Int;
}

message UpdateAdmin {
    newAdmin: Address;
}

message UpdateMinThreshold {
    newThreshold: Int;
}

// Main contract implementation with upgradeability
contract PaymentGateway with Deployable {
    adminWallet: Address;
    minThreshold: Int;
    orders: map<Int, Order>;
    nextOrderId: Int;
    
    // Initialize with admin wallet and minimum payment threshold
    init(admin: Address) {
        self.adminWallet = admin;
        self.minThreshold = 1000000; // 1,000,000 nanotons default
        self.nextOrderId = 0;
    }
    
    // Receive TON payment and process order
    receive(msg: ProcessPayment) {
        // Ensure payment meets minimum threshold
        require(context().value >= self.minThreshold, "Insufficient payment amount");
        
        // Ensure order doesn't already exist
        require(self.orders.get(msg.orderId) == null, "Order ID already exists");
        
        // Validate seller wallet
        require(msg.sellerWallet.toString() != "0:0000000000000000000000000000000000000000000000000000000000000000", "Invalid seller wallet address");
        
        // Validate seller type
        require(msg.sellerType == 0 || msg.sellerType == 1, "Invalid seller type");
        
        // Determine destination based on seller type
        let destination: Address = msg.sellerType == 0 ? msg.sellerWallet : self.adminWallet;
        
        // Create new order record
        let order: Order = Order{
            amount: context().value,
            buyer: context().sender,
            sellerType: msg.sellerType,
            sellerWallet: msg.sellerWallet,
            status: 0, // pending
            timestamp: now()
        };
        
        // Store the order
        self.orders.set(msg.orderId, order);
        
        // Send 95% of the payment to the destination, keeping 5% for gas and contract operations
        let sendAmount: Int = (context().value * 95) / 100;
        send(SendParameters{
            to: destination,
            value: sendAmount,
            mode: SendIgnoreErrors
        });
        
        // Emit payment received event
        emit(PaymentReceived{
            orderId: msg.orderId,
            amount: context().value,
            buyer: context().sender,
            sellerWallet: destination
        }.toCell());
        
        // Increment order ID for next transaction
        self.nextOrderId += 1;
    }
    
    // Confirm order - can only be called by the seller
    receive(msg: ConfirmOrder) {
        // Retrieve order
        let order: Order? = self.orders.get(msg.orderId);
        require(order != null, "Order not found");
        
        // Determine authorized confirmer
        let authorizedWallet: Address = order!!.sellerType == 0 ? 
                                        order!!.sellerWallet : 
                                        self.adminWallet;
        
        // Ensure sender is authorized
        require(context().sender == authorizedWallet, "Not authorized to confirm this order");
        
        // Update order status to confirmed
        let updatedOrder: Order = Order{
            amount: order!!.amount,
            buyer: order!!.buyer,
            sellerType: order!!.sellerType,
            sellerWallet: order!!.sellerWallet,
            status: 1, // confirmed
            timestamp: order!!.timestamp
        };
        
        self.orders.set(msg.orderId, updatedOrder);
        
        // Emit order confirmed event
        emit(OrderConfirmed{
            orderId: msg.orderId
        }.toCell());
    }
    
    // Process refund - can only be called by the seller within 24 hours
    receive(msg: ProcessRefund) {
        // Retrieve order
        let order: Order? = self.orders.get(msg.orderId);
        require(order != null, "Order not found");
        
        // Determine authorized refunder
        let authorizedWallet: Address = order!!.sellerType == 0 ? 
                                        order!!.sellerWallet : 
                                        self.adminWallet;
        
        // Ensure sender is authorized
        require(context().sender == authorizedWallet, "Not authorized to refund this order");
        
        // Ensure order is not already refunded
        require(order!!.status != 2, "Order already refunded");
        
        // Ensure refund is within 24-hour window
        let twentyFourHours: Int = 86400; // 24 hours in seconds
        require(now() - order!!.timestamp <= twentyFourHours, "Refund window expired");
        
        // Update order status to refunded
        let updatedOrder: Order = Order{
            amount: order!!.amount,
            buyer: order!!.buyer,
            sellerType: order!!.sellerType,
            sellerWallet: order!!.sellerWallet,
            status: 2, // refunded
            timestamp: order!!.timestamp
        };
        
        self.orders.set(msg.orderId, updatedOrder);
        
        // Send refund to buyer
        // Reserve some TON for gas
        let refundAmount: Int = min(myBalance() - ton("0.05"), order!!.amount);
        
        send(SendParameters{
            to: order!!.buyer,
            value: refundAmount,
            mode: SendIgnoreErrors
        });
        
        // Emit order refunded event
        emit(OrderRefunded{
            orderId: msg.orderId
        }.toCell());
    }
    
    // Admin-only function to update admin wallet (upgradeability pattern)
    receive(msg: UpdateAdmin) {
        require(context().sender == self.adminWallet, "Not authorized");
        self.adminWallet = msg.newAdmin;
    }
    
    // Admin-only function to update minimum threshold
    receive(msg: UpdateMinThreshold) {
        require(context().sender == self.adminWallet, "Not authorized");
        self.minThreshold = msg.newThreshold;
    }
    
    // Get order details - public getter
    get fun getOrder(orderId: Int): Order? {
        return self.orders.get(orderId);
    }
    
    // Get admin wallet - public getter
    get fun getAdmin(): Address {
        return self.adminWallet;
    }
    
    // Get minimum threshold - public getter
    get fun getMinThreshold(): Int {
        return self.minThreshold;
    }
    
    // Get next order ID - public getter
    get fun getNextOrderId(): Int {
        return self.nextOrderId;
    }
    
    // Handle fallback payments
    receive() {
        // Simple fallback for direct TON transfers
        // This acts as a deposit without creating an order
        // The funds stay in the contract
    }
}
