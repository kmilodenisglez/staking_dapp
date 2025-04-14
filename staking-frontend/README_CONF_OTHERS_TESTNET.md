## To update the code to work with the **Sepolia test network**

you need to modify the `chainId`, `chainName`, and `rpcUrls` parameters to match the Sepolia network configuration. Here's the updated code:

> URL: https://docs.metamask.io/services/tutorials/ethereum/send-a-transaction/send-a-transaction-ethers/

---

### Updated Code for Sepolia Network
```javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0xaa36a7', // Sepolia chain ID in hexadecimal (11155111 in decimal)
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'], // Replace with your Infura Project ID or another RPC provider
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }]
});
```

---

### Explanation of Changes

1. **`chainId`**:
    - The Sepolia testnet has a chain ID of `11155111` in decimal, which is `0xaa36a7` in hexadecimal.
    - Replace `'0x7A69'` (which corresponds to a local Hardhat network) with `'0xaa36a7'`.

2. **`chainName`**:
    - Change the name from `'Localhost 8545'` to `'Sepolia Test Network'`.

3. **`nativeCurrency`**:
    - The native currency for Sepolia is still ETH, so no changes are needed here.

4. **`rpcUrls`**:
    - Replace the local RPC URL (`http://127.0.0.1:8545`) with an RPC endpoint for the Sepolia network.
    - Use an Infura, Alchemy, or any other RPC provider URL. For example:
        - Infura: `https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID`
        - Alchemy: `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY`
        - Public RPC: `https://rpc.sepolia.org`

5. **`blockExplorerUrls`**:
    - Add the block explorer URL for Sepolia: `https://sepolia.etherscan.io`.

---

### How to Get an RPC URL for Sepolia
If you don't already have an RPC URL for Sepolia, you can use one of the following methods:

#### **1. Using Infura**
- Sign up at [Infura](https://infura.io) and create a new project.
- Use the provided Sepolia RPC URL:
  ```
  https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
  ```

#### **2. Using Alchemy**
- Sign up at [Alchemy](https://www.alchemy.com) and create a new app for Sepolia.
- Use the provided Sepolia RPC URL:
  ```
  https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
  ```

#### **3. Using a Public RPC**
- You can also use a public RPC provider like:
  ```
  https://rpc.sepolia.org
  ```

---

### Example with Infura
Here’s how the code looks if you’re using Infura as your RPC provider:

```javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0xaa36a7', // Sepolia chain ID in hexadecimal
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'], // Replace with your Infura Project ID
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }]
});
```

---

### Testing the Code
1. Ensure MetaMask is installed and connected to your website.
2. Run the code in your React.js application or browser console.
3. MetaMask will prompt the user to add the Sepolia network.
4. Once added, MetaMask will switch to the Sepolia network automatically.

---

### Notes
- **Security**: Do not hardcode sensitive information like your Infura Project ID or Alchemy API Key in your frontend code. Use environment variables to store these securely.
- **Error Handling**: Add error handling to gracefully handle cases where the user rejects the request or the RPC URL is invalid.

---

### Final Answer
Update the `chainId`, `chainName`, `rpcUrls`, and `blockExplorerUrls` to match the Sepolia network configuration. Use the code provided above and replace `YOUR_INFURA_PROJECT_ID` or `YOUR_ALCHEMY_API_KEY` with your actual RPC provider credentials.