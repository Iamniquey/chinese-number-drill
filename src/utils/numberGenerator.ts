import { NUMBER_CATEGORIES } from './numberCategories';
import type { NumberCategory } from '../types/game';
import { formatNumberForTTS } from './chineseNumbers';

export interface GeneratedPrompt {
  category: string;
  number: number;
  phrase: string;
  answer: number;
  ttsText: string;
}

/**
 * Generate a random number within a range
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Select a random category
 */
function selectRandomCategory(): NumberCategory {
  const index = Math.floor(Math.random() * NUMBER_CATEGORIES.length);
  return NUMBER_CATEGORIES[index];
}

/**
 * Format number with zero padding for display
 */
function formatNumberDisplay(num: number, category: NumberCategory): string {
  if (category.format === 'digit-by-digit') {
    if (category.name === 'ticket') {
      // Ticket numbers: 4 digits with zero padding
      return num.toString().padStart(4, '0');
    } else if (category.name === 'phone') {
      // Phone numbers: 11 digits
      return num.toString();
    } else if (category.name === 'room') {
      // Room numbers: as is
      return num.toString();
    }
  }
  return num.toString();
}

/**
 * Generate a random number phrase
 */
export function generateNumberPhrase(): GeneratedPrompt {
  const category = selectRandomCategory();
  const number = randomInt(category.min, category.max);
  const displayNumber = formatNumberDisplay(number, category);
  const phrase = `${displayNumber}${category.suffix}`;
  const ttsText = `${formatNumberForTTS(number, category.format)}${category.suffix}`;
  
  return {
    category: category.name,
    number,
    phrase,
    answer: number,
    ttsText,
  };
}

