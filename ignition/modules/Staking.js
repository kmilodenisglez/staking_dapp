const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const StakingModule = buildModule("StakingModule", (m) => {
  // Define el contrato a desplegar
  const stakingContract = m.contract("StakingContract");

  // Exporta el contrato desplegado
  return { stakingContract };
});

module.exports = StakingModule;