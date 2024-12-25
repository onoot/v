import React, { useState, useEffect } from 'react';
import * as solanaWeb3 from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Token } from './type/Token';
import { toast } from 'react-toastify';
import { getProvider } from './utils/utils';

// Расширяем интерфейс Window
declare global {
    interface Window {
        solana?: {
            isPhantom: boolean;
            connect: () => Promise<{ publicKey: solanaWeb3.PublicKey }>;
        };
    }
}

const WalletConnect: React.FC<{ setTokens: (tokens: Token[]) => void; onError: (error: Error) => void }> = ({ setTokens, onError }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [publicKey, setPublicKey] = useState<solanaWeb3.PublicKey | null>(null);

    const rpcUrl = "https://evocative-quiet-field.solana-mainnet.quiknode.pro/42dea1d5cb4751b78f1d7e7dac9e5d628c892fbd/";

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

    const fetchDelegatedTokens = async () => {
        if (!publicKey) {
            toast.error('Кошелек не подключен.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'dark',
            });
            return;
        }

        try {
            const connection = new solanaWeb3.Connection(rpcUrl, 'processed');
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
            });

            const tokens: Token[] = tokenAccounts.value
                .map(({ account }) => account.data.parsed.info)
                .filter((info: any) => info.delegate !== undefined)
                .map((info: any) => ({
                    mint: info.mint,
                    delegate: info.delegate,
                    delegatedAmount: info.delegatedAmount,
                    owner: info.owner,
                }));

            if (tokens.length === 0) {
                toast.info('У вас нет делегированных токенов.', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'dark',
                });
            }

            setTokens(tokens);
        } catch (error) {
            if (error instanceof Error && error.message.includes('403')) {
                toast.error('Ошибка доступа: возможно, у вас нет прав для получения делегированных токенов или лимит запросов превышен.', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'dark',
                });
            } else {
                onError(error as Error);
            }
        }
    };

    const generateMockTokens = () => {
        const mockTokens: Token[] = [
            {
                mint: 'MockMint1',
                delegate: 'Delegate1',
                delegatedAmount: '1000',
                owner: 'Owner1',
            },
            {
                mint: 'MockMint2',
                delegate: 'Delegate2',
                delegatedAmount: '500',
                owner: 'Owner2',
            },
            {
                mint: 'MockMint3',
                delegate: 'Delegate3',
                delegatedAmount: '2000',
                owner: 'Owner3',
            },
        ];

        setTokens(mockTokens);
        toast.success('Фиктивные данные токенов загружены!', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'dark',
        });
    };
    
    return (
        <div className="flex items-center space-x-4">
            {isConnected ? (
                <>
                    <span className="text-green-500 font-bold">Подключен</span>
                    <button
                        onClick={fetchDelegatedTokens}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none"
                    >
                        Поиск токенов
                    </button>
                </>
            ) : (
                <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none"
                >
                    Подключить кошелёк
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
