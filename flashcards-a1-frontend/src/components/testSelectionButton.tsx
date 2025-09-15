import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/TestSelectionButton.css';

interface TestSelectionButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

const TestSelectionButton: React.FC<TestSelectionButtonProps> = ({ className, style }) => {
  return (
    <Link to="/selectionTest" className="test-selection-button" style={style}>
      Test Selection
    </Link>
  );
};

export default TestSelectionButton;