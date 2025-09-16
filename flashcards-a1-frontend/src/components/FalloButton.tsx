import React from 'react';
import '../styles/components/FalloButton.css';

interface FalloButtonProps {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const FalloButton: React.FC<FalloButtonProps> = ({ onClick, className = '', style, disabled }) => {
  return (
    <button type="button" className={`custom-button fallo-button ${className}`.trim()} onClick={onClick} style={style} disabled={disabled}>
      Fallo
    </button>
  );
};

export default FalloButton;