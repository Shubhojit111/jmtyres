/* Locally cached manufacturer marks used for brand identification, not proof of authorisation. */
export const brandLogos = {
  'CEAT': { src: '/brand-logos/ceat.png', width: 300, height: 89 },
  'Continental': { src: '/brand-logos/continental.png', width: 280, height: 165 },
  'Goodyear': { src: '/brand-logos/goodyear.png', width: 460, height: 82, dark: true },
  'JK Tyre': { src: '/brand-logos/jk-tyre.png', width: 165, height: 165 },
  'MRF': { src: '/brand-logos/mrf.png', width: 138, height: 110 },
  'Yokohama': { src: '/brand-logos/yokohama.png', width: 460, height: 64, dark: true },
};

export function brandNote(items) {
  if (!items.length) return 'These marks are illustrative brands you can ask about, not proof of stock, prices or manufacturer authorisation. No catalogue products are listed yet.';
  if (items.every(item => item.count === item.demoCount)) return 'These logos identify brands in fictional DEMO listings only. They do not represent actual J.M. stock, prices or authorised dealerships.';
  if (items.some(item => item.demoCount)) return 'Some products are marked DEMO and are not real stock. Check each listing; a logo does not imply brand authorisation.';
  return 'Logos reflect active catalogue listings, not a guarantee of stock, fitted price or brand authorisation. Confirm with the shop.';
}
