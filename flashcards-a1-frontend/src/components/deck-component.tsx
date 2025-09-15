import React, { useEffect, useState, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import useAdjustFontSize from '../utils/dynamicFontSize';
import { formatTimeRemaining } from '../utils/formatTimeRemaining';
import getContrastColor from '../utils/dynamicContrastColor';

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
          // La carta debía haberse repasado hace tiempo
          const timeAgo = formatTimeRemaining(Math.abs(remaining));
          setTimeRemaining(`Tenías que repasar tu carta hace ${timeAgo}`);
        } else {
          // La carta aún no necesita ser repasada
          setTimeRemaining(formatTimeRemaining(remaining));
        }
      } else {
        setTimeRemaining(undefined);
      }
    };

    updateTime(); // Actualizar inmediatamente
    const intervalId = setInterval(updateTime, 1000); // Luego cada segundo

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
      className="flex flex-col items-start gap-2 rounded-2xl p-4 shadow-sm border h-36 relative" // Added relative for absolute positioning of menu
      style={{ borderColor: 'black', backgroundColor: deck.color || '#ffffff', borderWidth: '3px', margin: "1rem", borderRadius: '1rem' }}
      ref={deckTileRef}
    >
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }} ref={menuRef}>
        <button 
          onClick={handleMenuToggle} 
          style={{ padding: '0.25rem', borderRadius: '50%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem', color: textColor }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
        {isMenuOpen && (
          <div style={{ position: 'absolute', right: '0', marginTop: '0.5rem', width: '12rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', zIndex: 10 }}>
            <Link
              to={`/decks/${deck._id}/continuous-test`}
              style={{ display: 'block', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#374151', textDecoration: 'none' }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent Link from triggering parent Link
                setIsMenuOpen(false);
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Test Continuo
            </Link>
            {/* Add more menu items here */}
          </div>
        )}
      </div>
      <p ref={adjustedTextRef} className="font-bold leading-normal truncate w-full" style={{ fontSize: `${adjustedFontSize}px`, color: textColor }}>{displayName}</p>

      {/* Mensaje de cartas para estudiar (solo si aplica) */}
      {deck.cardsForStudy && deck.cardsForStudy > 0 && (
        <p className="text-sm font-bold" style={{ color: 'red' }}>{deck.cardsForStudy} cards for study</p>
      )}

      {/* Mensaje de tiempo de repaso (siempre visible, con color dinámico) */}
      {linkSuffix !== 'study' && (
        <p className="text-sm font-bold" style={timeRemaining && timeRemaining.startsWith('Tenías que repasar') ? { color: 'red', fontWeight: 'bold', backgroundColor: 'yellow' } : { color: textColor }}>
          {timeRemaining || 'Próximo repaso: No hay cartas para estudiar'}
        </p>
      )}

      {/* Mensaje de cartas repasadas */}
      <p className="text-sm" style={{ color: textColor }}>{(deck.cardsReviewed ?? 0)} cards reviewed</p>
      {linkSuffix !== 'study' && linkSuffix !== 'cards' && deck.totalCards !== undefined && (
        <p className="text-sm" style={{ color: textColor }}>({deck.totalCards} tarjetas hechas)</p>
      )}
    </Link>
  );
});

export default DeckTile;
