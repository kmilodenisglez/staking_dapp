require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");

require("dotenv").config();

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
    }
  }
};
