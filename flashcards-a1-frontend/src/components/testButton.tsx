import React, { useState } from 'react';

interface TestButtonProps {
  text: string;
  onClick: () => void;
}

const TestButton: React.FC<TestButtonProps> = ({ text, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      onClick={onClick}
      className="font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center transition-colors duration-300"
      style={{
        width: '25vw',
        height: '33.33vh',
        borderRadius: '0.5rem',
        border: '2px solid',
        fontSize: '2rem',
        fontFamily: 'Comic Neue, cursive',
        backgroundColor: isHovering ? '#3B82F6' : 'white', // blue-500 or white
        color: isHovering ? 'white' : 'black',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {text}
    </button>
  );
};

export default TestButton;