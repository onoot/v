import React, { useState, useEffect } from 'react';
import * as solanaWeb3 from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Token } from '../type/Token';
import { toast } from 'react-toastify';
import { getProvider } from '../utils/utils';
import {WalletMultiButtonProps} from '../interface/interface';

declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: solanaWeb3.PublicKey }>;
    };
  }
}

const WalletMultiButton: React.FC<WalletMultiButtonProps> = ({ setTokens, onError }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<solanaWeb3.PublicKey | null>(null);

  const rpcUrl = 'https://evocative-quiet-field.solana-mainnet.quiknode.pro/42dea1d5cb4751b78f1d7e7dac9e5d628c892fbd/';

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const provider = getProvider();
        if (provider && provider.isPhantom) {
          const { publicKey } = await provider.connect();
          if (publicKey) {
            setPublicKey(publicKey);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error('Ошибка проверки подключения кошелька:', error);
      }
    };
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error('Phantom Wallet не найден.');
      }

      const { publicKey } = await provider.connect();
      setPublicKey(publicKey);
      setIsConnected(true);
    } catch (error) {
      onError(error as Error);
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      if (provider) {
        await provider.disconnect();
        setPublicKey(null);
        setIsConnected(false);
        toast.success('Кошелек отключен.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark',
        });
      }
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">
            {`${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`}
          </span>
          <button
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Отключить
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Подключить кошелек
        </button>
      )}
    </div>
  );
};

export default WalletMultiButton;
