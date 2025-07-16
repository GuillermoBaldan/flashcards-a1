import React, { useEffect, useState, useRef } from 'react';
import { calculateStudyMetrics } from '../utils/cardsForStudy';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
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
  reviewTime?: string;
}

const Study: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      try {
        const decksResponse = await axios.get('http://localhost:5000/decks/');
        const cardsResponse = await axios.get('http://localhost:5000/cards/');

        const allDecks: Deck[] = decksResponse.data;
        const allCards: Card[] = cardsResponse.data;

        const processDecks = (currentCards: Card[], currentDecks: Deck[]) => {
          const currentTime = Date.now();

          return currentDecks.map(deck => {
            const cardsInDeck = currentCards.filter(card => card.deckId === deck._id);
            const {
              cardsForStudy,
              cardsReviewed,
              reviewTime
            } = calculateStudyMetrics(cardsInDeck, currentTime);

            const nextReviewTimeRemaining = formatTimeRemaining(reviewTime)
             
             

            return {
              ...deck,
              cardsForStudy,
              cardsReviewed,
              nextReviewTimeRemaining
            };
          });
        };

        const enrichedDecks = processDecks(allCards, allDecks);
        enrichedDecks.sort((a, b) => (a.cardsForStudy || 0) - (b.cardsForStudy || 0));
        setDecks(enrichedDecks);

        const intervalId = setInterval(() => {
          setDecks(prevDecks =>
            processDecks(
              allCards,
              prevDecks.map(deck => ({
                ...deck,
                cards_id: allCards
                  .filter(card => card.deckId === deck._id)
                  .map(card => card._id)
              }))
            )
          );
        }, 1000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDecksAndCards();
  }, []);

  const DeckTile: React.FC<{ deck: Deck }> = ({ deck }) => {
    const textRef = useRef<HTMLParagraphElement>(null);

    return (
      <Link
        to={`/decks/${deck._id}/cards`}
        className="flex flex-col items-start gap-2 rounded-2xl p-4 shadow-sm border h-36"
        style={{
          borderColor: 'black',
          backgroundColor: deck.color || '#ffffff',
          borderWidth: '3px',
          margin: '1rem',
          borderRadius: '1rem'
        }}
      >
        <div className="flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-10">
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 129.95091 98.160416"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(-391.46039,-42.28928)">
              <path
                style={{ fill: deck.color || 'currentColor' }}
                d="m 458.50484,139.98079 c -0.30635,-0.25143 -6.49275,-7.54136 -13.74756,-16.19985 -7.25481,-8.65849 -14.4158,-17.20076 -15.91332,-18.98283 l -2.72275,-3.24011 v -0.81217 c 0,-1.316141 0.16966,-1.485788 8.39411,-8.393591 4.33277,-3.639139 17.75528,-14.903762 29.82781,-25.032496 l 21.95005,-18.41588 h 1.00644 1.00644 l 0.89867,0.859896 c 1.414,1.352987 31.41274,37.239018 31.83153,38.078506 l 0.37507,0.751848 -0.28891,0.875409 -0.28891,0.87541 -28.34992,23.795608 c -15.59246,13.08758 -29.05249,24.36116 -29.91118,25.05238 l -1.56125,1.25677 -0.97466,-0.006 -0.97467,-0.006 z m -39.52738,-8.2722 c -11.13234,-4.06663 -21.60913,-7.8948 -23.28175,-8.50704 -1.67261,-0.61225 -3.30972,-1.38178 -3.63802,-1.71007 l -0.5969,-0.5969 -1.8e-4,-0.87192 -1.9e-4,-0.87193 13.12309,-36.115619 c 14.18257,-39.031416 13.43285,-37.122658 14.75215,-37.558067 l 0.90611,-0.299043 6.38353,2.299792 6.38354,2.299791 -0.35784,0.555327 c -0.19681,0.30543 -8.19911,14.128451 -17.78289,30.717825 l -17.42506,30.162494 -0.009,0.99312 -0.009,0.99311 0.78773,0.75896 c 0.59436,0.57265 22.23852,13.2054 41.73034,24.35619 0.92544,0.52943 0.92604,0.81545 0.002,0.8 -0.40018,-0.007 -9.83589,-3.3394 -20.96823,-7.40602 z m 33.20521,6.35063 c -0.59054,-0.23672 -37.49251,-31.12404 -38.43073,-32.16691 l -0.59531,-0.66171 v -0.90099 -0.90099 l 1.14054,-1.39936 c 7.06516,-8.668382 48.79685,-58.135532 49.33669,-58.481816 0.3958,-0.253896 1.03908,-0.462255 1.42951,-0.463021 l 0.70988,-0.0014 1.72102,1.389062 c 3.57922,2.888835 9.6587,8.009428 9.67478,8.148815 0.009,0.07984 -11.97017,10.200155 -26.62083,22.489582 -14.65067,12.289427 -27.03317,22.715659 -27.51667,23.169404 l -0.87909,0.824991 v 1.082943 1.08294 l 1.24478,1.53165 c 1.04794,1.28945 27.93772,33.41477 29.13243,34.80462 0.48748,0.5671 0.35861,0.73503 -0.347,0.45218 z m -28.53461,-12.493 -21.65545,-12.5009 -0.39642,-0.75978 c -0.21804,-0.41788 -0.34763,-1.07272 -0.28798,-1.45521 0.14912,-0.9562 38.42481,-67.22451 39.25611,-67.965738 l 0.66765,-0.595312 h 0.81643 0.81644 l 5.90486,3.373437 c 3.24768,1.855391 5.87997,3.451153 5.84954,3.546138 -0.0304,0.09498 -10.1161,12.159859 -22.41261,26.810832 -23.73746,28.282563 -23,27.366223 -23,28.578963 0,1.34321 0.30338,1.63141 12.41666,11.79501 28.96767,24.3052 25.98721,21.67519 24.56215,21.67412 l -0.88194,-6.6e-4 z"
              />
            </g>
          </svg>
        </div>
        <p
          ref={textRef}
          className="text-white font-bold leading-normal truncate w-full text-xl"
        >
          {deck.name}
        </p>

        <div className="flex flex-col items-start p-4 w-full">
          {/* Renderizado condicional: si hay cartas para estudiar, muestra el número en rojo; de lo contrario, muestra el tiempo para el próximo repaso. */}
          {deck.cardsForStudy && deck.cardsForStudy > 0 ? (
            <p className="text-white text-sm" style={{ color: 'red' }}>{deck.cardsForStudy} cards for study</p>
          ) : (
            <p className="text-white text-sm">{deck.reviewTime}</p>
          )}
          {/* Muestra el número de cartas ya revisadas en el mazo. */}
          <p className="text-white text-sm">{deck.cardsReviewed || 0} cards reviewed</p>
        </div>
      </Link>
    );
  };

  const renderContent = () => (
    <div className="p-4 grid grid-cols-3 gap-x-8 gap-y-4">
      {decks.map(deck => (
        <DeckTile key={deck._id} deck={deck} />
      ))}
    </div>
  );

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <NavigationBar activePage="study" />
      <div className="pt-20" style={{ marginTop: '6rem' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Study;
