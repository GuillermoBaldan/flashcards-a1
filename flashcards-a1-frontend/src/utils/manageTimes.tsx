export const calculateReviewTimes = (lastReview: number, nextReview: number, isCorrect: boolean) => {
  const currentTime = Date.now();
  let newNextReview = nextReview;
  let newLastReview = currentTime;

  if (isCorrect) {
    // If correct, nextReview is current time + 2 * (current time - lastReview)
    newNextReview = currentTime + 2 * (currentTime - lastReview);
  } else {
    // If incorrect, nextReview is current time + 1 minute (or some small interval)
    // This is a placeholder, you might want a more sophisticated algorithm here
    newNextReview = currentTime + 30 * 1000; // 30 seconds from now
  }

  return { newNextReview, newLastReview };
};