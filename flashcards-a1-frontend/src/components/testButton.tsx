import React from 'react';

interface TestButtonProps {
  text: string;
  onClick: () => void;
}

const TestButton: React.FC<TestButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center bg-white hover:bg-blue-500 text-black hover:text-white transition-colors duration-300"
      style={{
        width: '25vw',
        height: '33.33vh',
        borderRadius: '0.5rem',
        border: '2px solid',
        fontSize: '2rem',
        fontFamily: 'Comic Neue, cursive'
      }}
    >
      {text}
    </button>
  );
};

export default TestButton;