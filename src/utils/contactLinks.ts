export const toSriLankanWhatsAppNumber = (rawNumber?: string): string | null => {
  if (!rawNumber) return null;
  const digits = rawNumber.replace(/\D/g, '');
  if (/^0\d{9}$/.test(digits)) return `94${digits.slice(1)}`;
  if (/^94\d{9}$/.test(digits)) return digits;
  return null;
};

export const buildOwnerWhatsAppUrl = (rawNumber: string | undefined, listingTitle: string): string | null => {
  const number = toSriLankanWhatsAppNumber(rawNumber);
  if (!number) return null;
  const message = encodeURIComponent(`Hi, I'm contacting you about your listing on RENTOURA.LK: ${listingTitle}`);
  return `https://wa.me/${number}?text=${message}`;
};
