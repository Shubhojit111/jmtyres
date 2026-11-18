/* services.js — honest, enquiry-led descriptions of publicly listed wheel-care services. */
export const serviceTabs = [
  {
    id: 'fitting',
    label: 'Tyre fitting',
    title: 'Care in every fitting. Confidence in every drive.',
    description: 'New tyres and tubes for all kinds of vehicles, fitted with attention to the details that matter.',
    image: 'WorkshopFitting',
    imageAlt: 'Tyre technician fitting a wheel in a workshop',
    benefitOne: 'The right tyre, properly fitted',
    benefitOneCopy: 'Find the size and tyre that suit your vehicle and the way you drive.',
    benefitTwo: 'Support after the sale',
    benefitTwoCopy: 'A local team you can speak to about fitment and tyre care.',
  },
  {
    id: 'alignment',
    label: 'Alignment',
    title: 'A straighter drive starts here.',
    description: 'Ask the team about wheel alignment when your vehicle pulls, steers unevenly, or wears tyres irregularly.',
    image: 'InspectionWorkshop',
    imageAlt: 'Technician examining the condition of a car tyre',
    benefitOne: 'Checked with care',
    benefitOneCopy: 'Help identify uneven tyre wear and steering concerns.',
    benefitTwo: 'More even tyre wear',
    benefitTwoCopy: 'The right alignment can support a smoother drive.',
  },
  {
    id: 'balancing',
    label: 'Balancing',
    title: 'Small adjustments. A smoother journey.',
    description: 'Wheel balancing and tyre care to help the road feel right, kilometre after kilometre.',
    image: 'WorkshopFitting',
    imageAlt: 'Tyre specialist checking a wheel',
    benefitOne: 'Attention to the details',
    benefitOneCopy: 'Ask about balancing when you feel vibration on the road.',
    benefitTwo: 'Puncture help too',
    benefitTwoCopy: 'Tubeless and tube puncture repairs are also listed services.',
  },
];

export const careOptions = [
  {
    id: 'essentials',
    title: 'Tyre essentials',
    copy: 'Not sure what your tyres need? Ask about wear, pressure and repair options.',
    items: ['Tyre condition questions', 'Puncture repair options', 'Tyre pressure guidance'],
  },
  {
    id: 'fitting-and-care',
    title: 'Fitting & wheel care',
    copy: 'Talk to our team about fitting, alignment and balancing for your vehicle.',
    items: ['New tyres and tubes', 'Alignment enquiry', 'Balancing enquiry'],
  },
];
