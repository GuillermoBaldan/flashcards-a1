import React from 'react';

interface TestProgressBarProps {
  currentCardIndex: number;
  totalCards: number;
}

const TestProgressBar: React.FC<TestProgressBarProps> = ({
  currentCardIndex,
  totalCards,
}) => {
  const progress = totalCards > 0 ? (currentCardIndex / totalCards) * 100 : 0;

  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '9999px', height: '10px' }}>
      <div
        style={{
          backgroundColor: '#2563eb',
          height: '100%',
          borderRadius: '9999px',
          width: `${progress}%`,
        }}
      ></div>
    </div>
  );
};

export default TestProgressBar;