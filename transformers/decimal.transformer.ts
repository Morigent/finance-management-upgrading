import type { ValueTransformer } from 'typeorm';

export const decimalTransformer: ValueTransformer = {
  to: (value: number): number => value,
  from: (value: string | number): number => Number(value),
};
