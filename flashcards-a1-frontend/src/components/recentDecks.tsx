import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeckTile from './deck-component';
import { Link } from 'react-router-dom';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  cardType: string;
  lastReview: number;
  nextReview: number;
  gameOptions: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  nextReviewTimeRemaining?: string;
}

interface RecentDecksProps {
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
}

const RecentDecks: React.FC<RecentDecksProps> = ({ buttonClassName, buttonStyle }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [showRecentDecks, setShowRecentDecks] = useState<boolean>(false);

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      try {
        const decksResponse = await axios.get('http://localhost:5000/decks/');
        const cardsResponse = await axios.get('http://localhost:5000/cards/');

        const allDecksData: Deck[] = decksResponse.data;
        const allCardsData: Card[] = cardsResponse.data.map((card: Card) => ({
          ...card,
          lastReview: card.lastReview ? card.lastReview * 1000 : null,
          nextReview: card.nextReview ? card.nextReview * 1000 : null,
        }));

        setAllCards(allCardsData);

        const sortedDecks = allDecksData.map(deck => {
          const cardsInDeck = allCardsData.filter(card => card.deckId === deck._id);
          const mostRecentReview = cardsInDeck.reduce((maxReview, card) => {
            return (card.lastReview && card.lastReview > maxReview) ? card.lastReview : maxReview;
          }, 0);
          return { ...deck, mostRecentReview };
        }).sort((a, b) => (b.mostRecentReview || 0) - (a.mostRecentReview || 0));

        setDecks(sortedDecks);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDecksAndCards();
  }, []);

  return (
    <div>
      <button
        onClick={() => setShowRecentDecks(!showRecentDecks)}
        className={buttonClassName}
        style={buttonStyle}
      >
        Recent Decks
      </button>

      {showRecentDecks && (
        <div className="recent-decks-mosaic p-4 grid grid-cols-3 gap-x-8 gap-y-4">
          {decks.length > 0 ? (
            decks.map(deck => (
              <DeckTile key={deck._id} deck={deck} linkSuffix="study" />
            ))
          ) : (
            <p>No hay mazos recientes para mostrar.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentDecks;