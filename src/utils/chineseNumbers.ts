// Chinese number characters
const CHINESE_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
// const CHINESE_UNITS = ['', '十', '百', '千', '万'];

/**
 * Convert a single digit (0-9) to Chinese
 */
export function digitToChinese(digit: number): string {
  if (digit < 0 || digit > 9) return '';
  return CHINESE_DIGITS[digit];
}

/**
 * Convert a number to Chinese (regular format)
 * Examples: 1 -> 一, 10 -> 十, 25 -> 二十五, 100 -> 一百
 */
export function numberToChinese(num: number): string {
  if (num === 0) return '零';
  if (num < 0) return '负' + numberToChinese(-num);
  
  if (num < 10) {
    return CHINESE_DIGITS[num];
  }
  
  if (num < 20) {
    return num === 10 ? '十' : '十' + CHINESE_DIGITS[num % 10];
  }
  
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    let result = CHINESE_DIGITS[tens] + '十';
    if (ones > 0) {
      result += CHINESE_DIGITS[ones];
    }
    return result;
  }
  
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    let result = CHINESE_DIGITS[hundreds] + '百';
    if (remainder > 0) {
      if (remainder < 10) {
        result += '零' + CHINESE_DIGITS[remainder];
      } else {
        result += numberToChinese(remainder);
      }
    }
    return result;
  }
  
  if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    let result = CHINESE_DIGITS[thousands] + '千';
    if (remainder > 0) {
      if (remainder < 100) {
        result += '零' + numberToChinese(remainder);
      } else {
        result += numberToChinese(remainder);
      }
    }
    return result;
  }
  
  // For numbers >= 10000, use a simpler approach
  return num.toString().split('').map(d => digitToChinese(parseInt(d))).join('');
}

/**
 * Convert a year to Chinese year format
 * Examples: 2020 -> 二零二零, 1990 -> 一九九零
 */
export function yearToChinese(year: number): string {
  return year.toString().split('').map(d => digitToChinese(parseInt(d))).join('');
}

/**
 * Convert a number to digit-by-digit Chinese
 * Example: 1234 -> 一二三四
 */
export function numberToDigitByDigit(num: number): string {
  return num.toString().split('').map(d => digitToChinese(parseInt(d))).join('');
}

/**
 * Format a number for TTS based on format type
 */
export function formatNumberForTTS(num: number, format: 'year' | 'regular' | 'digit-by-digit'): string {
  switch (format) {
    case 'year':
      return yearToChinese(num);
    case 'digit-by-digit':
      return numberToDigitByDigit(num);
    case 'regular':
    default:
      return numberToChinese(num);
  }
}

