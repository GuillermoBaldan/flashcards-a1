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
      className="menu-button"
      style={{ position: 'fixed', top: '6em', right: '0.5rem', margin: '1rem', zIndex: 10, padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
    >
      Añadir Tarjeta
    </button>
  );
};

export default AddCardButton;