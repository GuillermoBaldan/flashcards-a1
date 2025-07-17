import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AddCardButton from '../components/addCardButton';
import ReturnDecksViewButton from '../components/returnDecksViewButton';
import ReturnStudyViewButton from '../components/returnStudyViewButton';
import CardItem from '../components/CardItem'; // Importar el nuevo componente
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import SearchBar from '../components/searchBar.tsx';

// Función para formatear un timestamp a "dd de Mes del YYYY HH:MM"
const formatTimestampToDateTime = (ms: number | null): string => {
  if (ms === null || ms <= 0) return 'N/A';

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
  lastReview: number | null;
  nextReview: number | null;
}

const CardsOfDeck: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deckName, setDeckName] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<'cards' | 'decks'>('cards');
  const [cardSearchField, setCardSearchField] = useState<'front' | 'back' | 'all'>('all');

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

  const filteredCards = cards.filter(card => {
    if (!searchText) return true;

    const frontMatches = card.front.toLowerCase().includes(searchText.toLowerCase());
    const backMatches = card.back.toLowerCase().includes(searchText.toLowerCase());

    if (cardSearchField === 'front') return frontMatches;
    if (cardSearchField === 'back') return backMatches;
    return frontMatches || backMatches;
  });

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
      <SearchBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        cardSearchField={cardSearchField}
        onCardSearchFieldChange={setCardSearchField}
      />
      <div className="fixed top-4 right-8 z-10 flex space-x-4">
        {deckId && <AddCardButton deckId={deckId} />} 
        <ReturnDecksViewButton />
        <ReturnStudyViewButton />
      </div>
      <div className="w-full max-w-screen-xl gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredCards.length > 0 ? (
          filteredCards.map(card => (
          <CardItem key={card._id} card={card} onCardDeleted={fetchCards} />
        ))
        ) : (
          <div className="text-center mt-8">No se encontraron tarjetas que coincidan con la búsqueda.</div>
        )}
      </div>
    </div>
  );
};

export default CardsOfDeck;