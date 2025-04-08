const hre = require("hardhat");
const { parseEther } = require("ethers");

// to test, then deploy contract and run:
// npx hardhat run scripts/interact.js --network localhost
async function main() {
    const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // Reemplaza con la dirección real
    const [signer] = await hre.ethers.getSigners();

    const StakingContract = await hre.ethers.getContractFactory("StakingContract");
    const stakingContract = StakingContract.attach(contractAddress);

    console.log("Total Staked:", await stakingContract.totalStaked());

    // Usar parseEther directamente
    const tx = await stakingContract.stake(parseEther("1"), { value: parseEther("1") });
    await tx.wait();

    console.log("New Total Staked:", await stakingContract.totalStaked());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});