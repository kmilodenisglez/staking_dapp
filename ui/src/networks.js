export const NETWORKS = [
  {
    name: 'Localnet',
    chainId: '0x7A69', // 31337
    chainIdDec: 31337,
    rpcUrls: ['http://127.0.0.1:8545'],
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: [],
  },
  {
    name: 'Sepolia',
    chainId: '0xaa36a7', // 11155111
    chainIdDec: 11155111,
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    contractAddress: '', // Poner aquí el address desplegado en Sepolia
    nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  {
    name: 'Amoy',
    chainId: '0x13882', // 80002
    chainIdDec: 80002,
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    contractAddress: '', // Poner aquí el address desplegado en Amoy
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    blockExplorerUrls: ['https://www.oklink.com/amoy'],
  },
];
