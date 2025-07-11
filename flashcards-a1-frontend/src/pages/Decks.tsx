import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from '../components/navigationBar';
import DeckTile from '../components/deck-component';
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
  minNextReviewTime?: number; // Cambiado de nextReviewTimeRemaining a minNextReviewTime
}

const Decks: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      try {
        const decksResponse = await axios.get('http://localhost:5000/decks/');
        const cardsResponse = await axios.get('http://localhost:5000/cards/');

        const allDecksData: Deck[] = decksResponse.data;
        const allCards: Card[] = cardsResponse.data;

        const processDecks = (currentCards: Card[], prevDecks: Deck[]) => {
          const currentTime = Date.now();
          return prevDecks.map(prevDeck => {
            const cardsInDeck = currentCards.filter(card => card.deckId === prevDeck._id);
            let cardsForStudy = 0;
            let cardsReviewed = 0;
            let minNextReviewTime = Infinity;

            cardsInDeck.forEach(card => {
              // Siempre actualiza minNextReviewTime con el menor nextReview entre todas las cartas
              if (card.nextReview * 1000 < minNextReviewTime) {
                minNextReviewTime = card.nextReview * 1000;
              }

              if (card.nextReview * 1000 < currentTime) {
                cardsForStudy++;
              } else {
                cardsReviewed++;
              }
            });
            
            // Solo crear un nuevo objeto de mazo si es realmente necesario
            if (
              prevDeck.cardsForStudy !== cardsForStudy ||
              prevDeck.cardsReviewed !== cardsReviewed ||
              prevDeck.minNextReviewTime !== minNextReviewTime // Cambiado a minNextReviewTime
            ) {
              return { ...prevDeck, cardsForStudy, cardsReviewed, minNextReviewTime }; // Cambiado a minNextReviewTime
            }
            return prevDeck; // Devolver la misma referencia si nada significativo cambió
          });
        };

        const enrichedDecks = processDecks(allCards, allDecksData);

        // Ordenar los mazos por cardsForStudy de mayor a menor (más urgentes primero)
        enrichedDecks.sort((a, b) => (b.cardsForStudy || 0) - (a.cardsForStudy || 0));

        setDecks(enrichedDecks);

        // No es necesario un setInterval aquí ya que el DeckTile manejará su propio tiempo
        // const intervalId = setInterval(() => {
        //   setDecks(prevDecks => processDecks(allCards, prevDecks));
        // }, 1000);
        // return () => clearInterval(intervalId);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDecksAndCards();
  }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <NavigationBar activePage="decks" />
      {/* Contenido principal */}
      <div className="pt-20"> {/* Ajustar el padding-top para que el contenido no quede debajo de la barra de navegación fija */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Decks</h2>
          <div className="flex w-12 items-center justify-end">
            {/* Botón de añadir mazo (se puede reubicar si es necesario) */}
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#111418] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
              onClick={() => { /* Lógica para añadir nuevo mazo */ alert('Lógica para añadir nuevo mazo aquí'); }}
            >
              <div className="text-[#111418]" data-icon="Plus" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className="p-4 grid grid-cols-3 gap-x-8 gap-y-4">
        {decks.map(deck => (
            <DeckTile key={deck._id} deck={deck} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Decks; 