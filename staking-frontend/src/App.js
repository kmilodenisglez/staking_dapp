import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

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

function App() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");

  useEffect(() => {
    if (window.ethereum) {
      getBalances();
    }
  }, []);

  const getBalances = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const address = await signer.getAddress();
      const userBalance = await contract.stakedBalances(address);
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.stake(ethers.utils.parseEther(amount), { value: ethers.utils.parseEther(amount) });
      await tx.wait();
      setStatus("Tokens staked successfully");
      setAmount("");
      getBalances();
    } catch (err) {
      setStatus("Error staking tokens: " + err.message);
    }
  };

  const unstakeTokens = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not installed");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
      <p>Total Staked: {totalStaked} ETH</p>
      <p>Your Staked Balance: {stakedBalance} ETH</p>
      <input
        type="text"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={stakeTokens}>Stake</button>
      <button onClick={unstakeTokens}>Unstake</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
