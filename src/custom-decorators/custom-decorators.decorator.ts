import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

/**
 * Custom decorator to trim leading and trailing spaces from a string property.
 */
export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
}

//  removes trailing spaces from the json string
export function TrimJsonString() {
  const replacer = (key: string, value: any): any => {
    // If the value is a string, return the trimmed version.
    if (typeof value === 'string') {
      return value.trim();
    }
    // Otherwise, return the original value.
    return value;
  };

  return Transform(({ value }) => {
    try {
      return JSON.stringify(value, replacer);
    } catch {
      return value.trim();
    }
  });
}
