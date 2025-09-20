# Ethereum Staking dApp

[![Hardhat](https://hardhat.org/hardhat-logo.svg)](https://hardhat.org/)

This project is a decentralized application (dApp) for staking Ethereum, built with Hardhat, Ethers.js, and a React frontend. It features a complete development environment for compiling, testing, deploying, and interacting with smart contracts, all configured to use TypeScript and modern ES Modules.

## Features

- **Smart Contracts**: Solidity contracts for staking (`StakingContract.sol`) and its security-improved versions.
- **Hardhat 3**: Utilizes the latest Hardhat version with full TypeScript and ESM support.
- **Deployment Scripts**: Robust deployment scripts (`scripts/deploy.ts`) that save artifacts and prevent accidental redeploys.
- **Hardhat Ignition**: Includes Ignition modules (`ignition/modules/`) for automated, resilient deployments.
- **Interaction Scripts**: Example script (`scripts/interact.ts`) to test contract functions on a live network.
- **React Frontend**: A simple frontend in the `staking-frontend/` directory to interact with the deployed contract.
- **Testing**: Comprehensive tests for smart contracts.

## Project Structure

```
staking_dapp/
├── contracts/         # Solidity smart contracts
├── deployments/       # Deployment artifacts (JSON files with contract addresses)
├── ignition/          # Hardhat Ignition modules for deployment
├── node_modules/      # Project dependencies
├── scripts/           # Deployment and interaction scripts (.ts)
├── staking-frontend/  # React frontend application
├── test/              # Contract tests
├── .env_local         # Environment variables (private keys, RPC URLs)
├── hardhat.config.ts  # Hardhat configuration file
└── package.json       # Project configuration and scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Getting Started

### 1. Clone the Repository

```sh
git clone <YOUR_REPOSITORY_URL>
cd staking_dapp
```

### 2. Install Dependencies

Install the dependencies for both the root project and the frontend.

```sh
# Install root dependencies
npm install

# Install frontend dependencies
cd staking-frontend
npm install
cd ..
```

### 3. Set Up Environment Variables

Create a `.env_local` file in the root of the project by copying the example:

```sh
cp .env_local.example .env_local
```

Now, fill in the required variables in `.env_local`:

```env
# RPC URL for the Amoy testnet (e.g., from Alchemy or Infura)
AMOY_RPC_URL="https://rpc-amoy.polygon.technology/"

# Your private key for deploying to public networks (NEVER commit this)
PRIVATE_KEY="your-wallet-private-key"

# (Optional) PolygonScan API key for contract verification
POLYGONSCAN_API_KEY="your-polygonscan-api-key"

# (Optional) Local RPC URL if not using the default
LOCAL_RPC_URL="http://127.0.0.1:8545"
```

## Available Scripts

All commands should be run from the root directory of the project.

### Run a Local Hardhat Node

This starts a local blockchain for development and testing.

```sh
npm run node
```

### Compile Contracts

This compiles your Solidity smart contracts.

```sh
npm run compile
```

### Deploy Contracts

You have two methods for deployment: using a standard script or Hardhat Ignition.

**Method 1: Standard Deployment Script (Recommended for Development)**

This script deploys the `StakingContract` and saves its address to the `deployments/` directory.

```sh
# Deploy to the local Hardhat network
npm run deploy:local

# Deploy to the Amoy testnet
npm run deploy:amoy
```

**Method 2: Hardhat Ignition**

Ignition provides a more robust, resumable deployment system, ideal for complex or critical deployments.

```sh
# Deploy to the local Hardhat network
npm run deploy:ignition:local

# Deploy to the Amoy testnet
npm run deploy:ignition:amoy
```

### Interact with the Deployed Contract

This script reads the contract address from the `deployments/` directory and sends a staking transaction.

```sh
# Interact on the local network
npm run interact:local

# Interact on the Amoy testnet
npm run interact:amoy
```

### Run Tests

Execute the automated tests for the smart contracts.

```sh
npm run test
```

## Frontend Integration

The React frontend needs the deployed contract's address to interact with it.

1.  **Deploy the Contract**: Run `npm run deploy:local` or `npm run deploy:amoy`. The console output will display the deployed contract address.

2.  **Update Frontend Environment**: The frontend uses Vite, which reads environment variables from a `.env` file. Create a `.env` file inside the `staking-frontend/` directory:

    ```sh
    cd staking-frontend
    touch .env
    ```

3.  **Add the Contract Address**: Add the deployed contract address to `staking-frontend/.env`:

    ```env
    VITE_CONTRACT_ADDRESS="0x...your...deployed...contract...address"
    ```

4.  **Run the Frontend**: Start the React development server.

    ```sh
    cd staking-frontend
    npm start
    ```

    Open your browser to `http://localhost:3000` to see the dApp.

## Security Analysis

This project includes support for [Slither](https://github.com/crytic/slither), a static analysis tool for Solidity.

### Installation

```sh
pip install slither-analyzer
```

### Run Analysis

Run the following command from the project root to analyze the contracts for vulnerabilities.

```sh
slither .