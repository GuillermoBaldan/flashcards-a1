import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';

const AddDeck: React.FC = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff'); // Default color white
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assuming a userId is available, e.g., from context or local storage
      const userId = '65261803734d010c7c8b824c'; // Placeholder userId, replace with actual user ID logic
      await axios.post('http://localhost:5000/decks/add', { name, color, userId });
      navigate('/decks'); // Navigate back to decks page after successful creation
    } catch (error) {
      console.error('Error creating deck:', error);
      alert('Error creating deck. Please try again.');
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <NavigationBar activePage="decks" />
      <div className="pt-20 p-4">
        <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] text-center mb-4">Add New Deck</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Deck Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Deck Color:</label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Deck
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDeck;