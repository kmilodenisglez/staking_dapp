# Developer Guide for Ethereum Staking dApp

## Active Ethereum Test Networks

### Sepolia (Most recommended)
- ChainID: 11155111 (0xaa36a7 in hex)
- Currently the most recommended testnet by Ethereum developers
- More stable and less spam than other networks

### Holesky (Newest)
- ChainID: 17000 (0x4268 in hex)
- Launched in September 2023
- Designed to replace Goerli

## Getting Test ETH

### Sepolia:
- Faucet: https://sepoliafaucet.com/
- Other Faucet: https://www.ethereumsepoliafaucet.com/
- Other Faucet: https://app.nebulum.one/sepolia_faucet
> You'll need to connect with your Alchemy account

### Holesky:
- Faucet: https://holesky-faucet.pk910.de/
- Paradigm Faucet: https://faucet.paradigm.xyz/

## Deployment Setup

### 1. Environment Configuration
Create a `.env` file in the root directory with the following:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
PRIVATE_KEY=your-metamask-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

### 2. Prerequisites
- Node.js and npm installed
- MetaMask wallet with Sepolia ETH
- Infura or Alchemy API key
- Etherscan API key

### 3. Installation
```bash
npm install
cd staking-frontend
npm install
```

## Deployment Steps

### 1. Configure Hardhat
Make sure your `hardhat.config.js` includes Sepolia network:
```javascript
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### 2. Deploy Contracts to Sepolia

#### Option 1: Using Regular Deployment Script
```bash
# For StakingContract
npx hardhat run scripts/deploy.js --network sepolia

# For Lock Contract
npx hardhat run scripts/deployLock.js --network sepolia
```

#### Option 2: Using Hardhat Ignition
```bash
npx hardhat ignition deploy ./ignition/modules/Staking.js --network sepolia
```

### 3. Update Frontend Configuration
After deployment, update the contract address in your frontend:
1. Navigate to `staking-frontend/src/App.js`
2. Update the `contractAddress` constant with your new deployed address
3. Make sure the ABI is correctly imported

## Important Notes

### Security
- Never commit `.env` file to version control
- Keep private keys secure and never share them
- Use separate development and production wallets
- Regularly rotate API keys

### Best Practices
- Always test contracts locally before deploying to testnet
- Verify contracts on Etherscan after deployment
- Keep track of deployed contract addresses
- Monitor gas prices for optimal deployment timing
- Test all contract interactions after deployment

### Common Issues and Solutions
1. **Insufficient Funds**
   - Ensure wallet has enough Sepolia ETH
   - Use faucets listed above to get test ETH

2. **Failed Contract Verification**
   - Wait for sufficient block confirmations
   - Double-check Etherscan API key
   - Ensure contract source matches deployed bytecode

3. **Network Connection Issues**
   - Verify RPC URL is correct
   - Check Infura/Alchemy quota limits
   - Ensure stable internet connection

### Frontend Integration
1. **MetaMask Connection**
   - Implement proper error handling for network switching
   - Handle wallet connection states
   - Support multiple account switching

2. **Network Management**
   - Add support for network switching
   - Handle cases when user is on wrong network
   - Implement network detection

### Maintenance
- Keep dependencies updated
- Monitor contract performance
- Track gas usage
- Document all deployments and updates

## Useful Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Verify contract on Sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

## Support Resources
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Etherscan API Documentation](https://docs.etherscan.io/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [MetaMask Documentation](https://docs.metamask.io/)


## Deployment
### StakingContract
https://sepolia.etherscan.io/address/0x2A5753dB43E806486f9b4915Aa492C597BF4a8e8#code