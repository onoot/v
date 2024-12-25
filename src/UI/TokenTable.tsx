import React, { useState } from 'react';
import { Token } from '../components/type/Token';

const TokenTable: React.FC<{
    tokens: Token[];
    selectedTokens: Token[];
    setSelectedTokens: (tokens: Token[]) => void;
}> = ({ tokens, selectedTokens, setSelectedTokens }) => {
    const toggleSelectToken = (token: Token) => {
        const isSelected = selectedTokens.some((t) => t.mint === token.mint);
        if (isSelected) {
            setSelectedTokens(selectedTokens.filter((t) => t.mint !== token.mint));
        } else {
            setSelectedTokens([...selectedTokens, token]);
        }
    };

    const selectAllTokens = (checked: boolean) => {
        if (checked) {
            setSelectedTokens(tokens);
        } else {
            setSelectedTokens([]);
        }
    };

    return (
        <table className="w-full table-auto bg-gray-800 rounded-lg">
            <thead>
                <tr className="text-left bg-gray-700">
                    <th className="p-4">
                        <input
                            type="checkbox"
                            checked={selectedTokens.length === tokens.length && tokens.length > 0}
                            onChange={(e) => selectAllTokens(e.target.checked)}
                        />
                    </th>
                    <th className="p-4">Mint</th>
                    <th className="p-4">Delegate</th>
                    <th className="p-4">Delegated Amount</th>
                    <th className="p-4">Owner</th>
                </tr>
            </thead>
            <tbody>
                {tokens.map((token, index) => (
                    <tr key={index} className="odd:bg-gray-800 even:bg-gray-700">
                        <td className="p-4">
                            <input
                                type="checkbox"
                                checked={selectedTokens.some((t) => t.mint === token.mint)}
                                onChange={() => toggleSelectToken(token)}
                            />
                        </td>
                        <td className="p-4">{token.mint}</td>
                        <td className="p-4">{token.delegate}</td>
                        <td className="p-4">{token.delegatedAmount}</td>
                        <td className="p-4">{token.owner}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TokenTable;
