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
  let reviewTime = currentTime;
  

  cardsInDeck.forEach(card => {
    if (card.nextReview === null && card.nextReview < currentTime) {
       cardsForStudy++;
       if (card.nextReview < reviewTime) {
        reviewTime = card.nextReview;
       }
    } else {
      cardsReviewed++;
     
    }
  });

  return { cardsForStudy, cardsReviewed, reviewTime };
};