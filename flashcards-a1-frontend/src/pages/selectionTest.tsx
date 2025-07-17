import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SelectionTest: React.FC = () => {
  const [isHoveringDeck, setIsHoveringDeck] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Selección de Test</h1>
      <div className="flex space-x-4">
        <Link
          to="/test-decks"
          className="font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center"
          style={{
            width: '25vw',
            height: '33.33vh',
            borderRadius: '0.5rem',
            border: '2px solid',
            backgroundColor: isHoveringDeck ? '#3B82F6' : 'white', // blue-500 or white
            color: isHoveringDeck ? 'white' : 'black',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            margin: '6vw',
            fontSize: '4rem',
            fontFamily: 'Comic Neue, cursive'
          }}
          onMouseEnter={() => setIsHoveringDeck(true)}
          onMouseLeave={() => setIsHoveringDeck(false)}
        >
          Tests de Mazos
        </Link>
        <Link
          to="/test-types-cards"
          className="font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center"
          style={{
            width: '25vw',
            height: '33.33vh',
            borderRadius: '0.5rem',
            border: '2px solid',
            backgroundColor: isHoveringCard ? '#3B82F6' : 'white', // blue-500 or white
            color: isHoveringCard ? 'white' : 'black',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            margin: '6vw',
            fontSize: '4rem',
            fontFamily: 'Comic Neue'
          }}
          onMouseEnter={() => setIsHoveringCard(true)}
          onMouseLeave={() => setIsHoveringCard(false)}
        >
          Tests de Cartas
        </Link>
      </div>
    </div>
  );
};

export default SelectionTest;