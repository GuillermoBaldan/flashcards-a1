import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AddCardButton from '../components/addCardButton';
import SearchBar from '../components/searchBar.tsx';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import NavigationBar from '../components/NavigationBar';
import '../styles/components/CardsInDeck.css';

interface Card {
  _id: string;
  deck: string;
  front: string;
  back: string;
  cardType: string;
  lastReview: Date;
  nextReview: Date;
  gameOptions?: Record<string, any>;
}

const CardsInDeck: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<'cards' | 'decks'>('cards'); // Default to cards search
  const [cardSearchField, setCardSearchField] = useState<'front' | 'back' | 'all'>('all');

  useEffect(() => {
    if (deckId) {
      console.log(`Fetching deck details for deckId: ${deckId}`);
      console.log(`Deck details API URL: http://localhost:5000/decks/${deckId}`);
      // Fetch deck details to get the name
      axios.get(`http://localhost:5000/decks/${deckId}`)
        .then(response => {
          setDeckName(response.data.name);
        })
        .catch(error => {
          console.error("Error fetching deck details:", error);
        });

      console.log(`Fetching cards for deckId: ${deckId}`);
      console.log(`Cards API URL: http://localhost:5000/cards/deck/${deckId}`);
      // Fetch cards for the deck
      axios.get(`http://localhost:5000/cards/deck/${deckId}`)
        .then(response => {
          setCards(response.data);
        })
        .catch(error => {
          console.error("Error fetching cards:", error);
        });
    }
  }, [deckId]);

  const filteredCards = cards.filter(card => {
    if (!searchText) return true;

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

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="flex items-center bg-white p-4 pb-2 justify-between">
        <Link className="flex w-12 items-center" to="/decks">
          <div className="text-[#111418]" data-icon="CaretLeft" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M160,220a8,8,0,0,1-5.66-2.34l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128l74.35,74.34A8,8,0,0,1,160,220Z"></path>
            </svg>
          </div>
        </Link>
        <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">{deckName}</h2>
        <div className="flex w-12 items-center justify-end">
          {/* Add card button */}
          {deckId && <AddCardButton deckId={deckId} />} 
        </div>
      </div>
      <SearchBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        cardSearchField={cardSearchField}
        onCardSearchFieldChange={setCardSearchField}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredCards.length > 0 ? (
          filteredCards.map(card => (
            <div key={card._id} className="bg-[#f0f2f4] rounded-lg p-4 shadow-md flex flex-col justify-between min-h-[120px]">
              <h3 className="text-lg font-semibold mb-2 text-[#111418]">
                <ReactMarkdown remarkPlugins={[RemarkGfm]}>
                  {htmlToMarkdown(card.front)}
                </ReactMarkdown>
              </h3>
              <p className="text-[#637488] card-back">
                <ReactMarkdown remarkPlugins={[RemarkGfm]}>
                  {htmlToMarkdown(card.back)}
                </ReactMarkdown>
              </p>
              <div className="flex justify-end mt-4">
                <Link to={`/edit-card/${card._id}`} className="text-[#007bff] hover:underline text-sm">
                  Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#637488] text-center col-span-full no-underline-p">No se encontraron tarjetas para este mazo.</p>
        )}
      </div>
      <div>
  
        <NavigationBar activePage="decks" />
      </div>
    </div>
  );
};

export default CardsInDeck;