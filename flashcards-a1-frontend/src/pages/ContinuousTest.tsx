import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import { formatTimeRemaining } from '../utils/formatTimeRemaining';
import { calculateReviewTimes } from '../utils/manageTimes';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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

const ContinuousTest: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>(); 
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());
  const [currentDeckName, setCurrentDeckName] = useState<string>('');
  const [showCompletionMessage, setShowCompletionMessage] = useState<boolean>(false);

  const fetchCardsForContinuousTest = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
      const fetchedCards = response.data;

      const currentTime = Date.now();

      // Filter cards that have nextReview < currentTime
      const dueCards = fetchedCards.filter(card => !reviewedCards.has(card._id));

      // Sort cards based on the absolute difference between nextReview and currentTime
      dueCards.sort((a, b) => {
        const diffA = Math.abs(a.nextReview * 1000 - currentTime);
        const diffB = Math.abs(b.nextReview * 1000 - currentTime);
        return diffA - diffB;
      });

      setCards(dueCards);
      setLoading(false);
    } catch (err) {
      setError('Error fetching cards.');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCardsForContinuousTest();

    const interval = setInterval(() => {
      fetchCardsForContinuousTest();
    }, 60000);

    return () => clearInterval(interval);
  }, [deckId, reviewedCards]);

  useEffect(() => {
    const fetchDeckName = async () => {
      if (deckId) {
        try {
          const response = await axios.get(`http://localhost:5000/decks/${deckId}`);
          setCurrentDeckName(response.data.name);
        } catch (error) {
          console.error('Error fetching deck name:', error);
          setCurrentDeckName('Mazo Desconocido');
        }
      }
    };

    fetchDeckName();
  }, [deckId]);

  useEffect(() => {
    if (cards.length === 0 && reviewedCards.size > 0) {
      setShowCompletionMessage(true);
    } else {
      setShowCompletionMessage(false);
    }

    if (currentCardIndex >= cards.length && cards.length > 0) {
      setCurrentCardIndex(0);
    }
  }, [cards, reviewedCards, currentCardIndex]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (cards.length === 0 || currentCardIndex >= cards.length) return;

    const currentCard = cards[currentCardIndex];
    const { lastReview, nextReview } = calculateReviewTimes(isCorrect, currentCard.lastReview, currentCard.nextReview);

    try {
      await axios.put(`http://localhost:5000/cards/${currentCard._id}`, {
        lastReview,
        nextReview,
      });

      setReviewedCards(prev => {
        const newSet = new Set(prev);
        newSet.add(currentCard._id);
        return newSet;
      });

      setIsFlipped(false);
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleFlip = () => setIsFlipped(prev => !prev);

  if (loading) {
    return <div className="text-center mt-8">Cargando tarjetas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  const totalDue = cards.length + reviewedCards.size;
  const progress = totalDue > 0 ? (reviewedCards.size / totalDue) * 100 : 0;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden">
      <NavigationBar activePage="study" />
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        {cards.length === 0 && !showCompletionMessage ? (
          <p className="text-center mt-8">No hay tarjetas para repasar en este mazo.</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">{currentDeckName} - Test Continuo</h1>
            <p className="text-lg mb-8">Tarjetas restantes: {cards.length}</p>
            <div className="w-full max-w-md mb-4">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-center mt-2">{reviewedCards.size} / {totalDue} tarjetas repasadas</p>
            </div>
            {currentCardIndex >= cards.length || !cards[currentCardIndex] ? (
              <p>Cargando...</p>
            ) : (
              <>
                <div className="card-container bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md min-h-[200px]">
                  <div className={`card ${isFlipped ? 'flipped' : ''}`}>
                    <div className="card-front">
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{cards[currentCardIndex].front}</ReactMarkdown>
                    </div>
                    <div className="card-back">
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{cards[currentCardIndex].back}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  {!isFlipped ? (
                    <button onClick={handleFlip} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Voltear carta
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleAnswer(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Acierto
                      </button>
                      <button onClick={() => handleAnswer(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Fallo
                      </button>
                    </>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p>Última revisión: {cards[currentCardIndex].lastReview ? new Date(cards[currentCardIndex].lastReview * 1000).toLocaleString() : 'Nunca'}</p>
                  <p>Próxima revisión: {formatTimeRemaining(cards[currentCardIndex].nextReview)}</p>
                </div>
              </>
            )}
          </>
        )}
        {showCompletionMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">¡Test completado!</h2>
              <p className="mb-4">Has repasado todas las tarjetas debidas de este mazo.</p>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinuousTest;