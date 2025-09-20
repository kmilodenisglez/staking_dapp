import { network } from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = await network.connect();

async function main() {
  // Check for force flag
  const forceDeploy = process.argv.includes('--force') || process.argv.includes('-f');
  
  // Get the signer of the tx and address for deploying the contract
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  // Get the deployer's balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  // Get network info
  const networkInfo = await ethers.provider.getNetwork();
  console.log(`Deploying to ${networkInfo.name} (Chain ID: ${networkInfo.chainId})`);

  // Check if contract is already deployed
  const deploymentFile = `deployments/${networkInfo.name}.json`;
  let existingDeployment: { contractAddress?: string; timestamp?: string } | null = null;
  
  const deploymentsDir = path.join(process.cwd(), 'deployments');
  const deploymentPath = path.join(deploymentsDir, `${networkInfo.name}.json`);

  if (fs.existsSync(deploymentPath)) {
    const deploymentData = fs.readFileSync(deploymentPath, 'utf8');
    existingDeployment = JSON.parse(deploymentData);
    console.log(`\n⚠️  Found existing deployment: ${existingDeployment?.contractAddress}`);
    
    // Verify if the contract is actually deployed at that address
    if (existingDeployment?.contractAddress) {
      const code = await ethers.provider.getCode(existingDeployment.contractAddress);
      if (code !== '0x' && !forceDeploy) {
        console.log(`✅ Contract is already deployed and verified at: ${existingDeployment.contractAddress}`);
        console.log(`📅 Deployed on: ${existingDeployment.timestamp}`);
        console.log(`\n💡 To use this contract in your UI, update VITE_CONTRACT_ADDRESS with:`);
        console.log(`   ${existingDeployment.contractAddress}`);
        console.log(`\n🔄 To force redeploy, use: npx hardhat run scripts/deploy.ts --network ${networkInfo.name} --force`);
        return;
      } else if (code !== '0x' && forceDeploy) {
        console.log(`🔄 Force flag detected, redeploying despite existing contract...`);
      } else {
        console.log(`❌ Contract not found at existing address, proceeding with new deployment...`);
      }
    }
  }

  // Deploy the StakingContract
  const StakingContract = await ethers.getContractFactory("StakingContract", deployer);
  const stakingContract = await StakingContract.deploy();

  await stakingContract.waitForDeployment();

  const contractAddress = await stakingContract.getAddress();
  const deployTx = stakingContract.deploymentTransaction();

  console.log("\n✅ StakingContract deployed to:", contractAddress);
  console.log("Transaction hash:", deployTx?.hash);

  // Save deployment info
  const deploymentInfo = {
    network: networkInfo.name,
    chainId: networkInfo.chainId.toString(),
    contractName: "StakingContract",
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTxHash: deployTx?.hash,
    timestamp: new Date().toISOString()
  };

  console.log("\n📄 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save deployment info to file
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Provide verification command for testnets
  if (networkInfo.chainId === 80002n) { // Amoy testnet
    console.log("\nTo verify the contract on PolygonScan, run:");
    console.log(`npx hardhat verify --network amoy ${contractAddress}`);
    console.log("\n📝 Amoy testnet deployment completed successfully!");
  } else if (networkInfo.name === 'localnet') { // Hardhat local
    console.log("\n📝 Local deployment completed successfully!");
  }
  
  console.log("💡 To use this contract in your UI, update VITE_CONTRACT_ADDRESS with:");
  console.log(`   ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
