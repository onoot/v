import React from 'react';
import WalletMultiButton from 'components/Extend/WalletMultiButton';
import { WalletConnectProps } from './interface/interface';
import { toast } from 'react-toastify';

const Header: React.FC<WalletConnectProps> = ({ setTokens, onError }) => {
  return (
    <header className="bg-gray-900 text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <img src="/logo192.png" alt="App Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-lg font-bold">Solana Delegated Tokens Viewer</h1>
          </div>

          {/* Кнопка подключения кошелька */}
          <div className="flex items-center space-x-4">
            <WalletMultiButton
              setTokens={setTokens}
              onError={(err) => toast.error(err.message)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
