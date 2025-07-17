import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Decks from './pages/Decks';
import CardsInDeck from './pages/CardsInDeck';
import EditCard from './pages/EditCard';
import Study from './pages/Study'; // Importa el componente Study
import QuestionAnswer from './pages/QuestionAnswer'; // Importa el nuevo componente QuestionAnswer
import SelectionTest from './pages/selectionTest';
import TestCards from './pages/TestTypes';
import CardsOfDeck from './pages/CardsOfDeck';
import AddCard from './components/addCard'; // Importa el nuevo componente AddCard
import TestTop1 from './pages/TestTop1'; // Importa el nuevo componente TestTop1
import TestTop5 from './pages/TestTop5'; // Importa el nuevo componente TestTop5
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/decks" element={<Decks />} />
        <Route path="/decks/:deckId/study" element={<QuestionAnswer />} /> {/* La nueva ruta para el estudio de cartas del mazo */}
        <Route path="/selectionTest" element={<SelectionTest />} />
        <Route path="/test-decks" element={<QuestionAnswer />} />
        <Route path="/test-types-cards" element={<TestCards />} />
        <Route path="/decks/:deckId/cards" element={<CardsOfDeck />} />
        <Route path="/decks/:deckId/add-card" element={<AddCard />} /> {/* Nueva ruta para añadir cartas */}
        <Route path="/edit-card/:cardId" element={<EditCard />} />
        <Route path="/study" element={<Study />} /> {/* La ruta para mostrar los mazos */}
        <Route path="/test-top5-percent" element={<TestTop5 />} />
        <Route path="/test-top1-percent" element={<TestTop1 />} /> {/* Nueva ruta para el test del top 1% */}
        <Route path="/" element={<Decks />} />
      </Routes>
    </Router>
  );
}

export default App;