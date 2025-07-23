import { cardsForStudy } from '../utils/cardsForStudy';
import { dynamicContrastColor } from '../utils/dynamicContrastColor';
import { dynamicFontSize } from '../utils/dynamicFontSize';
import { formatDateToLocaleString } from '../utils/formatDateToLocaleString';
import { formatTimeRemaining } from '../utils/formatTimeRemaining';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';
import { manageTimes } from '../utils/manageTimes';
import { markdownTohtml } from '../utils/markdownTohtml';
import { resetTime } from '../utils/resetTime';
import { stackOfCardsByDifficulty } from '../utils/stackOfCardsByDifficulty';
import { timeToNextReview } from '../utils/timeToNextReview';

import { calculateStudyMetrics } from '../utils/cardsForStudy';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('cardsForStudy', () => {
  const currentTime = Date.now();

  it('should return 0 for all metrics when no cards are in the deck', () => {
    const cardsInDeck: any[] = [];
    const result = calculateStudyMetrics(cardsInDeck, currentTime);
    expect(result.cardsForStudy).toBe(0);
    expect(result.cardsReviewed).toBe(0);
    expect(result.reviewTime).toBe(currentTime);
  });

  it('should correctly identify all cards as due for study', () => {
    const cardsInDeck = [
      { nextReview: currentTime - 1000 },
      { nextReview: currentTime - 5000 },
      { nextReview: null },
    ] as any[];
    const result = calculateStudyMetrics(cardsInDeck, currentTime);
    expect(result.cardsForStudy).toBe(3);
    expect(result.cardsReviewed).toBe(0);
    expect(result.reviewTime).toBe(currentTime - 5000);
  });

  it('should correctly identify some cards as due and some as reviewed', () => {
    const cardsInDeck = [
      { nextReview: currentTime - 1000 }, // Due
      { nextReview: currentTime + 5000 }, // Reviewed
      { nextReview: null }, // Due
      { nextReview: currentTime + 10000 }, // Reviewed
    ] as any[];
    const result = calculateStudyMetrics(cardsInDeck, currentTime);
    expect(result.cardsForStudy).toBe(2);
    expect(result.cardsReviewed).toBe(2);
    expect(result.reviewTime).toBe(currentTime - 1000);
  });

  it('should correctly identify all cards as reviewed', () => {
    const cardsInDeck = [
      { nextReview: currentTime + 1000 },
      { nextReview: currentTime + 5000 },
    ] as any[];
    const result = calculateStudyMetrics(cardsInDeck, currentTime);
    expect(result.cardsForStudy).toBe(0);
    expect(result.cardsReviewed).toBe(2);
    expect(result.reviewTime).toBe(currentTime + 1000);
  });

  it('should handle cards with null nextReview correctly (due for study)', () => {
    const cardsInDeck = [
      { nextReview: null },
      { nextReview: currentTime + 1000 },
    ] as any[];
    const result = calculateStudyMetrics(cardsInDeck, currentTime);
    expect(result.cardsForStudy).toBe(1);
    expect(result.cardsReviewed).toBe(1);
    expect(result.reviewTime).toBe(currentTime);
  });

  it('should return the earliest overdue time if multiple cards are overdue', () => {
    const cardsInDeck = [
      { nextReview: currentTime - 5000 },
      { nextReview: currentTime - 1000 },
      { nextReview: currentTime - 8000 },
    ] as any[];
    const result = calculateStudyMetrics(cardsInDeck, currentTime);
    expect(result.cardsForStudy).toBe(3);
    expect(result.cardsReviewed).toBe(0);
    expect(result.reviewTime).toBe(currentTime - 8000);
  });

  it('should return the earliest next review time if no cards are overdue', () => {
    const cardsInDeck = [
      { nextReview: currentTime + 5000 },
      { nextReview: currentTime + 1000 },
      { nextReview: currentTime + 8000 },
    ] as any[];
    const result = calculateStudyMetrics(cardsInDeck, currentTime);
    expect(result.cardsForStudy).toBe(0);
    expect(result.cardsReviewed).toBe(3);
    expect(result.reviewTime).toBe(currentTime + 1000);
  });
});

