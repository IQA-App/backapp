export function parseMaybeJson(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
