import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

/**
 * Custom decorator to trim leading and trailing spaces from a string property.
 */
export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      console.log('--- PRINT STRING DTO ---', value);
      return value.trim();
    }
    return value;
  });
}
