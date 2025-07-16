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

interface Deck {
  _id: string;
  name: string;
  color: string;
  cards_id: string[];
  userId: string;
  firstCardNextReview: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cardsForStudy?: number;
  cardsReviewed?: number;
  nextReviewTimeRemaining?: string;
}

export const calculateStudyMetrics = (cardsInDeck: Card[], currentTime: number) => {
  let cardsForStudy = 0;
  let cardsReviewed = 0;
  let minNextReview = Infinity;

  cardsInDeck.forEach(card => {
    if (card.nextReview === null || card.nextReview < currentTime) {
      cardsForStudy++;
    } else {
      cardsReviewed++;
      if (card.nextReview < minNextReview) {
        minNextReview = card.nextReview;
      }
    }
  });

  const reviewTime = (minNextReview === Infinity) ? currentTime : minNextReview;

  return { cardsForStudy, cardsReviewed, reviewTime };
};