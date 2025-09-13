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
import NavigationBar from '../components/NavigationBar';
import MoveCardModal from '../components/MoveCardModal'; // Importar MoveCardModal

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
  const [deckColor, setDeckColor] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<'cards' | 'decks'>('cards');
  const [cardSearchField, setCardSearchField] = useState<'front' | 'back' | 'all'>('all');
  const [showMoveCardModal, setShowMoveCardModal] = useState(false); // Estado para controlar el modal
  const [cardToMove, setCardToMove] = useState<Card | null>(null); // Estado para la carta a mover

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
        setDeckColor(deckResponse.data.color || '#FFFFFF'); // Set deck color, default to white if not found

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

  const handleMoveCardClick = (card: Card) => {
    setCardToMove(card);
    setShowMoveCardModal(true);
  };

  const handleCloseMoveCardModal = () => {
    setShowMoveCardModal(false);
    setCardToMove(null);
  };

  const handleCardMoved = () => {
    handleCloseMoveCardModal();
    fetchCards(); // Refrescar la lista de tarjetas después de mover una
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <NavigationBar activePage="decks" />
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
      </div>
      <div className="w-full max-w-screen-xl gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredCards.length > 0 ? (
          filteredCards.map(card => (
            <CardItem 
              key={card._id} 
              card={card} 
              onCardDeleted={fetchCards} 
              deckColor={deckColor} 
              onMoveCard={handleMoveCardClick} // Pasar la función para mover la carta
            />
          ))
        ) : (
          <div className="text-center mt-8">{cards.length === 0 ? 'No hay cartas en este mazo.' : 'No se encontraron tarjetas que coincidan con la búsqueda.'}</div>
        )}
      </div>
      
      {showMoveCardModal && cardToMove && (
        <MoveCardModal
          currentCard={cardToMove}
          onClose={handleCloseMoveCardModal}
          onCardMoved={handleCardMoved}
        />
      )}
    </div>
  );
};

export default CardsOfDeck;