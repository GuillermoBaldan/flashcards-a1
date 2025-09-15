import React from 'react';
import { Link } from 'react-router-dom';

interface RecentDecksButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

const RecentDecksButton: React.FC<RecentDecksButtonProps> = ({ className, style }) => {
  return (
    <Link to="/study/recent-decks" className={className} style={style}>
      Recent Decks
    </Link>
  );
};

export default RecentDecksButton;