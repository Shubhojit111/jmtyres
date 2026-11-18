/* business.js — verified public listing facts; see the linked source before changing them. */
const callDigits = (process.env.NEXT_PUBLIC_CALL_PHONE || '918336819093').replace(/\D/g, '');
const whatsappDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918336819093').replace(/\D/g, '');
export const business = {
  name: 'J.M. Tyre Services',
  phoneDisplay: callDigits.startsWith('91') && callDigits.length === 12 ? `+91 ${callDigits.slice(2,7)} ${callDigits.slice(7)}` : `+${callDigits}`,
  phoneHref: `tel:+${callDigits}`,
  whatsappNumber: whatsappDigits, // Owner-specified editable number; confirm activation before production.
  mapHref: 'https://maps.app.goo.gl/1z1WpBXi42x3cwCCA',
  address: 'Goshala Rd, opp. Aishwarya Tower, Ramgad Nagar, Ramgadh, Mulund West, Mumbai, Maharashtra 400080',
  area: 'Mulund West, Mumbai',
  rating: '5.0',
  reviewCount: 922,
  verifiedAt: '6 November 2026',
};
