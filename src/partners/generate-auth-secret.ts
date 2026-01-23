export function generateRandomSixDigitString() {
  // Generate a number between 0 and 999999
  const randomNumber = Math.floor(Math.random() * 1000000);
  // Convert to string and pad with leading zeros to ensure a length of 6
  const randomString = String(randomNumber).padStart(6, '0');
  return randomString;
}
