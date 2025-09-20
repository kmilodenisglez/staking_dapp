import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StakingModule = buildModule("StakingModule", (m) => {
  // Define the contract to deploy
  const stakingContract = m.contract("StakingContract");

  // Export the deployed contract
  return { stakingContract };
});

export default StakingModule;