import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
}

interface MoveCardModalProps {
  currentCard: Card;
  onClose: () => void;
  onCardMoved: () => void;
}

const MoveCardModal: React.FC<MoveCardModalProps> = ({ currentCard, onClose, onCardMoved }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get<Deck[]>('http://localhost:5000/decks');
        setDecks(response.data.filter(deck => deck._id !== currentCard.deckId)); // Exclude current deck
        setLoading(false);
      } catch (err) {
        console.error('Error fetching decks:', err);
        setError('Error al cargar los mazos.');
        setLoading(false);
      }
    };
    fetchDecks();
  }, [currentCard.deckId]);

  const handleMoveCard = async () => {
    if (!selectedDeck) {
      alert('Por favor, selecciona un mazo.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/cards/${currentCard._id}`, {
        deckId: selectedDeck,
        front: currentCard.front,
        back: currentCard.back,
      });
      onCardMoved();
    } catch (err) {
      console.error('Error moving card:', err);
      setError('Error al mover la carta.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          Cargando mazos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center text-red-500">
          {error}
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Mover Carta</h2>
        <p className="mb-4">Mover "{currentCard.front}" a:</p>
        <select
          value={selectedDeck}
          onChange={(e) => setSelectedDeck(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">Selecciona un mazo</option>
          {decks.map((deck) => (
            <option key={deck._id} value={deck._id}>
              {deck.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleMoveCard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedDeck}
          >
            Mover
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveCardModal;