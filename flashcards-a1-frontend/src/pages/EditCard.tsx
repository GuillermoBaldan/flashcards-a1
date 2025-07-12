import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import { markdownToHtml } from '../utils/markdownTohtml';
import ReactMarkdown from 'react-markdown';
import RemarkGfm from 'remark-gfm';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  cardType: string;
}

const EditCard: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');
  const [deckId, setDeckId] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(true); // Nuevo estado para controlar el modo de edición/visualización
  const [showFront, setShowFront] = useState<boolean>(true); // Nuevo estado para controlar qué lado se muestra en previsualización

  useEffect(() => {
    if (cardId) {
      axios.get(`http://localhost:5000/cards/${cardId}`)
        .then(response => {
          setFront(htmlToMarkdown(response.data.front));
          setBack(htmlToMarkdown(response.data.back));
          setDeckId(response.data.deckId);
        })
        .catch(error => {
          console.error("Error fetching card:", error);
        });
    }
  }, [cardId]);

  const handleSave = () => {
    const htmlFront = markdownToHtml(front);
    const htmlBack = markdownToHtml(back);

    const cardData = {
      front: htmlFront,
      back: htmlBack,
      deckId: deckId
    };

    if (cardId) {
      axios.put(`http://localhost:5000/cards/update/${cardId}`, cardData)
        .then(res => {
          console.log(res.data);
          navigate(`/decks/${deckId}`);
        })
        .catch(error => {
          console.error("Error updating card:", error);
        });
    } else {
      // This part would be for creating a new card, if this component were also used for it.
      // For now, focusing on edit.
      console.log("No cardId provided, cannot save as new card yet.");
    }
  };

  const handleDelete = () => {
    if (cardId) {
      axios.delete(`http://localhost:5000/cards/${cardId}`)
        .then(res => {
          console.log(res.data);
          navigate(`/decks/${deckId}`);
        })
        .catch(error => {
          console.error("Error deleting card:", error);
        });
    }
  };

  return (
    <div className="relative flex flex-col bg-blue-200 justify-between group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      {/* Contenedor principal del contenido, centrado y con scroll vertical si es necesario */}
      <div className="flex-1 flex flex-col items-center w-full max-w-screen-xl mx-auto overflow-y-auto p-4">

        {/* Cabecera */}
        <div className="flex items-center bg-white pb-2 justify-between w-full">
          <div className="text-[#111418] flex size-12 shrink-0 items-center cursor-pointer" data-icon="X" data-size="24px" data-weight="regular" onClick={() => navigate(`/decks/${deckId}/mosaic`)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
              ></path>
            </svg>
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Edit Card</h2>
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={() => setIsEditing(!isEditing)}
          >
            <span className="truncate">{isEditing ? "Preview" : "Edit"}</span>
          </button>
        </div>

        {/* Sección de contenido: Edición o Previsualización */}
        {isEditing ? (
          <div className="flex flex-row gap-4 justify-center items-start w-full mt-4">
            <label className="flex flex-col w-1/3">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Front</p>
              <textarea
                className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none min-h-[240px] placeholder:text-[#637488] p-4 text-base font-normal leading-normal"
                value={front}
                onChange={(e) => setFront(e.target.value)}
              ></textarea>
            </label>
            <label className="flex flex-col w-1/3">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Back</p>
              <textarea
                className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none min-h-[240px] placeholder:text-[#637488] p-4 text-base font-normal leading-normal"
                value={back}
                onChange={(e) => setBack(e.target.value)}
              ></textarea>
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 w-full mt-4">
            <div className="flex flex-row gap-2">
              <button
                className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${showFront ? 'bg-[#166cce] text-white' : 'bg-[#f0f2f4] text-[#111418]'} p-4`}
                onClick={() => setShowFront(true)}
              >
                <span className="truncate">Anverso</span>
              </button>
              <button
                className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${!showFront ? 'bg-[#166cce] text-white' : 'bg-[#f0f2f4] text-[#111418]'}`}
                onClick={() => setShowFront(false)}
              >
                <span className="truncate">Reverso</span>
              </button>
            </div>
            <div className="bg-[#f0f2f4] rounded-lg p-4 shadow-md w-2/3 min-h-36">
              <ReactMarkdown remarkPlugins={[RemarkGfm]}>
                {showFront ? front : back}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción inferiores */}
      <div className="w-full max-w-screen-xl mx-auto p-4 flex justify-center">
        <div className="flex flex-1 gap-16 flex-wrap px-4 py-3 justify-center">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleDelete}
            style={{ margin: '1rem' }}
          >
            <span className="truncate">Delete</span>
          </button>
          <button
            className="m-16 block flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#166cce] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleSave}
            style={{ margin: '1rem' }}
          >
            <span className="truncate">Save</span>
          </button>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
};

export default EditCard;