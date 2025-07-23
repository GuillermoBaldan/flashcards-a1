import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AddCardButtonProps {
  deckId: string;
}

const AddCardButton: React.FC<AddCardButtonProps> = ({ deckId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/decks/${deckId}/add-card`);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 z-10 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
      style={{ top: '6em', right: '0.5rem', margin: '1rem' }}
    >
      Añadir Tarjeta
    </button>
  );
};

export default AddCardButton;