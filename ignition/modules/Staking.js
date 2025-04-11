const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const StakingModule = buildModule("StakingModule", (m) => {
  // Define the contract to deploy
  const stakingContract = m.contract("StakingContract");

  // Add verification step for Sepolia
  if (m.network.chainId === 11155111) { // Sepolia chainId
    stakingContract.verify();
  }

  // Export the deployed contract
  return { stakingContract };
});

module.exports = StakingModule;