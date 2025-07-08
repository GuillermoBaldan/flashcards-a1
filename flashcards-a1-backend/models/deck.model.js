import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const deckSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  color: {
    type: String,
    default: '#FFFFFF' // Default color
  },
  cards_id: [{
    type: Schema.Types.ObjectId,
    ref: 'Card'
  }],
  userId: {
    type: String,
    required: true // Assuming userId is required for a deck
  },
  firstCardNextReview: {
    type: Number,
    default: Date.now // Default to current timestamp
  }
}, {
  timestamps: true,
});

const Deck = mongoose.model('Deck', deckSchema);

export default Deck; 