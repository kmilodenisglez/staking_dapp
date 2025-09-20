import React from 'react';
import { NETWORKS } from '../networks';

function NetworkSelector({ selectedNetwork, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor="network-select">Red: </label>
      <select
        id="network-select"
        value={selectedNetwork.chainId}
        onChange={e => {
          const net = NETWORKS.find(n => n.chainId === e.target.value);
          if (net) onChange(net);
        }}
      >
        {NETWORKS.map(net => (
          <option key={net.chainId} value={net.chainId}>
            {net.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default NetworkSelector;
