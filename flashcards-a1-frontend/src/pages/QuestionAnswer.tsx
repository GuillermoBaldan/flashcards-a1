import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReturnStudyViewButton from '../components/returnStudyViewButton';
import TestBox from '../components/testBox';
import NavigationBar from '../components/NavigationBar';
import MoveCardModal from '../components/MoveCardModal';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  lastReview: number | null;
  nextReview: number | null;
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
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deckName, setDeckName] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveCardModal, setShowMoveCardModal] = useState(false);
  const [currentCardInView, setCurrentCardInView] = useState<Card | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const deckResponse = await axios.get<Deck>(`http://localhost:5000/decks/${deckId}`);
      setDeckName(deckResponse.data.name);

      const cardsResponse = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
      const allCards = cardsResponse.data.map((card: Card) => ({
        ...card,
        lastReview: card.lastReview,
        nextReview: card.nextReview,
      }));
      const currentTime = Math.floor(Date.now() / 1000);

      const cardsForStudy = allCards.filter(card => card.nextReview !== null && card.nextReview < currentTime);

      cardsForStudy.sort((a, b) => {
        const diffA = currentTime - (a.nextReview ?? currentTime);
        const diffB = currentTime - (b.nextReview ?? currentTime);
        return diffB - diffA;
      });

      setCards(cardsForStudy);
      const cardsWithNullReview = allCards.filter(card => card.lastReview === null && card.nextReview === null);
      setCards(prevCards => [...prevCards, ...cardsWithNullReview]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [deckId, setDeckName, setCards, setLoading, setError]);

  useEffect(() => {
    if (deckId) {
      fetchData();
    }
  }, [deckId, fetchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCardsDepleted = () => {
    navigate('/study');
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditCard = () => {
    if (currentCardInView) {
      navigate(`/edit-card/${currentCardInView._id}`);
      setShowMenu(false);
    }
  };

  const handleMoveCard = () => {
    if (currentCardInView) {
      setShowMoveCardModal(true);
      setShowMenu(false);
    }
  };

  const handleCloseMoveCardModal = () => {
    setShowMoveCardModal(false);
    // No need to refresh cards here, as the TestBox will handle the next card
  };

  const handleCardMoved = (movedCard: Card) => {
    setCards(prevCards => prevCards.filter(card => card._id !== movedCard._id));
    const updatedCard = { ...movedCard, nextReview: Math.floor(Date.now() / 1000) };
    setCards(prevCards => [updatedCard, ...prevCards]);
    navigate('/study');
  };


  if (loading) {
    return <div className="text-center mt-8">Cargando cartas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (cards.length === 0) {
    return (
    <>
      <NavigationBar activePage="study" />
      <div className="app-content text-center mt-8">
        <p className="mb-4">No hay cartas para estudiar en este mazo.</p>
        <button
          onClick={() => navigate(`/decks/${deckId}/add-card`)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Añadir Carta
        </button>
        <ReturnStudyViewButton />
      </div>
    </>
  );
  }

  return (
    <>
      <NavigationBar activePage="study" />
      <div className="app-content">
        <div className="relative flex justify-end p-4">
          <button
            className="p-2 focus:outline-none z-20"
            onClick={handleMenuClick}
            aria-label="Opciones de la tarjeta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-more-vertical"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {showMenu && currentCardInView && (
            <div
              ref={menuRef}
              className="absolute top-10 right-4 bg-white rounded-md shadow-lg z-30"
            >
              <ul className="py-1" style={{ margin: '0', padding: '0', listStyle: 'none'}}>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleMoveCard}
                  >
                    Mover a otro mazo
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleEditCard}
                  >
                    Editar
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <TestBox
          cards={cards}
          onCardsDepleted={handleCardsDepleted}
          onCardChange={setCurrentCardInView}
        />
        {showMoveCardModal && currentCardInView && (
          <MoveCardModal
            currentCard={currentCardInView}
            onClose={handleCloseMoveCardModal}
            onCardMoved={handleCardMoved}
          />
        )}
      </div>
    </>
  );
};

export default QuestionAnswer;