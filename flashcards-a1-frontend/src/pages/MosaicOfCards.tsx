import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';

// Función para formatear un timestamp a "dd de Mes del YYYY HH:MM"
const formatTimestampToDateTime = (ms: number): string => {
  if (ms <= 0) return 'N/A';

  const date = new Date(ms);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('es-ES', options);
};

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  lastReview: number;
  nextReview: number;
}

const MosaicOfCards: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deckName, setDeckName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const deckResponse = await axios.get(`http://localhost:5000/decks/${deckId}`);
        setDeckName(deckResponse.data.name);

        const cardsResponse = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
        setCards(cardsResponse.data);
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

  if (loading) {
    return <div className="text-center mt-8">Cargando cartas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (cards.length === 0) {
    return <div className="text-center mt-8">No hay cartas en este mazo.</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Cartas de: {deckName}</h1>
      <div className="w-full max-w-screen-xl gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {cards.map(card => (
          <div key={card._id} className="bg-white rounded-lg shadow-lg p-6 text-center border-solid border-3 border-black rounded-xl" style={{ height: 'auto', borderRadius: '0.5rem' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {htmlToMarkdown(card.front)}
            </ReactMarkdown>
            <p className="text-sm text-gray-600 mt-2">
              <strong>lastReview:</strong> {formatTimestampToDateTime(card.lastReview)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>nextReview:</strong> {formatTimestampToDateTime(card.nextReview)}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/decks')}
        className="mt-8 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
      >
        Volver a la vista de Mazos
      </button>
    </div>
  );
};

export default MosaicOfCards; 