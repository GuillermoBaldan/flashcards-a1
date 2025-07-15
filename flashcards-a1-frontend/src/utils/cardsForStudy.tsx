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
  let minNextReviewTime = cardsInDeck[0].nextReview; //Le damos un valor inicial, por ejemplo la primera carta del mazo
  let maxPassReviewTime = cardsInDeck[0].nextReview; //Le damos un valor inicial, por ejemplo la primera carta del mazo

  cardsInDeck.forEach(card => {
    if (card.nextReview !== null && card.nextReview < currentTime) {
       cardsForStudy++;
       //Calculamos aqui el tiempo de la proxima revisión
       if (card.nextReview !== null && card.nextReview < minNextReviewTime) {
        minNextReviewTime = card.nextReview;
      }
    } else {
      cardsReviewed++;
      //Aqui calculamos tiempo desde que se tenía que haber revisado la carta hasta ahora
        if (card.nextReview!== null && card.nextReview > maxPassReviewTime) {
        maxPassReviewTime = card.nextReview;
      }
    }
  });

  return { cardsForStudy, cardsReviewed, minNextReviewTime, maxPassReviewTime };
};