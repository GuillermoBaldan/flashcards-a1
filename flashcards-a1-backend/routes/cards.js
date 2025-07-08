import express from 'express';
import Card from '../models/card.model.js';
import Deck from '../models/deck.model.js';

const router = express.Router();

// Get all cards (optional: by deck ID)
router.route('/').get(async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get cards by deck ID
router.route('/deck/:deckId').get(async (req, res) => {
  try {
    const cards = await Card.find({ deck: req.params.deckId });
    res.json(cards);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add a new card to a deck
router.route('/add').post(async (req, res) => {
  const { deckId, front, back, cardType, lastReview, nextReview, gameOptions } = req.body;

  try {
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json('Deck not found.');
    }

    const newCard = new Card({
      deck: deckId,
      front,
      back,
      cardType,
      lastReview,
      nextReview,
      gameOptions
    });

    await newCard.save();
    res.json('Card added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get a specific card by ID
router.route('/:id').get(async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    res.json(card);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete a card
router.route('/:id').delete(async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json('Card deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update a card
router.route('/update/:id').post(async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card) {
      card.front = req.body.front;
      card.back = req.body.back;
      card.cardType = req.body.cardType || card.cardType;
      card.lastReview = req.body.lastReview || card.lastReview;
      card.nextReview = req.body.nextReview || card.nextReview;
      card.gameOptions = req.body.gameOptions || card.gameOptions;
      await card.save();
      res.json('Card updated!');
    } else {
      res.status(404).json('Card not found.');
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

export default router; 