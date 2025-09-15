import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeckTile from '../components/deck-component';
import NavigationBar from '../components/NavigationBar';
import { calculateStudyMetrics } from '../utils/cardsForStudy';
import { formatTimeRemaining } from '../utils/formatTimeRemaining';

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
  mostRecentReview?: number;
  totalCards?: number;
}

const RecentDecksPage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);

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

        const currentTime = Date.now();

        const sortedDecks = allDecksData.map(deck => {
          const cardsInDeck = allCardsData.filter(card => card.deckId === deck._id);
          const { cardsForStudy, cardsReviewed, reviewTime } = calculateStudyMetrics(cardsInDeck, currentTime);

          const mostRecentReview = cardsInDeck.reduce((maxReview, card) => {
            return (card.lastReview && card.lastReview > maxReview) ? card.lastReview : maxReview;
          }, 0);
          const totalCards = cardsInDeck.length;
          return { ...deck, mostRecentReview, totalCards, cardsForStudy, cardsReviewed, minNextReviewTime: reviewTime };
        }).sort((a, b) => (b.mostRecentReview || 0) - (a.mostRecentReview || 0));

        setDecks(sortedDecks);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDecksAndCards();
  }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <NavigationBar activePage="study" />
      <div className="pt-20" style={{ marginTop: '1rem' }}>
        <h2 className="text-center text-2xl font-bold mb-4">Recent Decks</h2>
        <div className="p-4 grid grid-cols-3 gap-x-8 gap-y-4">
          {decks.length > 0 ? (
            decks.map(deck => (
              <DeckTile key={deck._id} deck={deck} linkSuffix="study" />
            ))
          ) : (
            <p>No hay mazos recientes para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentDecksPage;