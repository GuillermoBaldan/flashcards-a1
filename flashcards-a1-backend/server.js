import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Deck from './models/deck.model.js'; // Importar el modelo Deck
import Card from './models/card.model.js'; // Importar el modelo Card para corregir timestamps

import decksRouter from './routes/decks.js';
import cardsRouter from './routes/cards.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5176', 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:5178'] }));
app.use(express.json());

const uri = process.env.ATLAS_URI || 'mongodb://localhost/Flashcards';
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', async () => {
  console.log('MongoDB database connection established successfully');
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Colecciones encontradas en la base de datos Flashcards:');
    collections.forEach(col => console.log(`- ${col.name}`));

    const decks = await Deck.find();
    if (decks.length > 0) {
      console.log('Mazos encontrados al iniciar el servidor:');
      decks.forEach(deck => {
        console.log(`- ${deck.name}`);
      });
    } else {
      console.log('No se encontraron mazos en la base de datos al iniciar el servidor.');
    }

    // Corregir timestamps de las tarjetas antiguas
    const cards = await Card.find();
    let updatedCount = 0;
    for (const card of cards) {
      let needsUpdate = false;

      if (card.lastReview !== null && card.lastReview < 315532800) {
        card.lastReview = Math.floor(Date.now() / 1000);
        needsUpdate = true;
      }

      if (card.nextReview !== null && card.nextReview < 315532800) {
        card.nextReview = (card.lastReview || Math.floor(Date.now() / 1000)) + (24 * 60 * 60);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await card.save();
        updatedCount++;
      }
    }
    console.log(`Timestamps corregidos en ${updatedCount} tarjetas.`);

  } catch (err) {
    console.error('Error al obtener colecciones/mazos al iniciar el servidor o corrigiendo timestamps:', err);
  }
})

// app.get('/', (req, res) => {
//   res.send('Hello from the backend!');
// });

app.use('/decks', decksRouter);
app.use('/cards', cardsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});