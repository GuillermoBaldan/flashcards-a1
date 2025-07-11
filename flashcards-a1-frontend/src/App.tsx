import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Decks from './pages/Decks';
import CardsInDeck from './pages/CardsInDeck';
import EditCard from './pages/EditCard';
import Study from './pages/Study'; // Importa el componente Study
import QuestionAnswer from './pages/QuestionAnswer'; // Importa el nuevo componente QuestionAnswer
import MosaicOfCards from './pages/MosaicOfCards';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/decks" element={<Decks />} />
        <Route path="/decks/:deckId/cards" element={<QuestionAnswer />} /> {/* La nueva ruta para el estudio de cartas del mazo */}
        <Route path="/decks/:deckId/mosaic" element={<MosaicOfCards />} />
        <Route path="/edit-card/:cardId" element={<EditCard />} />
        <Route path="/study" element={<Study />} /> {/* La ruta para mostrar los mazos */}
        <Route path="/" element={<Decks />} />
      </Routes>
    </Router>
  );
}

export default App;