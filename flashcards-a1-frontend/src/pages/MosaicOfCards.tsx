import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AddCardButton from '../components/addCardButton';
import ReturnDecksViewButton from '../components/returnDecksViewButton';
import CardItem from '../components/CardItem'; // Importar el nuevo componente
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';

// Función para formatear un timestamp a "dd de Mes del YYYY HH:MM"
const formatTimestampToDateTime = (ms: number): string => {
  if (ms <= 0) return 'N/A';

  const date = new Date(ms * 1000); // Multiplicar por 1000 para convertir segundos a milisegundos
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

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      const cardsResponse = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
      setCards(cardsResponse.data);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Error al cargar las tarjetas.');
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const deckResponse = await axios.get(`http://localhost:5000/decks/${deckId}`);
        setDeckName(deckResponse.data.name);

        fetchCards(); // Usar la nueva función para obtener las tarjetas
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
  }, [deckId, fetchCards]);

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
      <div className="fixed top-4 right-8 z-10 flex space-x-4">
        <AddCardButton deckId={deckId} />
        <ReturnDecksViewButton />
      </div>
      <div className="w-full max-w-screen-xl gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {cards.map(card => (
          <CardItem key={card._id} card={card} onCardDeleted={fetchCards} />
        ))}
      </div>
    </div>
  );
};

export default MosaicOfCards;