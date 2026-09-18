/**
 * Formats a date string, timestamp, or Date object into "DD Month YYYY" format (e.g., "17 September 2026").
 */
export function formatListingDate(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return typeof dateInput === 'string' ? dateInput : '';
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
