require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

// Make sure you have these environment variables in your .env file
// SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
// PRIVATE_KEY=your-metamask-private-key
// ETHERSCAN_API_KEY=your-etherscan-api-key

module.exports = {
  solidity: "0.8.28",
  gasReporter: {
    enabled: true, // Enable gas reporting
    currency: "USD", // Optional: Convert gas to a specific currency
    gasPrice: 20 // Optional: Gas price in Gwei
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
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