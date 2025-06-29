import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  deck: {
    type: Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
}, {
  timestamps: true,
});

const Card = mongoose.model('Card', cardSchema);

export default Card; 