import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import { formatTimeRemaining } from '../utils/formatTimeRemaining';
import { calculateReviewTimes } from '../utils/manageTimes';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DynamicFontSize from '../components/DynamicFontSize';
import TestProgressBar from '../components/testProgressBar';
import '../styles/pages/ContinuousTest.css'; // Importar el nuevo archivo CSS
import AciertoButton from '../components/AciertoButton';
import FalloButton from '../components/FalloButton';

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
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [progress, setProgress] = useState(0);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [cardsForStudy, setCardsForStudy] = useState<number>(0);
  const [barProgress, setBarProgress] = useState<number>(0);
  const [queue, setQueue] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  const updateDueCardsAndProgress = () => {
    if (allCards.length === 0) return;
  
    const currentTime = Date.now();
  
    // Tarjetas que cumplen nextReview < currentTime y no han sido revisadas correctamente
    const dueCards = allCards.filter(card => card.nextReview * 1000 <= currentTime && !reviewedCards.has(card._id));
  
    // Actualizar cardsForStudy con el número actual de tarjetas vencidas
    setCardsForStudy(dueCards.length);
    
    // Actualizar totalCards si el número actual de tarjetas vencidas es mayor
    if (dueCards.length > totalCards) {
      setTotalCards(dueCards.length);
    }

    // Calcular barProgress
    if (totalCards > 0) {
      const newBarProgress = ((totalCards - dueCards.length) / totalCards) * 100;
      setBarProgress(Math.max(0, newBarProgress));
    } else {
      setBarProgress(0);
    }

    // Ordenar tarjetas por proximidad a currentTime
    dueCards.sort((a, b) => {
      const diffA = Math.abs(a.nextReview * 1000 - currentTime);
      const diffB = Math.abs(b.nextReview * 1000 - currentTime);
      return diffA - diffB;
    });
  
    setQueue(dueCards);
    setCards(dueCards);
  };

  useEffect(() => {
    updateDueCardsAndProgress();
    const interval = setInterval(updateDueCardsAndProgress, 1000);
    return () => clearInterval(interval);
  }, [allCards, reviewedCards, totalCards]);

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
    const fetchAllCards = async () => {
      try {
        const response = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
        setAllCards(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching cards.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchAllCards();
  }, [deckId]);

  useEffect(() => {
    if (!currentCard || !queue.some(c => c._id === currentCard._id)) {
      setCurrentCard(queue[0] || null);
    }
  }, [queue]);

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
    if (!currentCard) return;

    const { newLastReview, newNextReview } = calculateReviewTimes(currentCard.lastReview, currentCard.nextReview, isCorrect);

    try {
      let updatedNextReview = newNextReview;
      if (!isCorrect) {
        // If incorrect, set nextReview to 30 seconds from now
        updatedNextReview = Math.floor(Date.now() / 1000) + 30;
      }

      await axios.put(`http://localhost:5000/cards/${currentCard._id}`, {
        lastReview: newLastReview,
        nextReview: updatedNextReview,
      });

      // Update local allCards with the new review times
      const updatedCard = { ...currentCard, lastReview: newLastReview, nextReview: updatedNextReview };
      setAllCards(prevCards => prevCards.map(card =>
        card._id === currentCard._id ? updatedCard : card
      ));

      let newReviewed = reviewedCards;
      if (isCorrect) {
        newReviewed = new Set(reviewedCards);
        newReviewed.add(currentCard._id);
        setReviewedCards(newReviewed);
      }

      // Compute new dueCards
      const currentTime = Date.now();
      const newDueCards = allCards
        .map(card => card._id === currentCard._id ? updatedCard : card) // Use updated card
        .filter(card => !newReviewed.has(card._id) && card.nextReview * 1000 <= currentTime);

      newDueCards.sort((a, b) => {
        const diffA = Math.abs(a.nextReview * 1000 - currentTime);
        const diffB = Math.abs(b.nextReview * 1000 - currentTime);
        return diffA - diffB;
      });

      setQueue(newDueCards);
      setCards(newDueCards);

      // Set currentCard to the next one
      setCurrentCard(newDueCards[0] || null);

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

  // const totalDue = cards.length + reviewedCards.size;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden">
      <NavigationBar activePage="study" />
      <div className="app-content flex flex-col items-center justify-center flex-grow p-4">
        {queue.length === 0 && !showCompletionMessage ? (
          <p className="text-center mt-8">No hay tarjetas para repasar en este mazo.</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">{currentDeckName} - Test Continuo</h1>
            <p className="text-lg mb-8">Tarjetas restantes: {cardsForStudy}</p>
            <div className="w-full max-w-md mb-4 progress-container">
              <TestProgressBar progress={barProgress} />
              <p className="text-center mt-2">{Math.max(0, totalCards - cardsForStudy)} / {totalCards} tarjetas repasadas</p>
            </div>
            {!currentCard ? (
              <p>Cargando...</p>
            ) : (
              <>
                <div className="card-container bg-gray-100 p-6 rounded-lg shadow-lg w-[83%] min-h-[200px]">
                  <div className={`card ${isFlipped ? 'flipped' : ''}`}>
                    {!isFlipped ? (
                      <div className="card-front">
                        <div className="card-content">
                          <DynamicFontSize text={currentCard.front} />
                        </div>
                      </div>
                    ) : (
                      <div className="card-back">
                        <div className="card-content">
                          <DynamicFontSize text={currentCard.back} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="answer-buttons">
                  {!isFlipped ? (
                     <button onClick={handleFlip} className="custom-button flip-button">
                       Voltear carta
                     </button>
                   ) : (
                     <>
                       <AciertoButton onClick={() => handleAnswer(true)} />
                       <FalloButton onClick={() => handleAnswer(false)} />
                     </>
                   )}
                 </div>
                <div className="mt-4 text-center">
                  <p>Última revisión: {currentCard.lastReview ? new Date(currentCard.lastReview * 1000).toLocaleString() : 'Nunca'}</p>
                  <p>Próxima revisión: {formatTimeRemaining(currentCard.nextReview)}</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ContinuousTest;