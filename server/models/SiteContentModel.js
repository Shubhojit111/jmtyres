import { z } from 'zod';
import { text } from '../utils/validation.js';

/** Single document with _id:'home'; preserves existing field names/defaults. */
export const siteContent = db => db.collection('site_content');
export const defaultHome = {
  heroIntroLine1:'Confidence in',heroIntroLine2:'every kilometre.',
  heroLocation:'YOUR LOCAL TYRE EXPERTS · MULUND WEST',
  heroLine1:'Tyres & wheel care.',heroLine2:'Mulund West.',
  heroDescription:'Need new tyres or wheel care? Tell us your vehicle or tyre size. We can check options and fitted pricing before you visit.',
  heroImage:'HeroMountainDrive',
  catalogueHeading:'Explore available tyres',catalogueDescription:'Browse sizes and categories entered by the shop. Check details and request to buy after signing in.',
};
export const contentSchema = z.object({
  heroIntroLine1:text(65),heroIntroLine2:text(65),heroLocation:text(90),heroLine1:text(70),heroLine2:text(70),heroDescription:text(350),
  heroImage:z.string().trim().max(1000).refine(value => /^[a-zA-Z]+$/.test(value) || value.startsWith('/uploads/') || /^https:\/\//.test(value)),
  catalogueHeading:text(90),catalogueDescription:text(300),
}).strict();
