import React, { useEffect, useState } from 'react';
import WalletConnect from './components/WalletConnect';
import TokenTable from './UI/TokenTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Token } from './components/type/Token';
import { getProvider } from './components/utils/utils';
import * as solanaWeb3 from '@solana/web3.js';
import { createRevokeInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import Footer from 'components/Footer';
import Header from 'components/header';

const App: React.FC = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);

    const handleError = (error: Error) => {
        toast.error(`Ошибка: ${error.message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        });
    };

    const revokeApproval = async () => {
        if (selectedTokens.length === 0) {
            toast.info('Выберите хотя бы один токен для отзыва аппрува.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'dark',
            });
            return;
        }

        try {
            const provider = getProvider();
            if (!provider || !provider.isPhantom) {
                throw new Error('Phantom Wallet не подключен.');
            }

            const { publicKey } = await provider.connect();
            if (!publicKey) {
                throw new Error('Не удалось получить публичный ключ кошелька.');
            }

            const connection = new solanaWeb3.Connection(
                'https://evocative-quiet-field.solana-mainnet.quiknode.pro/42dea1d5cb4751b78f1d7e7dac9e5d628c892fbd/',
                'confirmed'
            );

            const transaction = new solanaWeb3.Transaction();

            selectedTokens.forEach((token) => {
                const mintPublicKey = new solanaWeb3.PublicKey(token.mint);
                const delegatePublicKey = new solanaWeb3.PublicKey(token.delegate);

                const revokeInstruction = createRevokeInstruction(
                    mintPublicKey,
                    publicKey,
                    [delegatePublicKey]
                );
                transaction.add(revokeInstruction);
            });

            const signedTransaction = await provider.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            await connection.confirmTransaction(signature, 'confirmed');
            toast.success(`Отзыв аппрува для ${selectedTokens.length} токенов выполнен.`, {
                position: 'top-right',
                autoClose: 3000,
                theme: 'dark',
            });

            setSelectedTokens([]);
        } catch (error) {
            handleError(error as Error);
        }
    };

    useEffect(() => {
        const test = getProvider();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between items-center p-4">
            {/* <h1 className="text-3xl font-bold mb-6">Solana Delegated Tokens Viewer</h1> */}
            <Header setTokens={setTokens} onError={(err) => toast.error(err.message)} />
            <WalletConnect setTokens={setTokens} onError={handleError} />
            <div className="w-full max-w-4xl mt-6">
                {tokens.length > 0 ? (
                    <>
                        <TokenTable
                            tokens={tokens}
                            selectedTokens={selectedTokens}
                            setSelectedTokens={setSelectedTokens}
                        />
                        <button
                            onClick={revokeApproval}
                            disabled={selectedTokens.length === 0}
                            className={`mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none ${selectedTokens.length === 0 && 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            Отозвать аппрув
                        </button>
                    </>
                ) : (
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p>Нет делегированных токенов для отображения.</p>
                    </div>
                )}
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
};

export default App;
