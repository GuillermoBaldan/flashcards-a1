import React from 'react';

interface TestProgressBarProps {
  progress: number;
}

const TestProgressBar: React.FC<TestProgressBarProps> = ({
  progress,
}) => {
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