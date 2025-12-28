// export function generateOrderNumber() {
//   const now = new Date();

//   //  Date ,month+day+year+randomUpperCase 4 symbols

//   const y = now.getFullYear();
//   const m = String(now.getMonth() + 1).padStart(2, '0');
//   const d = String(now.getDate()).padStart(2, '0');

//   const hh = String(now.getHours()).padStart(2, '0');
//   const mm = String(now.getMinutes()).padStart(2, '0');

//   const rand = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

//   return `ORD-${y}${m}${d}${hh}${mm}-${rand}`;
// }

function randomStringUppercase(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function generateOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `ORD-${y}${m}${day}-${randomStringUppercase(4)}`;
}
