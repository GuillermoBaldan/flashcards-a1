import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import axios from 'axios';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  lastReview: number;
  nextReview: number;
}

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

interface CardItemProps {
  card: Card;
  onCardDeleted: () => void; // Callback para cuando una tarjeta es eliminada
}

const CardItem: React.FC<CardItemProps> = ({ card, onCardDeleted }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el Link se active
    e.stopPropagation(); // Detiene la propagación del evento
    setShowMenu(!showMenu);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres borrar esta tarjeta?')) {
      try {
        await axios.delete(`http://localhost:5000/cards/${card._id}`);
        console.log('Tarjeta eliminada:', card._id);
        onCardDeleted(); // Llama al callback para que MosaicOfCards actualice la lista
      } catch (error) {
        console.error('Error al borrar la tarjeta:', error);
        alert('Error al borrar la tarjeta.');
      }
    }
    setShowMenu(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-card/${card._id}`);
    setShowMenu(false);
  };

  const handleResetTimes = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Lógica para resetear tiempos
    alert('Funcionalidad "Resetear tiempos" aún no implementada.');
    setShowMenu(false);
  };

  const handleMoveToAnotherDeck = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Lógica para mover a otro mazo
    alert('Funcionalidad "Mover a otro mazo" aún no implementada.');
    setShowMenu(false);
  };

  return (
    <div className="relative rounded-lg shadow-lg p-6 text-center border-solid border-3 border-black rounded-xl" style={{ height: 'auto', borderRadius: '0.5rem' }}>
      {/* Botón de tres puntitos */}
      <button
        className="absolute top-2 p-2  focus:outline-none z-20"
        style={{ right: '0.1rem', width: '3rem', padding: '0', backgroundColor: 'transparent' }}
        onClick={handleMenuClick}
        aria-label="Opciones de la tarjeta"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-more-vertical"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {/* Menú desplegable */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-10 bg-white border border-gray-200 rounded-md shadow-lg z-30"
          style={{ right: '3rem' }}
        >
          <ul className="py-1">
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleMoveToAnotherDeck}
              >
                Mover a otro mazo
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleDelete}
              >
                Borrar
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleEdit}
              >
                Editar
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleResetTimes}
              >
                Resetear tiempos
              </button>
            </li>
          </ul>
        </div>
      )}

      <Link to={`/edit-card/${card._id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div> {/* Contenedor para el contenido principal de la tarjeta */} 
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {htmlToMarkdown(card.front)}
          </ReactMarkdown>
          <p className="text-sm text-gray-600 mt-2">
            <strong>lastReview:</strong> {formatTimestampToDateTime(card.lastReview)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>nextReview:</strong> {formatTimestampToDateTime(card.nextReview)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>ID:</strong> {card._id}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CardItem; 