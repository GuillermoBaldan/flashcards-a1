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
  const containerStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxSizing: 'border-box',
  } as React.CSSProperties;

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder={`Buscar ${searchType === 'cards' ? 'tarjetas' : 'mazos'}...`}
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        style={inputStyle}
      />
      <select
        value={searchType}
        onChange={(e) => onSearchTypeChange(e.target.value as 'cards' | 'decks')}
        style={selectStyle}
      >
        <option value="cards">Tarjetas</option>
        <option value="decks">Mazos</option>
      </select>
      {searchType === 'cards' && onCardSearchFieldChange && (
        <select
          value={cardSearchField}
          onChange={(e) => onCardSearchFieldChange(e.target.value as 'front' | 'back' | 'all')}
          style={selectStyle}
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