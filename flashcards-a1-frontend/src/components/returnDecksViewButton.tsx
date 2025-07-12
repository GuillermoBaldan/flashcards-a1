import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReturnDecksViewButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/decks')}
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
      style={{ position: 'fixed', top: '1rem', right: '1.7rem', margin: '1rem' }}
    >
      Volver a la vista de Mazos
    </button>
  );
};

export default ReturnDecksViewButton;