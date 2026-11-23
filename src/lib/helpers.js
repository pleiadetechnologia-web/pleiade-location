export function money(value, currency = 'USD') {
  const amount = Number(value || 0);
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
}
export function whatsappUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function listingFingerprint(title, address) {
  return `${(title || '').trim().toLocaleLowerCase()}|${(address || '').trim().toLocaleLowerCase()}`;
}
