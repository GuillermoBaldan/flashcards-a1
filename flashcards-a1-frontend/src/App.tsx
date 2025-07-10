import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Decks from './pages/Decks'
import CardsInDeck from './pages/CardsInDeck' // Importa el nuevo componente
import EditCard from './pages/EditCard'; // Importa el componente EditCard
import QuestionAnswer from './pages/QuestionAnswer'; // Importa el componente QuestionAnswer
import { useState } from 'react'
import flashcardsData from './mocks/flashcards.json'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/decks" element={<Decks />} />
        <Route path="/decks/:deckId/cards" element={<CardsInDeck />} /> {/* Nueva ruta para CardsInDeck */}
        <Route path="/edit-card/:cardId" element={<EditCard />} /> {/* Nueva ruta para EditCard */}
        <Route path="/study" element={<QuestionAnswer />} /> {/* Nueva ruta para Study */}
        <Route path="/" element={<Decks />} /> {/* Ruta por defecto para mostrar los mazos */}
      </Routes>
    </Router>
  )
}

export default App