# BizMall TON Payment Gateway

A blockchain-based payment system integrating with the BizMall e-commerce platform, built on the TON blockchain.

## Overview

This project contains three main components:
- **Blockchain**: Smart contracts written in Tact for the TON blockchain
- **Backend**: Node.js API built with Express and TypeScript
- **Frontend**: React UI components for the payment checkout experience

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager
- TON development tools

### Installation

1. Clone the repository
    ```bash
    git clone https://github.com/yourusername/bizmall-ton-payment-gateway.git
    cd bizmall-ton-payment-gateway
    ```

2. Install dependencies
    ```bash
    npm install
    # or with yarn
    yarn install
    ```

3. Setup environment variables
    ```bash
    cp .env.example .env
    # Edit .env file with your configuration
    ```

## Project Structure

```
bizmall-ton-payment-gateway/
├── blockchain/        # TON smart contracts written in Tact
│   ├── contracts/     # Contract source code (Tact files)
│   ├── build/         # Compiled contracts
│   ├── tests/         # Contract test files
│   ├── scripts/       # Deployment scripts
│   └── wrappers/      # Contract wrapper classes
├── server/            # Express API server
│   ├── src/           # TypeScript source files
│   ├── dist/          # Compiled JavaScript
│   └── tests/         # Backend tests
├── client/            # React payment UI components
│   ├── src/           # React source code
│   ├── public/        # Static assets
│   └── build/         # Production build
├── docs/              # Documentation
│   └── deployment.md  # Deployment guide
└── .env.example       # Example environment variables
```


## Development

### Blockchain

```bash
cd contracts
npm run build   # Compile smart contracts
npm run test    # Run contract tests
npm run deploy  # Deploy to testnet
```

### Backend

```bash
cd server
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

### Frontend

```bash
cd client
npm run dev     # Start development server
npm run build   # Build for production
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
# Run blockchain tests
cd contracts
npm test

# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
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