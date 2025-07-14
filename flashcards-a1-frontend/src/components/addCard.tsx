import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import { markdownToHtml } from '../utils/markdownTohtml';

const AddCard: React.FC = () => {
  const { deckId } = useParams<{ deckId: string | undefined }>();
  const navigate = useNavigate();
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');

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
        console.log(res.data);
        navigate(`/decks/${deckId}/mosaic`); // Redirige a la vista de mosaico del mazo
      })
      .catch(error => {
        console.error("Error creating card:", error);
      });
  };

  const handleCancel = () => {
    navigate(`/decks/${deckId}/mosaic`); // Redirige a la vista de mosaico del mazo
  };

  return (
    <div className="relative flex flex-col bg-blue-200 justify-between group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="flex-1 flex flex-col items-center w-full max-w-screen-xl mx-auto overflow-y-auto p-4">
        <div className="flex items-center bg-white pb-2 justify-between w-full">
          <div className="text-[#111418] flex size-12 shrink-0 items-center cursor-pointer" data-icon="X" data-size="24px" data-weight="regular" onClick={handleCancel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
              ></path>
            </svg>
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Add New Card</h2>
        </div>

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
      </div>

      <div className="w-full max-w-screen-xl mx-auto p-4 flex justify-center">
        <div className="flex flex-1 gap-16 flex-wrap px-4 py-3 justify-center">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleCancel}
            style={{ margin: '1rem' }}
          >
            <span className="truncate">Cancel</span>
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

export default AddCard;
