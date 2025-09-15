import React, { useEffect, useState, useRef } from 'react';
import { calculateStudyMetrics } from '../utils/cardsForStudy';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { formatTimeRemaining } from '../utils/formatTimeRemaining';
import getContrastColor from '../utils/dynamicContrastColor';
import SearchBar from '../components/searchBar.tsx';
import DeckTile from '../components/deck-component';
import RecentDecks from '../components/recentDecks';
import RecentDecksButton from '../components/recentDecksButton';

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
  reviewTime?: string;
  nextReviewTimeRemaining?: string;
  totalCards?: number;
}

const Study: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allDecks, setAllDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [totalCardsForStudy, setTotalCardsForStudy] = useState<number>(0);
  const [totalCardsReviewed, setTotalCardsReviewed] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<'cards' | 'decks'>('decks');
  const [cardSearchField, setCardSearchField] = useState<'front' | 'back' | 'all'>('all');

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      try {
        const decksResponse = await axios.get('http://localhost:5000/decks/');
        const cardsResponse = await axios.get('http://localhost:5000/cards/');

        const allDecks: Deck[] = decksResponse.data;
        const allCards: Card[] = cardsResponse.data.map((card: Card) => ({
          ...card,
          lastReview: card.lastReview ? card.lastReview * 1000 : null,
          nextReview: card.nextReview ? card.nextReview * 1000 : null,
        }));

        setAllDecks(allDecks);
        setAllCards(allCards);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDecksAndCards();
  }, []);

  useEffect(() => {
    if (allDecks.length === 0 || allCards.length === 0) return;

    const processDecks = (currentCards: Card[], currentDecks: Deck[]) => {
      const currentTime = Date.now();

      let currentTotalCardsForStudy = 0;
      let currentTotalCardsReviewed = 0;

      const filteredDecks = currentDecks.filter(deck => {
        if (searchType === 'decks' && searchText) {
          return deck.name.toLowerCase().includes(searchText.toLowerCase());
        }
        return true;
      });

      const processed = filteredDecks.map(deck => {
        let cardsInDeck = currentCards.filter(card => card.deckId === deck._id);

        if (searchType === 'cards' && searchText) {
          cardsInDeck = cardsInDeck.filter(card => {
            const frontMatches = card.front.toLowerCase().includes(searchText.toLowerCase());
            const backMatches = card.back.toLowerCase().includes(searchText.toLowerCase());

            if (cardSearchField === 'front') {
              return frontMatches;
            } else if (cardSearchField === 'back') {
              return backMatches;
            } else { // 'all'
              return frontMatches || backMatches;
            }
          });
        }

        const {
          cardsForStudy,
          cardsReviewed,
          reviewTime
        } = calculateStudyMetrics(cardsInDeck, currentTime);

        const totalCards = cardsInDeck.length;

        currentTotalCardsForStudy += cardsForStudy;
        currentTotalCardsReviewed += cardsReviewed;

        const nextReviewTimeRemaining = formatTimeRemaining(reviewTime - currentTime);

        return {
          ...deck,
          cardsForStudy,
          cardsReviewed,
          minNextReviewTime: reviewTime,
          totalCards
        };
      });
      setTotalCardsForStudy(currentTotalCardsForStudy);
      setTotalCardsReviewed(currentTotalCardsReviewed);
      return processed;
    };

    const processAndSetDecks = () => {
      const processedDecks = processDecks(allCards, allDecks);
      processedDecks.sort((a, b) => {
        const aHasCardsForStudy = (a.cardsForStudy || 0) > 0;
        const bHasCardsForStudy = (b.cardsForStudy || 0) > 0;

        if (aHasCardsForStudy && !bHasCardsForStudy) {
          return -1; // a comes before b
        } else if (!aHasCardsForStudy && bHasCardsForStudy) {
          return 1; // b comes before a
        } else {
          // Both have cards for study or neither have cards for study, sort by cardsForStudy ascending
          return (a.cardsForStudy || 0) - (b.cardsForStudy || 0);
        }
      });
      setDecks(processedDecks);
    };

    processAndSetDecks();

    const intervalId = setInterval(processAndSetDecks, 1000);

    return () => clearInterval(intervalId);
  }, [allDecks, allCards, searchText, searchType, cardSearchField]);

  

  const renderContent = () => (
    <div className="p-4 grid grid-cols-3 gap-x-8 gap-y-4">
      {decks.map(deck => (
        <DeckTile key={deck._id} deck={deck} linkSuffix="study" />
      ))}
    </div>
  );

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <NavigationBar activePage="study" />
      <div className="search-bar-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
          cardSearchField={cardSearchField}
          onCardSearchFieldChange={setCardSearchField}
        />
      </div>
      <div className="pt-20">
        <div className="flex justify-center mt-4">
          <RecentDecksButton
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
            style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.25rem', marginTop: '2rem', width: '13rem', marginRight: '4rem' }}
          />
          <Link to="/selectionTest" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base" style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.25rem', marginTop: '2rem', width: '13rem' }}>
            Test Selection
          </Link>
        </div>
        <div className="flex flex-row items-center justify-around p-4">
          <h2 className="text-red-500 text-lg font-bold leading-tight tracking-[-0.015em">📚 Cards for Study: <strong style={{ color: 'red' }}>{totalCardsForStudy}</strong></h2>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em">✅ Cards Reviewed: <strong style={{ color: 'green' }}>{totalCardsReviewed}</strong></h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Study;
