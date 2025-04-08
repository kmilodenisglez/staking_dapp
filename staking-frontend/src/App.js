import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakedBalances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

function App() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [networkName, setNetworkName] = useState("");

  useEffect(() => {
    checkWalletConnection();
    if (window.ethereum) {
      // Listen to account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // Listen for network changes
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          setIsConnected(true);
          setAccount(accounts[0]);
          setNetworkName(network.name);
          getBalances();
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      getBalances();
    } else {
      setIsConnected(false);
      setAccount("");
      setStakedBalance("0");
    }
  };

  const handleChainChanged = async (chainId) => {
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      // Request connection to MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Switch to the local network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7A69' }], // 31337 in hexadecimal
        });
      } catch (switchError) {
        // If the network does not exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x7A69',
              chainName: 'Localhost 8545',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['http://127.0.0.1:8545']
            }]
          });
        } else {
          throw switchError;
        }
      }

      // Connect to window.ethereum (MetaMask)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      setIsConnected(true);
      setAccount(accounts[0]);
      setNetworkName(network.name);
      getBalances();
      setStatus("Wallet connected successfully");
    } catch (error) {
      setStatus("Error: " + (error.message || "Failed to connect wallet"));
    }
  };

  const getBalances = async () => {
    try {
      if (!isConnected) return;

      // Connect to window.ethereum (MetaMask)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const userBalance = await contract.stakedBalances(account);
      const total = await contract.totalStaked();
      
      setStakedBalance(ethers.utils.formatEther(userBalance));
      setTotalStaked(ethers.utils.formatEther(total));
    } catch (err) {
      setStatus("Error fetching balances: " + err.message);
    }
  };

  const stakeTokens = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not installed");
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Request switch to localhost network (chainId 31337 for Hardhat)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7A69' }], // 31337 in hex
        });
      } catch (switchError) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x7A69',
              chainName: 'Localhost 8545',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['http://127.0.0.1:8545']
            }]
          });
        } else {
          throw switchError;
        }
      }

      // Connect to window.ethereum (MetaMask)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      // Validate amount
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const tx = await contract.stake(ethers.utils.parseEther(amount), { 
        value: ethers.utils.parseEther(amount) 
      });
      setStatus("Transaction pending...");
      await tx.wait();
      setStatus("Tokens staked successfully");
      setAmount("");
      getBalances();
    } catch (err) {
      setStatus("Error: " + (err.message || err.reason || "Transaction failed"));
    }
  };

  const unstakeTokens = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not installed");
      // Connect to window.ethereum (MetaMask)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.unstake(ethers.utils.parseEther(amount));
      await tx.wait();
      setStatus("Tokens unstaked successfully");
      setAmount("");
      getBalances();
    } catch (err) {
      setStatus("Error unstaking tokens: " + err.message);
    }
  };

  return (
    <div className="App">
      <h2>Staking dApp</h2>
      
      {!isConnected ? (
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected Account: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <p>Network: {networkName}</p>
        </div>
      )}

      <p>Total Staked: {totalStaked} ETH</p>
      <p>Your Staked Balance: {stakedBalance} ETH</p>
      
      {isConnected && (
        <>
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={stakeTokens}>Stake</button>
          <button onClick={unstakeTokens}>Unstake</button>
        </>
      )}
      
      <p className="status">{status}</p>
    </div>
  );
}

export default App;
