export function generateOrderNumber() {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  const rand = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

  return `ORD-${y}${m}${d}${hh}${mm}-${rand}`;
}
