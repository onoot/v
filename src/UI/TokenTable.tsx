import React, { useState } from 'react';
import { Token } from '../components/type/Token';

const TokenTable: React.FC<{
  tokens: Token[];
  selectedTokens: Token[];
  setSelectedTokens: (tokens: Token[]) => void;
}> = ({ tokens, selectedTokens, setSelectedTokens }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAscending, setSortAscending] = useState(true);
  const tokensPerPage = 10;

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

  const sortedTokens = [...tokens].sort((a, b) => {
    const balanceA = a.amount / 10 ** a.decimals;
    const balanceB = b.amount / 10 ** b.decimals;
    return sortAscending ? balanceA - balanceB : balanceB - balanceA;
  });

  const paginatedTokens = sortedTokens.slice(
    (currentPage - 1) * tokensPerPage,
    currentPage * tokensPerPage
  );

  return (
    <div>
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
            <th className="p-4">Картинка</th>
            <th className="p-4">Название токена</th>
            <th className="p-4">Символ</th>
            <th className="p-4">Адрес</th>
            <th className="p-4 cursor-pointer" onClick={() => setSortAscending(!sortAscending)}>
              Баланс {sortAscending ? '▲' : '▼'}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedTokens.map((token, index) => (
            <tr key={index} className="odd:bg-gray-800 even:bg-gray-700">
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedTokens.some((t) => t.mint === token.mint)}
                  onChange={() => toggleSelectToken(token)}
                />
              </td>
              <td className="p-4">
                {token.logo ? (
                  <img
                    src={token.logo}
                    alt={token.name || 'Токен'}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">Нет изображения</span>
                )}
              </td>
              <td className="p-4">{token.name || 'Неизвестный токен'}</td>
              <td className="p-4">{token.symbol || 'N/A'}</td>
              <td className="p-4">{token.address}</td>
              <td className="p-4">{(token.amount / 10 ** token.decimals).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Назад
        </button>
        <span>
          Страница {currentPage} из {Math.ceil(tokens.length / tokensPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(tokens.length / tokensPerPage)))}
          disabled={currentPage === Math.ceil(tokens.length / tokensPerPage)}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default TokenTable;
