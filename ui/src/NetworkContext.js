import React, { createContext, useContext, useState, useCallback } from 'react';
import { NETWORKS } from './networks';

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

  // Cambia la red en MetaMask y actualiza el estado
  const switchNetwork = useCallback(async (network) => {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        // Si la red no existe, agregarla
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: network.chainId,
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: network.rpcUrls,
            blockExplorerUrls: network.blockExplorerUrls,
          }],
        });
      } else {
        throw switchError;
      }
    }
    setSelectedNetwork(network);
  }, []);

  return (
    <NetworkContext.Provider value={{ selectedNetwork, switchNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
