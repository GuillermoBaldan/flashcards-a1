import React, { useState, useEffect } from 'react';
import { calculateReviewTimes } from '../utils/manageTimes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import { formatDateToLocaleString } from '../utils/formatDateToLocaleString';
import MoveCardModal from './MoveCardModal';
import TestProgressBar from './testProgressBar';
import '../App.css';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  lastReview: number | null;
  nextReview: number | null;
}

interface TestBoxProps {
  cards: Card[];
  onCardsDepleted: () => void; // Callback when all cards are studied
}

interface Deck {
  _id: string;
  name: string;
}

const TestBox: React.FC<TestBoxProps> = ({ cards: initialCards, onCardsDepleted }) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showMoveCardModal, setShowMoveCardModal] = useState(false);
  const [currentDeckName, setCurrentDeckName] = useState<string>('');

  useEffect(() => {
    setCards(initialCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowCompletionMessage(false);
  }, [initialCards]);

  useEffect(() => {
    const fetchDeckName = async () => {
      if (cards.length > 0) {
        try {
          const response = await axios.get<Deck>(`http://localhost:5000/decks/${cards[currentCardIndex].deckId}`);
          setCurrentDeckName(response.data.name);
        } catch (error) {
          console.error('Error fetching deck name:', error);
          setCurrentDeckName('Mazo Desconocido');
        }
      }
    };

    fetchDeckName();
  }, [cards, currentCardIndex]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    const { newNextReview, newLastReview } = calculateReviewTimes(
      currentCard.lastReview || Date.now(),
      currentCard.nextReview || Date.now(),
      correct
    );

    axios.put(`http://localhost:5000/cards/${currentCard._id}`, {
      ...currentCard,
      lastReview: Math.floor(newLastReview / 1000),
      nextReview: Math.floor(newNextReview / 1000),
    })
    .then(() => {
      console.log('Card updated successfully!');
      setIsFlipped(false);
      if (cards.length > 1) {
        const remainingCards = cards.filter((_, index) => index !== currentCardIndex);
        setCards(remainingCards);
        setCurrentCardIndex(0);
      } else {
        setShowCompletionMessage(true);
        setTimeout(() => {
          onCardsDepleted(); // Call the callback to handle navigation or other logic in parent
        }, 2000);
      }
    })
    .catch(err => {
      console.error('Error updating card:', err);
      // setError('Error al actualizar la carta.'); // Error handling can be passed as prop or handled in parent
    });
  };

  if (cards.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="mb-4">No hay cartas para estudiar en este mazo.</p>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const totalCardsInSession = initialCards.length; // Use initialCards to get the total count for the session

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Estudiando: {currentDeckName}</h1>
      <div className="w-full max-w-md mb-4">
        <TestProgressBar currentCardIndex={totalCardsInSession - cards.length} totalCards={totalCardsInSession} />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center" style={{ minHeight: '200px' }}>
        <div className="text-xl font-semibold mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {isFlipped ? htmlToMarkdown(currentCard.back) : htmlToMarkdown(currentCard.front)}
          </ReactMarkdown>
        </div>
        {!isFlipped && (
          <button
            onClick={handleFlip}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Voltear carta
          </button>
        )}

      {showMoveCardModal && (
        <MoveCardModal
          currentCard={currentCard}
          onClose={() => setShowMoveCardModal(false)}
          onCardMoved={() => {
            setShowMoveCardModal(false);
            if (cards.length > 1) {
              const remainingCards = cards.filter((_, index) => index !== currentCardIndex);
              setCards(remainingCards);
              setCurrentCardIndex(0);
            } else {
              setShowCompletionMessage(true);
              setTimeout(() => {
                onCardsDepleted();
              }, 2000);
            }
          }}
        />
      )}
        {isFlipped && (
          <div className="flex justify-around mt-6">
            <button
              onClick={() => handleAnswer(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Acierto
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Fallo
            </button>
            <button
              onClick={() => setShowMoveCardModal(true)}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none"
            >
              Mover carta
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 text-gray-600">
        <p><strong>Última revisión:</strong> {currentCard.lastReview ? formatDateToLocaleString(currentCard.lastReview) : 'N/A'}</p>
        <p><strong>Próxima revisión:</strong> {currentCard.nextReview ? formatDateToLocaleString(currentCard.nextReview) : 'N/A'}</p>
        <p>Cartas restantes: {cards.length - 1} de {cards.length}</p>
      </div>

      {showCompletionMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center text-2xl font-bold animate-fade-in-out">
            ¡Has terminado todas las cartas para estudiar en este mazo!
          </div>
        </div>
      )}
    </div>
  );
};

export default TestBox;