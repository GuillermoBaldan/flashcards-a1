import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReturnStudyViewButton from '../components/returnStudyViewButton';
import TestBox from '../components/testBox';
import NavigationBar from '../components/NavigationBar';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const deckResponse = await axios.get<Deck>(`http://localhost:5000/decks/${deckId}`);
        setDeckName(deckResponse.data.name);

        const cardsResponse = await axios.get<Card[]>(`http://localhost:5000/cards/deck/${deckId}`);
        const allCards = cardsResponse.data.map((card: Card) => ({
          ...card,
          lastReview: card.lastReview ? card.lastReview * 1000 : null,
          nextReview: card.nextReview ? card.nextReview * 1000 : null,
        }));
        const currentTime = Date.now();

        const cardsForStudy = allCards.filter(card => card.nextReview !== null && card.nextReview < currentTime);

        cardsForStudy.sort((a, b) => {
          const diffA = currentTime - (a.nextReview !== null ? a.nextReview : currentTime);
          const diffB = currentTime - (b.nextReview !== null ? b.nextReview : currentTime);
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
    };

    if (deckId) {
      fetchData();
    }
  }, [deckId]);

  const handleCardsDepleted = () => {
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

  return (
    <>
      <NavigationBar activePage="study" />
      <TestBox
        cards={cards}

        onCardsDepleted={handleCardsDepleted}
      />
    </>
  );
};

export default QuestionAnswer;