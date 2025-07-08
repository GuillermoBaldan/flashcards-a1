import express from 'express';
import Deck from '../models/deck.model.js';

const router = express.Router();

// Get all decks
router.route('/').get(async (req, res) => {
  console.log('Solicitud recibida para obtener todos los mazos');
  try {
    const decks = await Deck.find();
    res.json(decks);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add a new deck
router.route('/add').post(async (req, res) => {
  const { name, color, cards_id, userId, firstCardNextReview } = req.body;
  const newDeck = new Deck({ name, color, cards_id, userId, firstCardNextReview });

  try {
    await newDeck.save();
    res.json('Deck added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get a specific deck by ID
router.route('/:id').get(async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    res.json(deck);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete a deck
router.route('/:id').delete(async (req, res) => {
  try {
    await Deck.findByIdAndDelete(req.params.id);
    res.json('Deck deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update a deck
router.route('/update/:id').post(async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (deck) {
      deck.name = req.body.name || deck.name;
      deck.color = req.body.color || deck.color;
      deck.cards_id = req.body.cards_id || deck.cards_id;
      deck.userId = req.body.userId || deck.userId;
      deck.firstCardNextReview = req.body.firstCardNextReview || deck.firstCardNextReview;
      await deck.save();
      res.json('Deck updated!');
    } else {
      res.status(404).json('Deck not found.');
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

export default router; 