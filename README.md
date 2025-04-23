# Sample Hardhat Project

This is a basic Ethereum staking decentralized application (dApp) built with React for the frontend and Solidity smart contracts deployed using Hardhat. Users can stake and unstake ETH, view their staked balance, and see the total ETH staked in the contract.
It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
```
## Run Hardhat node:
```shell
npx hardhat node
```

## deploy `staking contract`
Next, you need to deploy the staking contract. You have two options:
### Option 1 - Using Ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/Staking.js --network localhost
```
### Option 2 – Using the `deploy.js` script:
```shell
npx hardhat run scripts/deploy.js --network localhost
```

## Interact with contract
After deployment, you need interact with the contract (optional). Run `scripts/interact.js` to test:
```shell
npx hardhat run scripts/interact.js --network localhost
```

Then, you need to update the contract address in your frontend. In `staking-frontend/src/App.js`, the current address is:
```javascript
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
```
You need to replace it with the new address you get after deployment.

To verify that everything is correct:
1. Make sure the Hardhat node is running:
    ```shell
    npx hardhat node
    ```
2. Deploy the contract using one of the options mentioned above.
3. Copy the address of the deployed contract and update contractAddress in your frontend.
4. Restart your [React app](./staking-frontend/README.md).

## Security
Install [slither](https://github.com/crytic/slither) library

### Run
```shell
slither .
```