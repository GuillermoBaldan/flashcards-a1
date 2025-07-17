import React, { useEffect, useState } from 'react';
import { getStackOfCardsByDifficulty } from '../utils/stackOfCardsByDifficulty';

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

const TestTop1: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const allCards = await getStackOfCardsByDifficulty();
        // Filtrar el 1% de las tarjetas más fáciles
        const top1Percent = Math.ceil(allCards.length * 0.01);
        const easyCards = allCards.slice(0, top1Percent);
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando tarjetas...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Test del Top 1% de Preguntas Más Fáciles</h1>
      {cards.length === 0 ? (
        <p>No hay tarjetas disponibles para este test.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {cards.map((card) => (
            <div key={card._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-bold">Front: {card.front}</p>
              <p>Back: {card.back}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestTop1;