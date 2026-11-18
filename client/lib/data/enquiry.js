/* enquiry.js — a WhatsApp draft, not a website submission, booking, or stock promise. */
import { business } from './business';

export const enquiryTopics = [
  { id: 'new-tyres', label: 'New tyres' },
  { id: 'puncture', label: 'Puncture help' },
  { id: 'alignment', label: 'Wheel alignment' },
  { id: 'balancing', label: 'Wheel balancing' },
];

export function formatEnquiry({ topic = 'new-tyres', vehicle = '', tyreSize = '', quantity = '' } = {}) {
  const service = enquiryTopics.find((item) => item.id === topic)?.label || enquiryTopics[0].label;
  const lines = [
    `Hello J.M. Tyre Services. I would like help with ${service.toLowerCase()}.`,
    `Vehicle: ${vehicle.trim() || 'I will share the details in chat'}`,
    `Tyre size: ${tyreSize.trim() || 'Not sure; I can send a sidewall photo'}`,
  ];
  if (topic === 'new-tyres' && quantity) lines.push(`Number of tyres: ${quantity}`);
  lines.push('Please check the available options and confirm the total price before I visit.');
  return lines.join('\n');
}

export function whatsappLink(message) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
