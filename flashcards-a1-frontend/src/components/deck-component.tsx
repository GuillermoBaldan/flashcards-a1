import React, { useEffect, useState, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import useAdjustFontSize from '../utils/dynamicFontSize';
import { formatTimeRemaining } from '../utils/formatTimeRemaining';
import getContrastColor from '../utils/dynamicContrastColor';
import '../styles/components/DeckTile.css';

interface Deck {
  _id: string;
  name: string;
  color: string;
  cards_id: string[];
  userId: string;
  firstCardNextReview: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cardsForStudy?: number;
  cardsReviewed?: number;
  minNextReviewTime?: number; // Cambiado de nextReviewTimeRemaining a minNextReviewTime
  totalCards?: number;
}

const DeckTile: React.FC<{ deck: Deck; linkSuffix?: string }> = memo(({ deck, linkSuffix = 'cards' }) => {
  const deckTileRef = useRef<HTMLAnchorElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu to handle clicks outside

  const textColor = getContrastColor(deck.color || '#ffffff');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (deckTileRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      observer.observe(deckTileRef.current);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      if (deck.minNextReviewTime !== undefined && deck.minNextReviewTime !== Infinity) {
        const currentTime = Date.now();
        let remaining = deck.minNextReviewTime - currentTime;
  
        if (remaining < 0) {
          const timeAgoRaw = formatTimeRemaining(Math.abs(remaining));
          const timeAgo = timeAgoRaw.replace('Próximo repaso ', '');
          setTimeRemaining(`Tenías que repasar tu carta hace ${timeAgo}`);
        } else {
          setTimeRemaining(formatTimeRemaining(remaining));
        }
      } else {
        setTimeRemaining(undefined);
      }
    };
  
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
  
    return () => clearInterval(intervalId);
  }, [deck.minNextReviewTime]);

  const { fontSize, textRef } = useAdjustFontSize(deck.name, containerWidth, 32);

  const displayName = (linkSuffix === 'study' || linkSuffix === 'cards') && deck.totalCards !== undefined
    ? `${deck.name} (${deck.totalCards})`
    : deck.name;

  const { fontSize: adjustedFontSize, textRef: adjustedTextRef } = useAdjustFontSize(displayName, containerWidth, 32);

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigating to the deck link
    event.stopPropagation(); // Stop event propagation to avoid closing immediately
    setIsMenuOpen(prev => !prev);
  };

  return (
    <Link
      to={`/decks/${deck._id}/${linkSuffix}`}
      className="deck-tile no-underline"
      style={{ backgroundColor: deck.color || '#ffffff', overflow: 'hidden' }}
      ref={deckTileRef}
    >
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }} ref={menuRef}>
        <button 
          onClick={handleMenuToggle} 
          className="menu-button"
          style={{ color: textColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="menu">
            <Link
              to={`/decks/${deck._id}/continuous-test`}
              className="menu-item"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
            >
              Test Continuo
            </Link>
            {/* Add more menu items here */}
          </div>
        )}
      </div>
      <p ref={adjustedTextRef} className="deck-name" style={{ fontSize: `${Math.max(adjustedFontSize, 12)}px`, color: textColor }}>{displayName}</p>

      {/* Mensaje de cartas para estudiar (solo si aplica) */}
      {deck.cardsForStudy && deck.cardsForStudy > 0 && (
        <p className="cards-for-study">{deck.cardsForStudy} cards for study</p>
      )}

      {/* Mensaje de tiempo de repaso (siempre visible, con color dinámico) */}
      {linkSuffix !== 'study' && (
        <p className={`review-time ${timeRemaining && timeRemaining.startsWith('Tenías que repasar') ? 'review-time-overdue' : ''}`} style={{ color: textColor }}>
          {timeRemaining || 'Próximo repaso: No hay cartas para estudiar'}
        </p>
      )}

      {/* Mensaje de cartas repasadas */}
      <p className="cards-reviewed" style={{ color: textColor }}>{(deck.cardsReviewed ?? 0)} cards reviewed</p>
      {linkSuffix !== 'study' && linkSuffix !== 'cards' && deck.totalCards !== undefined && (
        <p className="total-cards" style={{ color: textColor }}>({deck.totalCards} tarjetas hechas)</p>
      )}
    </Link>
  );
});

export default DeckTile;
