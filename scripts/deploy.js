async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Get the deployer's balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance));
  
    // Deploy the staking contract
    const StakingContract = await ethers.getContractFactory("StakingContract");
    const staking = await StakingContract.deploy();
    await staking.waitForDeployment();
  
    console.log("Staking contract deployed to:", await staking.getAddress());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  