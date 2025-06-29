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
}, {
  timestamps: true,
});

const Deck = mongoose.model('Deck', deckSchema);

export default Deck; 