import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AddCardButton from '../components/addCardButton';
import SearchBar from '../components/searchBar.tsx';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';

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
              <p className="text-[#637488]">
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
          <p className="text-[#637488] text-center col-span-full">No se encontraron tarjetas para este mazo.</p>
        )}
      </div>
      <div>
        <div className="flex flex-row gap-2 border-t border-[#f0f2f4] bg-white px-4 pb-3 pt-2">
          <Link className="flex items-center justify-end gap-1 text-[#637488]" to="/">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="House" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#637488] text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
          </Link>
          <Link className="flex items-center justify-end gap-1 text-[#637488]" to="/decks">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="Folder" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M216,72H131.31L104,44.69A15.88,15.88,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.41,15.41,0,0,0,39.39,216h177.5A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#637488] text-xs font-medium leading-normal tracking-[0.015em]">Decks</p>
          </Link>
          <Link className="flex items-center justify-end gap-1 text-[#637488]" to="/study">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="Cards" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M184,72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V88A16,16,0,0,0,184,72Zm0,128H40V88H184V200ZM232,56V176a8,8,0,0,1-16,0V56H64a8,8,0,0,1,0-16H216A16,16,0,0,1,232,56Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#637488] text-xs font-medium leading-normal tracking-[0.015em]">Study</p>
          </Link>
          <Link className="flex items-center justify-end gap-1 text-[#637488]" to="/profile">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="User" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                ></path>
              </svg>
            </div>
            <p className="text-[#637488] text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
          </Link>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
};

export default CardsInDeck;