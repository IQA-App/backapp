export function trimString(value: any) {
  if (typeof value === 'string') {
    // console.log('--- PRINT STRING DTO ---', value);
    return value.trim();
  }
  return value;
}
