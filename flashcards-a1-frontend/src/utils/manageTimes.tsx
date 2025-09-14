export const calculateReviewTimes = (lastReview: number | null, nextReview: number | null, isCorrect: boolean) => {
  const currentTime = Math.floor(Date.now() / 1000);
  let newLastReview = currentTime;

  if (isCorrect) {
    let newNextReview;
    if (lastReview === null && nextReview === null) {
      newNextReview = currentTime + 30;
    } else {
      const interval = currentTime - (lastReview ?? currentTime);
      newNextReview = currentTime + interval * 2;
    }
    return { newNextReview, newLastReview };
  } else {
    const newNextReview = currentTime + 30;
    return { newNextReview, newLastReview };
  }
};