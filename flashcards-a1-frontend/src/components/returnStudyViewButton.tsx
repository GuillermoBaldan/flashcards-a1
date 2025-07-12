import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReturnStudyViewButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/study')}
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
      style={{ display: 'flex', marginTop: '1rem', margin: 'auto', justifyContent: 'center' }}
    >
      Volver a la vista de Estudio
    </button>
  );
};

export default ReturnStudyViewButton;