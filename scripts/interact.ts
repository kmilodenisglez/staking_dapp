import { network } from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = await network.connect();

async function main() {
  // Get network info to locate the deployment file
  const networkInfo = await ethers.provider.getNetwork();
  console.log(`Interacting on network: ${networkInfo.name}`);

  // Dynamically load the contract address from the deployment file
  const deploymentFile = `deployments/${networkInfo.name}.json`;
  const deploymentPath = path.join(process.cwd(), deploymentFile);

  if (!fs.existsSync(deploymentPath)) {
    console.error(`❌ Deployment file not found at: ${deploymentPath}`);
    console.error(`Please deploy the contracts first by running: npm run deploy:local`);
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const contractAddress = deployment.contractAddress;

  if (!contractAddress) {
    console.error(`❌ Contract address not found in ${deploymentFile}`);
    process.exit(1);
  }

  console.log(`Attaching to StakingContract at: ${contractAddress}`);

  // Get the signer to interact with the contract
  const [signer] = await ethers.getSigners();

  // Attach to the deployed contract
  const StakingContract = await ethers.getContractFactory("StakingContract");
  const stakingContract = StakingContract.attach(contractAddress);

  // Read the initial state
  const initialTotalStaked = await stakingContract.totalStaked();
  console.log("Initial Total Staked:", ethers.formatEther(initialTotalStaked));

  // Send a staking transaction
  const stakeAmount = ethers.parseEther("1");
  console.log(`\nSending a stake of ${ethers.formatEther(stakeAmount)} ETH...`);
  const tx = await stakingContract.connect(signer).stake(stakeAmount, { value: stakeAmount });
  await tx.wait();
  console.log("Transaction confirmed:", tx.hash);

  // Read the final state
  const finalTotalStaked = await stakingContract.totalStaked();
  console.log("New Total Staked:", ethers.formatEther(finalTotalStaked));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
