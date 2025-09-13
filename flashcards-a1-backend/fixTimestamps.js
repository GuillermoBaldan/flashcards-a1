const mongoose = require('mongoose');
const Card = require('./models/card.model.js');

const uri = 'mongodb://localhost/Flashcards';

mongoose.connect(uri).then(async () => {
  console.log('Connected to MongoDB');

  try {
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

    console.log(`Timestamps fixed in ${updatedCount} cards.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Connection error:', err);
});