describe('dynamicContrastColor', () => {
  it('should return black for a light background color', () => {
    expect(dynamicContrastColor('#FFFFFF')).toBe('black');
    expect(dynamicContrastColor('#F0F0F0')).toBe('black');
    expect(dynamicContrastColor('#ABCDEF')).toBe('black');
  });

  it('should return white for a dark background color', () => {
    expect(dynamicContrastColor('#000000')).toBe('white');
    expect(dynamicContrastColor('#123456')).toBe('white');
    expect(dynamicContrastColor('#333333')).toBe('white');
  });

  it('should handle 3-digit hex codes', () => {
    expect(dynamicContrastColor('#FFF')).toBe('black');
    expect(dynamicContrastColor('#000')).toBe('white');
    expect(dynamicContrastColor('#123')).toBe('white');
  });

  it('should return black for very bright colors even if white has slightly better contrast', () => {
    // This tests the failsafe condition where backgroundLuminance > 0.8
    expect(dynamicContrastColor('#FFFF00')).toBe('black'); // Yellow
  });

  it('should return black for invalid hex codes (treated as white)', () => {
    expect(dynamicContrastColor('')).toBe('black');
    expect(dynamicContrastColor('invalid')).toBe('black');
    expect(dynamicContrastColor(undefined as any)).toBe('black');
    expect(dynamicContrastColor(null as any)).toBe('black');
  });
});

describe('dynamicFontSize', () => {
  it('should return a dynamic font size', () => {
    // Add your test cases here
  });
});

describe('formatDateToLocaleString', () => {
  it('should format a given timestamp to a locale string (es-ES)', () => {
    const timestamp = 1678886400000; // March 15, 2023 00:00:00 GMT
    const expectedDate = '15 de marzo de 2023 01:00'; // Adjust for local timezone if needed
    expect(formatDateToLocaleString(timestamp)).toBe(expectedDate);
  });

  it('should handle a different timestamp correctly', () => {
    const timestamp = 1672531200000; // January 1, 2023 00:00:00 GMT
    const expectedDate = '1 de enero de 2023 01:00'; // Adjust for local timezone if needed
    expect(formatDateToLocaleString(timestamp)).toBe(expectedDate);
  });

  it('should handle current timestamp correctly', () => {
    const now = Date.now();
    const date = new Date(now);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const expectedDate = date.toLocaleString('es-ES', options);
    expect(formatDateToLocaleString(now)).toBe(expectedDate);
  });
});

describe('formatTimeRemaining', () => {
  it('should return "Ahora mismo" for 0 milliseconds', () => {
    expect(formatTimeRemaining(0)).toBe('Ahora mismo');
  });

  it('should format positive milliseconds correctly (future time)', () => {
    expect(formatTimeRemaining(1000)).toBe('Próximo repaso 1 segundo');
    expect(formatTimeRemaining(60 * 1000)).toBe('Próximo repaso 1 minuto');
    expect(formatTimeRemaining(60 * 60 * 1000)).toBe('Próximo repaso 1 hora');
    expect(formatTimeRemaining(24 * 60 * 60 * 1000)).toBe('Próximo repaso 1 día');
    expect(formatTimeRemaining(2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 4 * 60 * 1000 + 5 * 1000)).toBe('Próximo repaso 2 días, 3 horas, 4 minutos y 5 segundos');
  });

  it('should format negative milliseconds correctly (past time)', () => {
    expect(formatTimeRemaining(-1000)).toBe('Hace 1 segundo');
    expect(formatTimeRemaining(-(60 * 1000))).toBe('Hace 1 minuto');
    expect(formatTimeRemaining(-(60 * 60 * 1000))).toBe('Hace 1 hora');
    expect(formatTimeRemaining(-(24 * 60 * 60 * 1000))).toBe('Hace 1 día');
    expect(formatTimeRemaining(-(2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 4 * 60 * 1000 + 5 * 1000))).toBe('Hace 2 días, 3 horas, 4 minutos y 5 segundos');
  });

  it('should handle combinations of days, hours, minutes, and seconds', () => {
    expect(formatTimeRemaining(61 * 1000)).toBe('Próximo repaso 1 minuto y 1 segundo');
    expect(formatTimeRemaining(3600 * 1000 + 60 * 1000 + 1000)).toBe('Próximo repaso 1 hora, 1 minuto y 1 segundo');
    expect(formatTimeRemaining(24 * 3600 * 1000 + 3600 * 1000 + 60 * 1000 + 1000)).toBe('Próximo repaso 1 día, 1 hora, 1 minuto y 1 segundo');
  });

  it('should not show seconds if other units are present and seconds are zero', () => {
    expect(formatTimeRemaining(60 * 1000)).toBe('Próximo repaso 1 minuto');
    expect(formatTimeRemaining(3600 * 1000)).toBe('Próximo repaso 1 hora');
    expect(formatTimeRemaining(24 * 3600 * 1000)).toBe('Próximo repaso 1 día');
  });

  it('should show seconds if it is the only unit', () => {
    expect(formatTimeRemaining(5 * 1000)).toBe('Próximo repaso 5 segundos');
  });
});

