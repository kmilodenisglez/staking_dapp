import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNetwork } from './NetworkContext';

function StakingApp() {
  const { selectedNetwork } = useNetwork();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [networkName, setNetworkName] = useState("");

  const contractAddress = selectedNetwork.contractAddress;
  const contractABI = [
    {
      "inputs": [
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "stake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "", "type": "address" }
      ],
      "name": "stakedBalances",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalStaked",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "unstake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

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
  }, [isConnected, account, contractAddress]);

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
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      setIsConnected(true);
      setStatus("Wallet connected successfully");
      getBalances();
    } catch (error) {
      setStatus("Error: " + (error.message || "Failed to connect wallet"));
    }
  };

  const stakeTokens = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not installed");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }
      const tx = await contract.stake(ethers.parseEther(amount), { value: ethers.parseEther(amount) });
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
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
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
      setIsConnected(false);
      setAccount("");
      setNetworkName("");
      setStakedBalance("0");
      setTotalStaked("0");
      setStatus("Sesión limpiada. Para desconectar completamente tu wallet, hazlo desde la extensión de MetaMask.");
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    } catch (error) {
      setStatus("Error limpiando sesión: " + error.message);
    }
  };

  // Validación visual para amount
  const isAmountValid = amount && !isNaN(amount) && parseFloat(amount) > 0;
  const isError = status.toLowerCase().includes('error');
  const isSuccess = status.toLowerCase().includes('successfully') || status.toLowerCase().includes('éxito');

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
            Limpiar sesión
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
            style={{ borderColor: amount && !isAmountValid ? '#e74c3c' : undefined }}
          />
          {!isAmountValid && amount && (
            <div className="status error" style={{marginBottom:8}}>Por favor ingresa un monto válido.</div>
          )}
          <button onClick={stakeTokens} disabled={!isAmountValid || !isConnected}>Stake</button>
          <button onClick={unstakeTokens} disabled={!isAmountValid || !isConnected}>Unstake</button>
        </>
      )}
      <p className={`status${isError ? ' error' : isSuccess ? ' success' : ''}`}>{status}</p>
    </div>
  );
}

export default StakingApp;
