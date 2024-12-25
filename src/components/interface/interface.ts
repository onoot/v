import * as solanaWeb3 from '@solana/web3.js';
import { Token } from 'components/type/Token';

export interface ConnectOpts {
  onlyIfTrusted: boolean;
}


export interface PhantomProvider {
  isPhantom: PhantomProvider | undefined;
  publicKey: solanaWeb3.PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: solanaWeb3.Transaction) => Promise<solanaWeb3.Transaction>;
  signAllTransactions: (transactions: solanaWeb3.Transaction[]) => Promise<solanaWeb3.Transaction[]>;
  connect: () => Promise<{ publicKey: solanaWeb3.PublicKey }>;
  disconnect: () => Promise<void>;
}


export interface WalletConnectProps {
  setTokens: (tokens: Token[]) => void;
  onError: (error: Error) => void;
}

export interface WalletMultiButtonProps {
  setTokens: (tokens: Token[]) => void;
  onError: (error: Error) => void;
}