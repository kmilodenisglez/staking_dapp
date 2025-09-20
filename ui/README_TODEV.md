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

## To update the staking-frontent code (Node.js - reactjs) to work with the **Sepolia test network**

> URL: https://docs.metamask.io/services/tutorials/ethereum/send-a-transaction/send-a-transaction-ethers/

you need to modify the `chainId`, `chainName`, and `rpcUrls` parameters to match the Sepolia network configuration. Here's the updated code:
---

### Updated Code for Sepolia Network
```javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0xaa36a7', // Sepolia chain ID in hexadecimal (11155111 in decimal)
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'], // Replace with your Infura Project ID or another RPC provider
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }]
});
```

---

### Explanation of Changes

1. **`chainId`**:
   - The Sepolia testnet has a chain ID of `11155111` in decimal, which is `0xaa36a7` in hexadecimal.
   - Replace `'0x7A69'` (which corresponds to a local Hardhat network) with `'0xaa36a7'`.

2. **`chainName`**:
   - Change the name from `'Localhost 8545'` to `'Sepolia Test Network'`.

3. **`nativeCurrency`**:
   - The native currency for Sepolia is still ETH, so no changes are needed here.

4. **`rpcUrls`**:
   - Replace the local RPC URL (`http://127.0.0.1:8545`) with an RPC endpoint for the Sepolia network.
   - Use an Infura, Alchemy, or any other RPC provider URL. For example:
      - Infura: `https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID`
      - Alchemy: `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY`
      - Public RPC: `https://rpc.sepolia.org`

5. **`blockExplorerUrls`**:
   - Add the block explorer URL for Sepolia: `https://sepolia.etherscan.io`.

---

### How to Get an RPC URL for Sepolia
If you don't already have an RPC URL for Sepolia, you can use one of the following methods:

#### **1. Using Infura**
- Sign up at [Infura](https://infura.io) and create a new project.
- Use the provided Sepolia RPC URL:
  ```
  https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
  ```

#### **2. Using Alchemy**
- Sign up at [Alchemy](https://www.alchemy.com) and create a new app for Sepolia.
- Use the provided Sepolia RPC URL:
  ```
  https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
  ```

#### **3. Using a Public RPC**
- You can also use a public RPC provider like:
  ```
  https://rpc.sepolia.org
  ```

### Example with Infura
Here’s how the code looks if you’re using Infura as your RPC provider:

```javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0xaa36a7', // Sepolia chain ID in hexadecimal
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'], // Replace with your Infura Project ID
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }]
});
```

### Testing the Code
1. Ensure MetaMask is installed and connected to your website.
2. Run the code in your React.js application or browser console.
3. MetaMask will prompt the user to add the Sepolia network.
4. Once added, MetaMask will switch to the Sepolia network automatically.

### Notes
- **Security**: Do not hardcode sensitive information like your Infura Project ID or Alchemy API Key in your frontend code. Use environment variables to store these securely.
- **Error Handling**: Add error handling to gracefully handle cases where the user rejects the request or the RPC URL is invalid.

---

### Final Answer
Update the `chainId`, `chainName`, `rpcUrls`, and `blockExplorerUrls` to match the Sepolia network configuration. Use the code provided above and replace `YOUR_INFURA_PROJECT_ID` or `YOUR_ALCHEMY_API_KEY` with your actual RPC provider credentials.

## Support Resources
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Etherscan API Documentation](https://docs.etherscan.io/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [MetaMask Documentation](https://docs.metamask.io/)


## Deployment
### StakingContract
https://sepolia.etherscan.io/address/0x2A5753dB43E806486f9b4915Aa492C597BF4a8e8#code