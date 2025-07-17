import React from 'react';

interface SearchBarProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchType: 'cards' | 'decks';
  onSearchTypeChange: (type: 'cards' | 'decks') => void;
  cardSearchField?: 'front' | 'back' | 'all';
  onCardSearchFieldChange?: (field: 'front' | 'back' | 'all') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchTextChange,
  searchType,
  onSearchTypeChange,
  cardSearchField,
  onCardSearchFieldChange,
}) => {
  return (
    <div className="flex items-center space-x-2 p-4">
      <input
        type="text"
        placeholder={`Buscar ${searchType === 'cards' ? 'tarjetas' : 'mazos'}...`}
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-md"
      />
      <select
        value={searchType}
        onChange={(e) => onSearchTypeChange(e.target.value as 'cards' | 'decks')}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="cards">Tarjetas</option>
        <option value="decks">Mazos</option>
      </select>
      {searchType === 'cards' && onCardSearchFieldChange && (
        <select
          value={cardSearchField}
          onChange={(e) => onCardSearchFieldChange(e.target.value as 'front' | 'back' | 'all')}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">Front y Back</option>
          <option value="front">Front</option>
          <option value="back">Back</option>
        </select>
      )}
    </div>
  );
};

export default SearchBar;