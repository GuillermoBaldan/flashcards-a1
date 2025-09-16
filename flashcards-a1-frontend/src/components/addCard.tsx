import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import { markdownToHtml } from '../utils/markdownTohtml';

const AddCard: React.FC = () => {
  const { deckId } = useParams<{ deckId: string | undefined }>();
  const navigate = useNavigate();
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');
  const [deckTitle, setDeckTitle] = useState<string>('');

  useEffect(() => {
    if (deckId) {
      axios.get(`http://localhost:5000/decks/${deckId}`)
        .then(res => {
          setDeckTitle(res.data.name);
        })
        .catch(error => {
          console.error("Error fetching deck title:", error);
        });
    }
  }, [deckId]);

  const handleSave = () => {
    const htmlFront = markdownToHtml(front);
    const htmlBack = markdownToHtml(back);

    const cardData = {
      front: htmlFront,
      back: htmlBack,
      deckId: deckId
    };

    axios.post(`http://localhost:5000/cards/add`, cardData)
      .then(res => {
        setFront('');
        setBack('');
        navigate(`/decks/${deckId}/add-card`); // Redirige a la vista de añadir tarjeta
      })
      .catch(error => {
        console.error("Error creating card:", error);
      });
  };

  const handleCancel = () => {
    navigate(`/decks/${deckId}/cards`); // Redirige a la vista de tarjetas del mazo
  };

  return (
    <div className="add-card-page">
      <div className="add-card-inner">
        <div className="add-card-header">
          <div className="add-card-close" data-icon="X" data-size="24px" data-weight="regular" onClick={handleCancel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
              ></path>
            </svg>
          </div>
          <h2 className="add-card-title">{deckTitle || 'Add New Card'}</h2>
        </div>

        <div className="add-card-editors">
          <label className="add-card-editor">
            <p className="add-card-label">Front</p>
            <textarea
              className="add-card-textarea"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            ></textarea>
          </label>
          <label className="add-card-editor">
            <p className="add-card-label">Back</p>
            <textarea
              className="add-card-textarea"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            ></textarea>
          </label>
        </div>
      </div>

      <div className="add-card-actions">
        <button
          className="btn btn-cancel"
          onClick={handleCancel}
        >
          <span className="truncate">Cancel</span>
        </button>
        <button
          className="btn btn-save"
          onClick={handleSave}
        >
          <span className="truncate">Save</span>
        </button>
        <div className="actions-spacer"></div>
      </div>
    </div>
  );
};

export default AddCard;
