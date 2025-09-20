import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Ethers v6 Mock
jest.mock('ethers', () => {
  const original = jest.requireActual('ethers');
  return {
    ...original,
    BrowserProvider: jest.fn().mockImplementation(() => ({
      listAccounts: jest.fn().mockResolvedValue(["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]),
      getNetwork: jest.fn().mockResolvedValue({
        name: 'localhost',
        chainId: 31337
      }),
      getSigner: jest.fn().mockImplementation(() => Promise.resolve({
        getAddress: jest.fn().mockResolvedValue("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            name: 'localhost',
            chainId: 31337
          })
        }
      }))
    })),
    Contract: jest.fn().mockImplementation(() => ({
      stakedBalances: jest.fn().mockResolvedValue(original.parseEther("0")),
      totalStaked: jest.fn().mockResolvedValue(original.parseEther("0")),
      stake: jest.fn().mockImplementation((amount) => Promise.resolve({
        wait: jest.fn().mockResolvedValue({})
      })),
      unstake: jest.fn().mockImplementation((amount) => Promise.resolve({
        wait: jest.fn().mockResolvedValue({})
      }))
    }))
  };
});

describe('App Component', () => {
  // Window.ethereum Mock that ACCEPTS the connection
  const mockConnectedEthereum = {
    request: jest.fn().mockImplementation((request) => {
      switch (request.method) {
        case 'eth_requestAccounts':
          return Promise.resolve(["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);
        case 'wallet_switchEthereumChain':
          return Promise.resolve(null);
        default:
          return Promise.resolve([]);
      }
    }),
    on: jest.fn(),
    removeListener: jest.fn(),
    isMetaMask: true
  };


  // Window.ethereum Mock that REJECTS the connection
  const mockDisconnectedEthereum = {
    request: jest.fn().mockRejectedValue(new Error('User rejected')),
    on: jest.fn(),
    removeListener: jest.fn(),
    isMetaMask: true
  };

  describe('when wallet is connected', () => {
    beforeEach(() => {
      global.window.ethereum = mockConnectedEthereum;
    });

    test('renders Staking dApp title', async () => {
      render(<App />);
      expect(screen.getByText(/Staking dApp/i)).toBeInTheDocument();
    });

    test('shows connected wallet information', async () => {
      render(<App />);
      const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
      await userEvent.click(connectButton);
      
      await waitFor(() => {
        expect(screen.getByText(/0xf39Fd6/)).toBeInTheDocument();
      });
    });

    test('shows staking interface when connected', async () => {
      render(<App />);
      const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
      await userEvent.click(connectButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Stake/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Unstake/i })).toBeInTheDocument();
      });
    });
  });

  describe('when wallet is disconnected', () => {
    beforeEach(() => {
      global.window.ethereum = mockDisconnectedEthereum;
    });

    test('shows connect button', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /Connect Wallet/i })).toBeInTheDocument();
    });

    test('shows error message when connection fails', async () => {
      render(<App />);
      const connectButton = screen.getByRole('button', { name: /Connect Wallet/i });
      await userEvent.click(connectButton);

      await waitFor(() => {
        expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      });
    });
  });
});