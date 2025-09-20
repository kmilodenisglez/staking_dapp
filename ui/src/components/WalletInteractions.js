import React, { useState } from 'react';
import { ethers } from 'ethers';
import './WalletInteractions.css';
import { useNetwork } from '../NetworkContext';

function WalletInteractions() {
  const { selectedNetwork, switchNetwork } = useNetwork();
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [status, setStatus] = useState('');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [chainId, setChainId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [networkName, setNetworkName] = useState("");
  const [recoveredAddress, setRecoveredAddress] = useState('');

  // Guardar el mensaje y firma usados en la última verificación
  const [lastVerified, setLastVerified] = React.useState({ message: '', signature: '', address: '' });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setStatus('Wallet connected successfully');
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(chainId);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance));
      setIsConnected(true);
      const network = await provider.getNetwork();
      setNetworkName(network.name);
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const signMessage = async () => {
    try {
      if (!message) throw new Error("Please enter a message to sign");
      if (!window.ethereum) throw new Error("MetaMask not installed");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await switchNetwork(selectedNetwork);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      setSignedMessage(signature);
      setStatus('Message signed successfully');
      setRecoveredAddress('');
      setLastVerified({ message: '', signature: '', address: '' });
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  const verifySignature = async () => {
    try {
      if (!signedMessage || !message) throw new Error("Need both message and signature to verify");
      const signerAddr = await ethers.verifyMessage(message, signedMessage);
      setRecoveredAddress(signerAddr);
      setLastVerified({ message, signature: signedMessage, address: signerAddr });
      if (signerAddr.toLowerCase() === account.toLowerCase()) {
        setStatus('Signature verified successfully!');
      } else {
        setStatus('Signature verification failed!');
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
      setRecoveredAddress('');
      setLastVerified({ message, signature: signedMessage, address: '' });
    }
  };

  const sendTestTransaction = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      await switchNetwork(selectedNetwork);
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

  const isMessageValid = message && message.length > 0;
  const isError = status.toLowerCase().includes('error');
  const isSuccess = status.toLowerCase().includes('successfully') || status.toLowerCase().includes('éxito');

  // Helper: explorer links
  const explorer = selectedNetwork.blockExplorerUrls && selectedNetwork.blockExplorerUrls[0];
  const accountExplorer = explorer && account ? `${explorer.replace(/\/$/, '')}/address/${account}` : null;
  const lastVerifiedExplorer = explorer && lastVerified.address ? `${explorer.replace(/\/$/, '')}/address/${lastVerified.address}` : null;

  // Limpiar dirección recuperada si cambia el mensaje o la firma
  // React.useEffect(() => {
  //   setRecoveredAddress('');
  // }, [message, signedMessage]);

  return (
    <div className="wallet-interactions">
      <h2>MetaMask Interactions Example</h2>
      <div className="wallet-status">
        {account ? (
          <>
            <p>
              Connected Account: <span style={{fontFamily:'monospace'}}>{account.slice(0, 6)}...{account.slice(-4)}</span>
              {accountExplorer && (
                <a href={accountExplorer} target="_blank" rel="noopener noreferrer" style={{marginLeft:8,fontSize:'0.95em'}}>🔗</a>
              )}
            </p>
            <p>Balance: {balance} {selectedNetwork.nativeCurrency?.symbol || 'ETH'}</p>
            <p>Chain ID: {chainId}</p>
          </>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
      <div className="network-info" style={{marginBottom:12}}>
        <b>Red actual:</b> {selectedNetwork.name} (ID: {parseInt(selectedNetwork.chainId, 16)}) {selectedNetwork.nativeCurrency?.symbol && `- ${selectedNetwork.nativeCurrency.symbol}`}
        {explorer && (
          <a href={explorer} target="_blank" rel="noopener noreferrer" style={{marginLeft:8,fontSize:'0.95em'}}>Ver Explorer</a>
        )}
      </div>
      <div className="interaction-section">
        <h3>Sign Message</h3>
        <div style={{fontSize:'0.95em',color:'#888',marginBottom:4}}>
          <b>¿Qué es esto?</b> Firmar un mensaje con tu wallet permite demostrar que eres dueño de la cuenta, sin exponer tu clave privada. Es útil para autenticación y pruebas de identidad en Web3.
        </div>
        <input
          type="text"
          placeholder="Enter message to sign"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ borderColor: message && !isMessageValid ? '#e74c3c' : undefined }}
        />
        {!isMessageValid && message && (
          <div className="status error" style={{marginBottom:8}}>Por favor ingresa un mensaje.</div>
        )}
        <button onClick={signMessage} disabled={!isMessageValid || !isConnected}>Sign Message</button>
        {signedMessage && (
          <>
            <div style={{fontSize:'0.95em',color:'#888',marginTop:8}}>
              <b>¿Qué es la firma?</b> Es un string generado por tu wallet usando tu clave privada. Solo tú puedes generarla, pero cualquiera puede verificarla.
            </div>
            <p className="signature" style={{wordBreak:'break-all',fontFamily:'monospace',fontSize:'0.97em'}}>{signedMessage}</p>
            <button onClick={verifySignature} disabled={!isMessageValid || !signedMessage}>Verify Signature</button>
          </>
        )}
      </div>
      {(lastVerified.message || lastVerified.signature) && (
        <div style={{marginBottom:8, border:'1px solid #e0e0e0', borderRadius:8, padding:'12px 10px', background:'#fafbfc'}}>
          <div style={{fontSize:'0.95em',color:'#888',marginBottom:4}}>
            <b>Resultado de la verificación:</b>
            <span style={{marginLeft:8, color: status.toLowerCase().includes('success') ? '#27ae60' : status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') ? '#e74c3c' : '#888'}}>
              {status}
            </span>
          </div>
          <div style={{fontSize:'0.95em',color:'#888'}}>
            <b>¿Qué hace la verificación?</b> Recupera la dirección que firmó el mensaje usando la firma y el mensaje. Si coincide con tu cuenta, la firma es válida.
          </div>
          <div style={{marginTop:6}}>
            <span style={{fontWeight:600}}>Mensaje firmado/verificado:</span>
            <span style={{fontFamily:'monospace',fontSize:'0.97em',marginLeft:6}}>{lastVerified.message || 'No disponible.'}</span>
          </div>
          <div style={{marginTop:2}}>
            <span style={{fontWeight:600}}>Firma utilizada:</span>
            <span style={{fontFamily:'monospace',fontSize:'0.97em',marginLeft:6,wordBreak:'break-all'}}>{lastVerified.signature || 'No disponible.'}</span>
          </div>
          <div style={{marginTop:2}}>
            <span style={{fontWeight:600}}>Dirección recuperada:</span>
            <span style={{fontFamily:'monospace',fontSize:'0.97em',marginLeft:6}}>{lastVerified.address || 'No verificada o inválida.'}</span>
            {lastVerifiedExplorer && lastVerified.address && (
              <a href={lastVerifiedExplorer} target="_blank" rel="noopener noreferrer" style={{marginLeft:8,fontSize:'0.95em'}}>🔗</a>
            )}
          </div>
        </div>
      )}
      <div className="interaction-section">
        <h3>Network Interaction</h3>
        <div style={{fontSize:'0.95em',color:'#888',marginBottom:4}}>
          <b>¿Para qué sirve?</b> Enviar una transacción (aunque sea vacía) te permite ver cómo interactúa tu wallet con la red y cómo se genera un hash de transacción.
        </div>
        <button onClick={sendTestTransaction} disabled={!isConnected}>Send Test Transaction</button>
      </div>
      <div className={`status-section${isError ? ' error' : isSuccess ? ' success' : ''}`}> 
        {/* El mensaje de estado ya se muestra en la sección de verificación */}
        {!lastVerified.message && <p>{status}</p>}
      </div>
    </div>
  );
}

export default WalletInteractions;