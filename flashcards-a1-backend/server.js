import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import decksRouter from './routes/decks.js';
import cardsRouter from './routes/cards.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI || 'mongodb://localhost/flashcards';
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
})

// app.get('/', (req, res) => {
//   res.send('Hello from the backend!');
// });

app.use('/decks', decksRouter);
app.use('/cards', cardsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 