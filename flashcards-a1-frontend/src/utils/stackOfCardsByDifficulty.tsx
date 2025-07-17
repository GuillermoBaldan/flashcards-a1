import axios from 'axios';

interface Card {
  _id: string;
  deckId: string;
  front: string;
  back: string;
  cardType: string;
  lastReview: number;
  nextReview: number;
  gameOptions: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CardWithWordCount extends Card {
  wordCount: number;
}

const countWords = (text: string): number => {
  if (!text) return 0;
  const words = text.trim().split(/\s+/);
  return words.length;
};

export const getStackOfCardsByDifficulty = async (): Promise<CardWithWordCount[]> => {
  try {
    const cardsResponse = await axios.get('http://localhost:5000/cards/');
    const allCards: Card[] = cardsResponse.data;

    const cardsWithWordCount: CardWithWordCount[] = allCards.map(card => ({
      ...card,
      wordCount: countWords(card.back),
    }));

    cardsWithWordCount.sort((a, b) => a.wordCount - b.wordCount);

    return cardsWithWordCount;
  } catch (error) {
    console.error('Error fetching or processing cards:', error);
    return [];
  }
};