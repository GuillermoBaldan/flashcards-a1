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

export const timeToNextReview = (cards: Card[], currentTime: number): number => {
  if (cards.length === 0) {
    return Infinity; // No hay cartas, así que el próximo repaso es infinito
  }
  let minNextReview = cards[0].nextReview;
    for (const card of cards) {
    if (card.nextReview < minNextReview) {
      minNextReview = card.nextReview;
    }
  }

  return minNextReview - currentTime;
};