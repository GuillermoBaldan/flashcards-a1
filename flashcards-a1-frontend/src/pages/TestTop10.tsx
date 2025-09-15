import React, { useEffect, useState } from 'react';
import { getStackOfCardsByDifficulty } from '../utils/stackOfCardsByDifficulty';
import TestBox from '../components/testBox';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  cardType: string;
  lastReview: number | null;
  nextReview: number | null;
  gameOptions: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const TestTop10: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const allCards = await getStackOfCardsByDifficulty();
        const currentTime = Date.now();

        const cardsForStudy = allCards.filter(card => card.nextReview !== null && card.nextReview * 1000 < currentTime);

        cardsForStudy.sort((a, b) => {
          const diffA = currentTime - (a.nextReview !== null ? a.nextReview * 1000 : currentTime);
          const diffB = currentTime - (b.nextReview !== null ? b.nextReview * 1000 : currentTime);
          return diffB - diffA;
        });

        const top10Percent = Math.ceil(cardsForStudy.length * 0.1);
        const easyCards = cardsForStudy.slice(0, top10Percent);
        setCards(easyCards);
      } catch (err) {
        setError('Error al cargar las tarjetas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleCardsDepleted = () => {
    navigate('/study/recent-decks'); // Navigate back to study page or wherever appropriate
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando tarjetas...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4" style={{ top: 'rem'}}>
        <h1 className="text-3xl font-bold mb-8">Test del Top 10% de Preguntas Más Fáciles</h1>
        <p>No hay tarjetas disponibles para este test.</p>
      </div>
    );
  }

  return (
    <>
      <NavigationBar activePage="study" />
      <div className="app-content">
        <h1 className="text-3xl font-bold mb-8">Test del Top 10% de Preguntas Más Fáciles</h1>
        <TestBox
           cards={cards}
           onCardsDepleted={handleCardsDepleted}
         />
      </div>
    </>
  );
};

export default TestTop10;