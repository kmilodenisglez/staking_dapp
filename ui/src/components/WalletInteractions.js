import React, { useState } from 'react';
import { ethers } from 'ethers';
import './WalletInteractions.css';

function WalletInteractions() {
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [status, setStatus] = useState('');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [chainId, setChainId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [networkName, setNetworkName] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      setAccount(accounts[0]);
      setStatus('Wallet connected successfully');
      
      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });
      setChainId(chainId);
      
      // Get balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const signMessage = async () => {
    try {
      if (!message) throw new Error("Please enter a message to sign");
      if (!window.ethereum) throw new Error("MetaMask not installed");

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Request switch to localhost network (chainId 31337 for Hardhat)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 in hex
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const signature = await signer.signMessage(message);
      
      setSignedMessage(signature);
      setStatus('Message signed successfully');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const verifySignature = async () => {
    try {
      if (!signedMessage || !message) throw new Error("Need both message and signature to verify");
      
      const signerAddr = ethers.verifyMessage(message, signedMessage);
      if (signerAddr.toLowerCase() === account.toLowerCase()) {
        setStatus('Signature verified successfully!');
      } else {
        setStatus('Signature verification failed!');
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const sendTestTransaction = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = {
        to: "0x0000000000000000000000000000000000000000",
        value: ethers.parseEther("0"),
        data: "0x",
      };

      const response = await signer.sendTransaction(tx);
      setStatus('Transaction sent: ' + response.hash);
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const switchNetwork_ = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }], // Goerli testnet
      });
      setStatus('Switched to Goerli network');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const switchNetwork = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      // Request connection to MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Switch to the Sepolia testnet network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia testnet
        });
      } catch (switchError) {
        // If the network does not exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'], // You should use your own Infura ID or other RPC provider
              blockExplorerUrls: ["https://sepolia.etherscan.io"]
            }]
          });
          console.log("Connected to Sepolia network");
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
      setStatus("Wallet connected successfully to Sepolia network");
    } catch (error) {
      setStatus("Error: " + (error.message || "Failed to connect wallet"));
    }
  };



  const switchLocalNetwork = async () => {
    try {
      if (!window.ethereum) {
        // Try to open MetaMask
        window.open('https://metamask.io/download/', '_blank');
        throw new Error("MetaMask not installed");
      }

      // Request connection to MetaMask - this will open the MetaMask popup
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Switch to the local network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7A69' }], // Local network
        });
      } catch (switchError) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7A69',
                chainName: 'Local Test Network',
                nativeCurrency: {
                  name: 'Local ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['http://127.0.0.1:8545'],
              }]
            });
          } catch (addError) {
            throw new Error("Failed to add local network to MetaMask");
          }
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
      setStatus("Wallet connected successfully to Local network");

      // Get balance
      const balance = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance));
      
      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });
      setChainId(chainId);

    } catch (error) {
      setStatus("Error: " + (error.message || "Failed to connect wallet"));
    }
  };



  return (
      <div className="wallet-interactions">
        <h2>MetaMask Interactions Example</h2>

        <div className="wallet-status">
          {account ? (
              <>
                <p>Connected Account: {account.slice(0, 6)}...{account.slice(-4)}</p>
                <p>Balance: {balance} ETH</p>
                <p>Chain ID: {chainId}</p>
              </>
          ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>

        <div className="interaction-section">
          <h3>Sign Message</h3>
          <input
              type="text"
              placeholder="Enter message to sign"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={signMessage}>Sign Message</button>
          {signedMessage && (
              <>
                <p className="signature">Signature: {signedMessage.slice(0, 20)}...</p>
                <button onClick={verifySignature}>Verify Signature</button>
              </>
          )}
        </div>

        <div className="interaction-section">
          <h3>Network Interaction</h3>
          <button onClick={switchNetwork}>Switch to Sepolia</button>
          <button onClick={sendTestTransaction}>Send Test Transaction</button>
        </div>

        <div className="interaction-section">
          <h3>Local Network Interaction</h3>
          <button onClick={switchLocalNetwork}>Switch to localnet</button>
          <button onClick={sendTestTransaction}>Send Test Transaction</button>
        </div>
        <div className="status-section">
          <p>{status}</p>
        </div>
      </div>
  );
}

export default WalletInteractions;