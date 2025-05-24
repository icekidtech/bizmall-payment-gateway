# BizMall TON Payment Gateway

A blockchain-based payment system integrating with the BizMall e-commerce platform, built on the TON blockchain.

## Overview

This monorepo contains three main components:
- **Blockchain**: Smart contracts written in Tact for the TON blockchain
- **Backend**: Node.js API built with Express and TypeScript
- **Frontend**: React UI components for the payment checkout experience

## Getting Started

### Prerequisites
- Node.js v16 or higher
- pnpm v7 or higher
- TON development tools

### Installation

1. Clone the repository
    ```bash
    git clone https://github.com/yourusername/bizmall-ton-payment-gateway.git
    cd bizmall-ton-payment-gateway
    ```

2. Install dependencies
    ```bash
    pnpm install
    ```

3. Setup environment variables
    ```bash
    cp .env.example .env
    # Edit .env file with your configuration
    ```

## Project Structure

```
├── packages/
│   ├── blockchain/    # TON smart contracts
│   ├── backend/       # Express API server
│   └── frontend/      # React payment components
├── docs/              # Documentation
└── scripts/           # Utility scripts
```

## Development

### Blockchain

```bash
cd packages/blockchain
pnpm build   # Compile smart contracts
pnpm test    # Run contract tests
pnpm deploy  # Deploy to testnet
```

### Backend

```bash
cd packages/backend
pnpm dev     # Start development server
pnpm build   # Build for production
pnpm start   # Start production server
```

### Frontend

```bash
cd packages/frontend
pnpm dev     # Start development server
pnpm build   # Build for production
```

## Configuration

The payment gateway requires the following environment variables:

```
# TON Configuration
TON_ENDPOINT=https://toncenter.com/api/v2/jsonRPC
TON_API_KEY=your_api_key

# Backend Configuration
PORT=3000
MONGO_URI=mongodb://localhost:27017/bizmall

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3000/api
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter=@bizmall/blockchain test
pnpm --filter=@bizmall/backend test
pnpm --filter=@bizmall/frontend test
```

## Deployment

Refer to the [deployment guide](./docs/deployment.md) for detailed instructions on deploying to production.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the team at support@bizmall.io