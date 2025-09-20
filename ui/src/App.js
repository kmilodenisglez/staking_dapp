import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import WalletInteractions from './components/WalletInteractions';
import { NetworkProvider, useNetwork } from './NetworkContext';
import NetworkSelector from './components/NetworkSelector';
import StakingApp from './StakingApp';

function NetworkInfo({ network }) {
  return (
    <span className="network-info">
      <span style={{fontWeight:600}}>{network.name}</span>
      <span style={{fontSize:'0.93em',color:'#888'}}>ID: {parseInt(network.chainId, 16)}</span>
      {network.nativeCurrency && (
        <span style={{fontSize:'0.93em',color:'#888'}}>{network.nativeCurrency.symbol}</span>
      )}
    </span>
  );
}

function AppLayout() {
  const { selectedNetwork, switchNetwork } = useNetwork();
  const location = useLocation();
  return (
    <>
      <div className="top-bar">
        <div className="nav-menu">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Staking dApp</Link>
          <Link to="/wallet" className={location.pathname === '/wallet' ? 'active' : ''}>Wallet Interactions</Link>
        </div>
        <div className="network-bar">
          <NetworkSelector selectedNetwork={selectedNetwork} onChange={switchNetwork} />
          <NetworkInfo network={selectedNetwork} />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<StakingApp />} />
        <Route path="/wallet" element={<WalletInteractions />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <NetworkProvider>
      <Router>
        <AppLayout />
      </Router>
    </NetworkProvider>
  );
}

export default App;