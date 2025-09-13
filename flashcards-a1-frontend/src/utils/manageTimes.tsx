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
    // Lógica original para fallos
    const lastReviewSec = lastReview ?? currentTime;
    const nextReviewSec = nextReview ?? currentTime;
    let previousInterval = nextReviewSec - lastReviewSec;

    if (lastReview === null || nextReview === null) {
      previousInterval = 24 * 60 * 60; // 1 day initial in seconds
    }

    let multiplier = 0.5;
    let newInterval = previousInterval * multiplier;

    // Minimum interval for failure: 5 minutes in seconds
    newInterval = Math.max(newInterval, 5 * 60);

    const newNextReview = currentTime + Math.floor(newInterval);

    return { newNextReview, newLastReview };
  }
};