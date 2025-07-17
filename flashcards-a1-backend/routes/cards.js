import express from 'express';
import Card from '../models/card.model.js';
import Deck from '../models/deck.model.js';
import mongoose from 'mongoose'; // Importa mongoose

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
router.route('/deck/:deckId').get(async (req, res) => { // Revertido a /deck/:deckId
  console.log(`Solicitud recibida para /cards/deck/${req.params.deckId}`);
  try {
    // Ya no es necesario convertir a ObjectId, el campo deckId en el modelo es String
    const cards = await Card.find({ deckId: req.params.deckId });
    console.log(cards)
    res.json(cards);
  } catch (err) {
    console.error(`Error al obtener tarjetas para el mazo ${req.params.deckId}:`, err);
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
      deckId: deckId,
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
router.route('/:id').put(async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card) {
      if (req.body.deckId !== undefined) card.deckId = req.body.deckId;
      if (req.body.front !== undefined) card.front = req.body.front;
      if (req.body.back !== undefined) card.back = req.body.back;
      if (req.body.cardType !== undefined) card.cardType = req.body.cardType;
      if (req.body.lastReview !== undefined) card.lastReview = req.body.lastReview;
      if (req.body.nextReview !== undefined) card.nextReview = req.body.nextReview;
      if (req.body.gameOptions !== undefined) card.gameOptions = req.body.gameOptions;
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