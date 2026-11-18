/* Optional WhatsApp draft after a real database search; it never claims fitment. */

export function formatFinderEnquiry({ type = 'car', make = '', model = '', size = '', brand = '' } = {}) {
  const vehicle = [make.trim(), model.trim()].filter(Boolean).join(' ');
  const lines = [
    'Hello J.M. Tyre Services. I am asking about tyre options.',
    `Vehicle type: ${type === 'bike' ? 'Bike / scooter' : type === 'commercial' ? 'Commercial' : 'Car / SUV'}`,
    `Vehicle: ${vehicle || 'I will share more details in chat'}`,
    `Tyre size: ${size.trim() || 'Not sure; I can send a sidewall photo'}`,
    `Preferred tyre brand: ${brand.trim() || 'No preference'}`,
    'Please confirm suitable fitment, current availability and the total fitted price before I visit.',
  ];
  return lines.join('\n');
}
