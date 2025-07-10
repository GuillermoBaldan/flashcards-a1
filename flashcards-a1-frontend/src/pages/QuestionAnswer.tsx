import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAdjustFontSize from '../utils/dynamicFontSize';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  cardType: string;
  lastReview: number;
  nextReview: number;
  gameOptions: any; // Puedes definir una interfaz más detallada si es necesario
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
}

const QuestionAnswer: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchDecksAndCards = async () => {
      try {
        const decksResponse = await axios.get('http://localhost:5000/decks/');
        const cardsResponse = await axios.get('http://localhost:5000/cards/');

        const allDecks: Deck[] = decksResponse.data;
        const allCards: Card[] = cardsResponse.data;

        const currentTime = Date.now();

        const enrichedDecks = allDecks.map(deck => {
          const cardsInDeck = allCards.filter(card => card.deckId === deck._id);
          let cardsForStudy = 0;
          let cardsReviewed = 0;

          cardsInDeck.forEach(card => {
            if (card.nextReview < currentTime) {
              cardsForStudy++;
            } else {
              cardsReviewed++;
            }
          });

          return { ...deck, cardsForStudy, cardsReviewed };
        });

        // Ordenar los mazos por cardsForStudy de menor a mayor
        enrichedDecks.sort((a, b) => (a.cardsForStudy || 0) - (b.cardsForStudy || 0));

        setDecks(enrichedDecks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDecksAndCards();
  }, []);

  const DeckTile: React.FC<{ deck: Deck }> = ({ deck }) => {
    const deckTileRef = useRef<HTMLAnchorElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
      if (deckTileRef.current) {
        setContainerWidth(deckTileRef.current.offsetWidth);
      }
    }, []);

    const { fontSize, textRef } = useAdjustFontSize(deck.name, containerWidth, 32); // Start with a larger initial font size

    return (
    <Link
      to={`/decks/${deck._id}/cards`}
      className="flex flex-col items-start gap-2 rounded-2xl p-4 shadow-sm border h-36 "
      style={{ borderColor: 'black', backgroundColor: deck.color || '#ffffff', borderWidth: '3px', margin: "1rem", borderRadius: '1rem' }}
      ref={deckTileRef}
    >
      <div className="flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-10" >
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 129.95091 98.160416"
          version="1.1"
          id="svg1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="layer1"
            transform="translate(-391.46039,-42.28928)"
          >
            <path
              style={{ fill: deck.color || "currentColor" }}
              d="m 458.50484,139.98079 c -0.30635,-0.25143 -6.49275,-7.54136 -13.74756,-16.19985 -7.25481,-8.65849 -14.4158,-17.20076 -15.91332,-18.98283 l -2.72275,-3.24011 v -0.81217 c 0,-1.316141 0.16966,-1.485788 8.39411,-8.393591 4.33277,-3.639139 17.75528,-14.903762 29.82781,-25.032496 l 21.95005,-18.41588 h 1.00644 1.00644 l 0.89867,0.859896 c 1.414,1.352987 31.41274,37.239018 31.83153,38.078506 l 0.37507,0.751848 -0.28891,0.875409 -0.28891,0.87541 -28.34992,23.795608 c -15.59246,13.08758 -29.05249,24.36116 -29.91118,25.05238 l -1.56125,1.25677 -0.97466,-0.006 -0.97467,-0.006 z m -39.52738,-8.2722 c -11.13234,-4.06663 -21.60913,-7.8948 -23.28175,-8.50704 -1.67261,-0.61225 -3.30972,-1.38178 -3.63802,-1.71007 l -0.5969,-0.5969 -1.8e-4,-0.87192 -1.9e-4,-0.87193 13.12309,-36.115619 c 14.18257,-39.031416 13.43285,-37.122658 14.75215,-37.558067 l 0.90611,-0.299043 6.38353,2.299792 6.38354,2.299791 -0.35784,0.555327 c -0.19681,0.30543 -8.19911,14.128451 -17.78289,30.717825 l -17.42506,30.162494 -0.009,0.99312 -0.009,0.99311 0.78773,0.75896 c 0.59436,0.57265 22.23852,13.2054 41.73034,24.35619 0.92544,0.52943 0.92604,0.81545 0.002,0.8 -0.40018,-0.007 -9.83589,-3.3394 -20.96823,-7.40602 z m 33.20521,6.35063 c -0.59054,-0.23672 -37.49251,-31.12404 -38.43073,-32.16691 l -0.59531,-0.66171 v -0.90099 -0.90099 l 1.14054,-1.39936 c 7.06516,-8.668382 48.79685,-58.135532 49.33669,-58.481816 0.3958,-0.253896 1.03908,-0.462255 1.42951,-0.463021 l 0.70988,-0.0014 1.72102,1.389062 c 3.57922,2.888835 9.6587,8.009428 9.67478,8.148815 0.009,0.07984 -11.97017,10.200155 -26.62083,22.489582 -14.65067,12.289427 -27.03317,22.715659 -27.51667,23.169404 l -0.87909,0.824991 v 1.082943 1.08294 l 1.24478,1.53165 c 1.04794,1.28945 27.93772,33.41477 29.13243,34.80462 0.48748,0.5671 0.35861,0.73503 -0.347,0.45218 z m -28.53461,-12.493 -21.65545,-12.5009 -0.39642,-0.75978 c -0.21804,-0.41788 -0.34763,-1.07272 -0.28798,-1.45521 0.14912,-0.9562 38.42481,-67.22451 39.25611,-67.965738 l 0.66765,-0.595312 h 0.81643 0.81644 l 5.90486,3.373437 c 3.24768,1.855391 5.87997,3.451153 5.84954,3.546138 -0.0304,0.09498 -10.1161,12.159859 -22.41261,26.810832 -23.73746,28.282563 -23,27.366223 -23,28.578963 0,1.34321 0.30338,1.63141 12.41666,11.79501 28.96767,24.3052 25.98721,21.67519 24.56215,21.67412 l -0.88194,-6.6e-4 z"
            />
          </g>
        </svg>
      </div>
      <p ref={textRef} className="text-white font-bold leading-normal truncate w-full" style={{ fontSize: `${fontSize}px` }}>{deck.name}</p>
      <p className="text-white text-sm" style={{ color: 'red'}}>{deck.cardsForStudy || 0} cards for study</p>
      <p className="text-white text-sm">{deck.cardsReviewed || 0} cards reviewed</p>
    </Link>
    );
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div>
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Study</h2>
        </div>
        <div className="p-4 grid grid-cols-3 gap-x-8 gap-y-4">
          {decks.map(deck => (
            <DeckTile key={deck._id} deck={deck} />
          ))}
        </div>
      </div>
      <div>
        <div className="flex gap-2 border-t border-[#f0f2f4] bg-white px-4 pb-3 pt-2">
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637488]" to="/">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="House" data-size="24px" data-weight="fill">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"
                ></path>
              </svg>
            </div>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-[#111418]" to="/study">
            <div className="text-[#111418] flex h-8 items-center justify-center" data-icon="Cards" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M184,72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V88A16,16,0,0,0,184,72Zm0,128H40V88H184V200ZM232,56V176a8,8,0,0,1-16,0V56H64a8,8,0,0,1,0-16H216A16,16,0,0,1,232,56Z"
                ></path>
              </svg>
            </div>
          </Link>
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637488]" href="#">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="Plus" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
              </svg>
            </div>
          </a>
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637488]" href="#">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="ChartLine" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"
                ></path>
              </svg>
            </div>
          </a>
          <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#637488]" href="#">
            <div className="text-[#637488] flex h-8 items-center justify-center" data-icon="Gear" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"
                ></path>
              </svg>
            </div>
          </a>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
};

export default QuestionAnswer; 