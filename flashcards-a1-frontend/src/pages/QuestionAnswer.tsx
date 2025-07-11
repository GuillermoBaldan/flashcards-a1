import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // Importa ReactMarkdown
import remarkGfm from 'remark-gfm'; // Importa remarkGfm para soporte de tablas, etc.
import { htmlToMarkdown } from '../utils/htmlToMarkdown'; // Importa la función de conversión

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
  lastReview: number;
  nextReview: number;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const deckResponse = await axios.get<Deck>(`http://localhost:5000/decks/${deckId}`);
        setDeckName(deckResponse.data.name);

        const cardsResponse = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
        const allCards = cardsResponse.data.map((card: Card) => ({
          ...card,
          lastReview: card.lastReview * 1000,
          nextReview: card.nextReview * 1000,
        }));
        const currentTime = Date.now();

        const cardsForStudy = allCards.filter(card => card.nextReview < currentTime);

        cardsForStudy.sort((a, b) => {
          const diffA = currentTime - a.nextReview;
          const diffB = currentTime - b.nextReview;
          return diffB - diffA;
        });

        setCards(cardsForStudy);
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

    const currentTime = Date.now(); // Obtener la hora actual una vez para consistencia

    console.log("currentCard.lastReview:", currentCard.lastReview);
    console.log("currentTime:", currentTime);

    const newNextReview = correct
      ? (currentCard.nextReview < 10000 // Si nextReview es un valor muy pequeño (prácticamente 0 o no inicializado)
        ? currentTime + (30 * 1000) // Intervalo de 30 segundos para la primera revisión
        : (currentCard.nextReview > currentTime
          ? currentTime + (2 * (currentCard.nextReview - currentTime)) // nextReview > currentTime (carta programada a futuro)
          : currentTime + (2 * (currentTime - currentCard.nextReview)))) // nextReview <= currentTime (carta vencida)
      : currentTime + (5 * 60 * 1000); // Fórmula existente para fallos

    axios.post(`http://localhost:5000/cards/update/${currentCard._id}`, {
      ...currentCard,
      lastReview: Math.floor(currentTime / 1000), // Convertir a segundos para guardar en la base de datos
      nextReview: Math.floor(newNextReview / 1000), // Convertir a segundos para guardar en la base de datos
    })
    .then(() => {
      console.log('Card updated successfully!');
      const remainingCards = cards.filter((_, index) => index !== currentCardIndex);
      setCards(remainingCards);
      setIsFlipped(false);
      setCurrentCardIndex(0);

      if (remainingCards.length === 0) {
        alert("¡Has terminado todas las cartas para estudiar en este mazo!");
        navigate('/study');
      } else {
        setCurrentCardIndex(prevIndex => (prevIndex + 1) % remainingCards.length);
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
    return <div className="text-center mt-8">No hay cartas para estudiar en este mazo.</div>;
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
        <p><strong>lastReview (timestamp):</strong> {currentCard.lastReview}</p>
        <p><strong>lastReview (dd:hh:mm:ss):</strong> {formatTimestampToDHMS(currentCard.lastReview)}</p>
        <p><strong>nextReview (timestamp):</strong> {currentCard.nextReview}</p>
        <p><strong>nextReview (dd:hh:mm:ss):</strong> {formatTimestampToDHMS(currentCard.nextReview)}</p>
        <p>Cartas restantes: {cards.length - 1} de {cards.length}</p>
      </div>
      <button
        onClick={() => navigate('/study')}
        className="mt-8 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
      >
        Volver a la vista de Mazos
      </button>
    </div>
  );
};

export default QuestionAnswer; 