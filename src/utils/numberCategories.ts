import type { NumberCategory } from '../types/game';

export const NUMBER_CATEGORIES: NumberCategory[] = [
  {
    name: 'year',
    suffix: '年',
    min: 1900,
    max: 2026,
    format: 'year',
  },
  {
    name: 'age',
    suffix: '岁',
    min: 1,
    max: 120,
    format: 'regular',
  },
  {
    name: 'ticket',
    suffix: '号',
    min: 0,
    max: 9999,
    format: 'digit-by-digit',
  },
  // Phone numbers commented out - too difficult for now, can be added with difficulty levels later
  // {
  //   name: 'phone',
  //   suffix: '号',
  //   min: 13000000000,
  //   max: 19999999999,
  //   format: 'digit-by-digit',
  // },
  {
    name: 'price',
    suffix: '元',
    min: 1,
    max: 9999,
    format: 'regular',
  },
  {
    name: 'room',
    suffix: '号',
    min: 101,
    max: 9999,
    format: 'digit-by-digit',
  },
  {
    name: 'floor',
    suffix: '层',
    min: 1,
    max: 100,
    format: 'regular',
  },
  {
    name: 'bus',
    suffix: '路',
    min: 1,
    max: 999,
    format: 'regular',
  },
];

