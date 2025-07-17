import React, { useEffect, useState } from 'react';
import { calculateReviewTimes } from '../utils/manageTimes';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // Importa ReactMarkdown
import remarkGfm from 'remark-gfm'; // Importa remarkGfm para soporte de tablas, etc.
import { htmlToMarkdown } from '../utils/htmlToMarkdown'; // Importa la función de conversión
import { formatDateToLocaleString } from '../utils/formatDateToLocaleString'; // Importa la nueva función
import ReturnStudyViewButton from '../components/returnStudyViewButton';
import '../App.css'; // Asegúrate de que App.css esté importado para las animaciones

// Función para formatear un timestamp a dd:hh:mm:ss
const formatTimestampToDHMS = (ms: number): string => {
  if (ms <= 0) return '00:00:00:00';

  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deckName, setDeckName] = useState<string>('');
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const deckResponse = await axios.get<Deck>(`http://localhost:5000/decks/${deckId}`);
        setDeckName(deckResponse.data.name);

        const cardsResponse = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
        const allCards = cardsResponse.data.map((card: Card) => ({
          ...card,
          lastReview: card.lastReview ? card.lastReview * 1000 : null, // Convertir a milisegundos o null
          nextReview: card.nextReview ? card.nextReview * 1000 : null, // Convertir a milisegundos o null
        }));
        const currentTime = Date.now();

        const cardsForStudy = allCards.filter(card => card.nextReview !== null && card.nextReview < currentTime);

        cardsForStudy.sort((a, b) => {
          const diffA = currentTime - (a.nextReview !== null ? a.nextReview : currentTime);
          const diffB = currentTime - (b.nextReview !== null ? b.nextReview : currentTime);
          return diffB - diffA;
        });

        setCards(cardsForStudy);
        //Tenemos que añadir las cartas vírgenes, es decir las que tienen lastReview y nextReview a null
        const cardsWithNullReview = allCards.filter(card => card.lastReview === null && card.nextReview === null);
        setCards(prevCards => [...prevCards, ...cardsWithNullReview]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    if (deckId) {
      fetchData();
    }
  }, [deckId]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return;

    const { newNextReview, newLastReview } = calculateReviewTimes(
      currentCard.lastReview || Date.now(), // Use current time if lastReview is null
      currentCard.nextReview || Date.now(), // Use current time if nextReview is null
      correct
    );

    axios.put(`http://localhost:5000/cards/${currentCard._id}`, {
      ...currentCard,
      lastReview: Math.floor(newLastReview / 1000), // Convertir a segundos para guardar en la base de datos
      nextReview: Math.floor(newNextReview / 1000), // Convertir a segundos para guardar en la base de datos
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
      navigate('/study');
    }, 2000); // Muestra el mensaje por 2 segundos antes de navegar
  }
    })
    .catch(err => {
      console.error('Error updating card:', err);
      setError('Error al actualizar la carta.');
    });
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando cartas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="mb-4">No hay cartas para estudiar en este mazo.</p>
        <button
          onClick={() => navigate(`/decks/${deckId}/add-card`)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Añadir Carta
        </button>
        <ReturnStudyViewButton />
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Estudiando: {deckName}</h1>
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

export default QuestionAnswer;