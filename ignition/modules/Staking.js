const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const StakingModule = buildModule("StakingModule", (m) => {
  // Define the contract to deploy
  const stakingContract = m.contract("StakingContract");

  // Export the deployed contract
  return { stakingContract };
});

module.exports = StakingModule;