describe('htmlToMarkdown', () => {
  it('should convert basic HTML to Markdown', () => {
    const html = '<p>Hello, <strong>world</strong>!</p>';
    const markdown = htmlToMarkdown(html);
    expect(markdown).toBe('Hello, **world**!');
  });

  it('should handle headings', () => {
    const html = '<h1>Heading 1</h1><h2>Heading 2</h2>';
    const markdown = htmlToMarkdown(html);
    expect(markdown).toBe('# Heading 1\n\n## Heading 2');
  });

  it('should handle lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul><ol><li>Ordered Item 1</li><li>Ordered Item 2</li></ol>';
    const markdown = htmlToMarkdown(html);
    expect(markdown).toBe('* Item 1\n* Item 2\n\n1. Ordered Item 1\n2. Ordered Item 2');
  });

  it('should handle links and images', () => {
    const html = '<a href="https://example.com">Link</a><img src="image.jpg" alt="Alt text">';
    const markdown = htmlToMarkdown(html);
    expect(markdown).toBe('[Link](https://example.com)\n\n![Alt text](image.jpg)');
  });

  it('should handle complex HTML structures', () => {
    const html = '<div><p>Some text with <em>emphasis</em> and a <a href="#">link</a>.</p></div>';
    const markdown = htmlToMarkdown(html);
    expect(markdown).toBe('Some text with *emphasis* and a [link](#).');
  });

  it('should return empty string for empty HTML', () => {
    const html = '';
    const markdown = htmlToMarkdown(html);
    expect(markdown).toBe('');
  });
});

describe('manageTimes', () => {
  const currentTime = Date.now();

  it('should calculate newNextReview and newLastReview correctly for a correct answer', () => {
    const lastReview = currentTime - 10000; // 10 seconds ago
    const nextReview = currentTime + 5000; // 5 seconds from now
    const isCorrect = true;

    const result = manageTimes(lastReview, nextReview, isCorrect);

    expect(result.newLastReview).toBe(currentTime);
    expect(result.newNextReview).toBe(currentTime + 2 * (currentTime - lastReview));
  });

  it('should calculate newNextReview and newLastReview correctly for an incorrect answer', () => {
    const lastReview = currentTime - 10000; // 10 seconds ago
    const nextReview = currentTime + 5000; // 5 seconds from now
    const isCorrect = false;

    const result = manageTimes(lastReview, nextReview, isCorrect);

    expect(result.newLastReview).toBe(currentTime);
    expect(result.newNextReview).toBe(currentTime + 30 * 1000); // 30 seconds from now
  });

  it('should handle initial state where lastReview is 0', () => {
    const lastReview = 0;
    const nextReview = 0;
    const isCorrect = true;

    const result = manageTimes(lastReview, nextReview, isCorrect);

    expect(result.newLastReview).toBe(currentTime);
    expect(result.newNextReview).toBe(currentTime + 2 * currentTime);
  });
});

describe('markdownTohtml', () => {
  it('should convert basic Markdown to HTML', () => {
    const markdown = 'Hello, **world**!';
    const html = markdownToHtml(markdown);
    expect(html).toBe('<p>Hello, <strong>world</strong>!</p>\n');
  });

  it('should handle headings', () => {
    const markdown = '# Heading 1\n\n## Heading 2';
    const html = markdownToHtml(markdown);
    expect(html).toBe('<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n');
  });

  it('should handle lists', () => {
    const markdown = '* Item 1\n* Item 2\n\n1. Ordered Item 1\n2. Ordered Item 2';
    const html = markdownToHtml(markdown);
    expect(html).toBe('<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n</ul>\n<ol>\n<li>Ordered Item 1</li>\n<li>Ordered Item 2</li>\n</ol>\n');
  });

  it('should handle links and images', () => {
    const markdown = '[Link](https://example.com)\n\n![Alt text](image.jpg)';
    const html = markdownToHtml(markdown);
    expect(html).toBe('<p><a href="https://example.com">Link</a></p>\n<p><img src="image.jpg" alt="Alt text"></p>\n');
  });

  it('should handle complex Markdown structures', () => {
    const markdown = 'Some text with *emphasis* and a [link](#).';
    const html = markdownToHtml(markdown);
    expect(html).toBe('<p>Some text with <em>emphasis</em> and a <a href="#">link</a>.</p>\n');
  });

  it('should return empty string for empty Markdown', () => {
    const markdown = '';
    const html = markdownToHtml(markdown);
    expect(html).toBe('');
  });
});

