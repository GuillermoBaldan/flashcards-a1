import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const gameOptionsSchema = new Schema({
  beHonest: { type: Boolean, default: false },
  askFront: { type: Boolean, default: false },
  askSide: { type: Boolean, default: false },
  riddle: { type: Boolean, default: false },
  guessAnswer: { type: Boolean, default: false },
  addIncorrect: { type: Boolean, default: false },
  trueFalse: { type: Boolean, default: false },
  answerFourOptions: { type: Boolean, default: false },
  dailyTest: { type: Boolean, default: false }
}, { _id: false });

const cardSchema = new Schema({
  deckId: {
    type: String,
    ref: 'Deck',
    required: true
  },
  front: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  back: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  cardType: {
    type: String,
    required: true,
    trim: true,
    default: 'classic'
  },
  lastReview: {
    type: Number,
    required: false,
    default: null
  },
  nextReview: {
    type: Number,
    required: false,
    default: null
  },
  gameOptions: gameOptionsSchema
}, {
  timestamps: true,
});

const Card = mongoose.model('Card', cardSchema);

export default Card;