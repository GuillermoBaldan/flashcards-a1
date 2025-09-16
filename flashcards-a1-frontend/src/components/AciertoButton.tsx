import React from 'react';
import '../styles/components/AciertoButton.css';

interface AciertoButtonProps {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const AciertoButton: React.FC<AciertoButtonProps> = ({ onClick, className = '', style, disabled }) => {
  return (
    <button type="button" className={`custom-button acierto-button ${className}`.trim()} onClick={onClick} style={style} disabled={disabled}>
      Acierto
    </button>
  );
};

export default AciertoButton;