describe('resetTime', () => {
  it('should set lastReview and nextReview to null', () => {
    const card = {
      lastReview: 123456789,
      nextReview: 987654321,
    };
    resetTime(card as any);
    expect(card.lastReview).toBeNull();
    expect(card.nextReview).toBeNull();
  });

  it('should handle card with already null values', () => {
    const card = {
      lastReview: null,
      nextReview: null,
    };
    resetTime(card as any);
    expect(card.lastReview).toBeNull();
    expect(card.nextReview).toBeNull();
  });
});

import { getStackOfCardsByDifficulty } from '../utils/stackOfCardsByDifficulty';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('stackOfCardsByDifficulty', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  it('should fetch, calculate word count, and sort cards by difficulty', async () => {
    const mockCards = [
      { _id: '1', back: 'This is a short sentence.' }, // 5 words
      { _id: '2', back: 'A very long sentence with many words to test the sorting functionality.' }, // 12 words
      { _id: '3', back: 'Medium length.' }, // 2 words
      { _id: '4', back: 'One.' }, // 1 word
      { _id: '5', back: '' }, // 0 words
      { _id: '6', back: '  leading and trailing spaces  ' }, // 4 words
    ] as any[];

    mockedAxios.get.mockResolvedValueOnce({ data: mockCards });

    const result = await getStackOfCardsByDifficulty();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/cards/');
    expect(result.length).toBe(mockCards.length);

    // Check sorting by word count
    expect(result[0].wordCount).toBe(0);
    expect(result[0]._id).toBe('5');
    expect(result[1].wordCount).toBe(1);
    expect(result[1]._id).toBe('4');
    expect(result[2].wordCount).toBe(2);
    expect(result[2]._id).toBe('3');
    expect(result[3].wordCount).toBe(4);
    expect(result[3]._id).toBe('6');
    expect(result[4].wordCount).toBe(5);
    expect(result[4]._id).toBe('1');
    expect(result[5].wordCount).toBe(12);
    expect(result[5]._id).toBe('2');
  });

  it('should return an empty array if fetching cards fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    const result = await getStackOfCardsByDifficulty();
    expect(result).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/cards/');
  });

  it('should handle cards with empty or null back property gracefully', async () => {
    const mockCards = [
      { _id: '1', back: 'Hello' },
      { _id: '2', back: '' },
      { _id: '3', back: null }, // Assuming null is possible, though type says string
      { _id: '4', back: undefined }, // Assuming undefined is possible
    ] as any[];

    mockedAxios.get.mockResolvedValueOnce({ data: mockCards });

    const result = await getStackOfCardsByDifficulty();

    expect(result.find(card => card._id === '1')?.wordCount).toBe(1);
    expect(result.find(card => card._id === '2')?.wordCount).toBe(0);
    expect(result.find(card => card._id === '3')?.wordCount).toBe(0);
    expect(result.find(card => card._id === '4')?.wordCount).toBe(0);
  });
});

describe('timeToNextReview', () => {
  const currentTime = Date.now();

  it('should return Infinity if there are no cards', () => {
    const cards: any[] = [];
    expect(timeToNextReview(cards, currentTime)).toBe(Infinity);
  });

  it('should return the correct time to next review for a single card', () => {
    const cards = [{ nextReview: currentTime + 10000 }] as any[];
    expect(timeToNextReview(cards, currentTime)).toBe(10000);
  });

  it('should return the minimum time to next review for multiple cards', () => {
    const cards = [
      { nextReview: currentTime + 5000 },
      { nextReview: currentTime + 1000 },
      { nextReview: currentTime + 8000 },
    ] as any[];
    expect(timeToNextReview(cards, currentTime)).toBe(1000);
  });

  it('should handle cards with nextReview in the past', () => {
    const cards = [
      { nextReview: currentTime - 5000 },
      { nextReview: currentTime + 1000 },
    ] as any[];
    expect(timeToNextReview(cards, currentTime)).toBe(-5000);
  });

  it('should handle cards with nextReview equal to currentTime', () => {
    const cards = [
      { nextReview: currentTime },
      { nextReview: currentTime + 1000 },
    ] as any[];
    expect(timeToNextReview(cards, currentTime)).toBe(0);
  });
});