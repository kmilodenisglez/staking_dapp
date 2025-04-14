import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import WalletInteractions from './components/WalletInteractions';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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

function StakingApp() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [networkName, setNetworkName] = useState("");

  const getBalances = useCallback(async () => {
    try {
      if (!isConnected) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const userBalance = await contract.stakedBalances(account);
      const total = await contract.totalStaked();
      
      setStakedBalance(ethers.formatEther(userBalance));
      setTotalStaked(ethers.formatEther(total));
    } catch (err) {
      setStatus("Error fetching balances: " + err.message);
    }
  }, [isConnected, account]);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0].toString());
      setIsConnected(true);
      getBalances();
    } else {
      setIsConnected(false);
      setAccount("");
      setStakedBalance("0");
    }
  }, [getBalances]);

  const checkWalletConnection = useCallback(async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          setIsConnected(true);
          setAccount(accounts[0].address);
          setNetworkName(network.name);
          getBalances();
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  }, [getBalances]);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    checkWalletConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkWalletConnection, handleAccountsChanged, handleChainChanged]);

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
      // Esperar a que se resuelva la promesa del signer
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      // Validate amount
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const tx = await contract.stake(ethers.parseEther(amount), { 
        value: ethers.parseEther(amount) 
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
      // Esperar a que se resuelva la promesa del signer
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.unstake(ethers.parseEther(amount));
      await tx.wait();
      setStatus("Tokens unstaked successfully");
      setAmount("");
      getBalances();
    } catch (err) {
      setStatus("Error unstaking tokens: " + err.message);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear all state
      setIsConnected(false);
      setAccount("");
      setNetworkName("");
      setStakedBalance("0");
      setTotalStaked("0");
      setStatus("Wallet disconnected");
      
      // If using ethereum events, remove them
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
      
      // You might want to reload the page to ensure a clean state
      // window.location.reload();
    } catch (error) {
      setStatus("Error disconnecting: " + error.message);
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
          <button onClick={disconnectWallet} className="disconnect-button">
            Disconnect Wallet
          </button>
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

function App() {
  return (
    <Router>
      <div className="nav-menu">
        <Link to="/">Staking dApp</Link>
        <Link to="/wallet">Wallet Interactions</Link>
      </div>
      
      <Routes>
        <Route path="/" element={<StakingApp />} />
        <Route path="/wallet" element={<WalletInteractions />} />
      </Routes>
    </Router>
  );
}

export default App;