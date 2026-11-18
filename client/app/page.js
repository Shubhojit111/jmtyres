/* page.js — the screenshot's top-to-bottom visual blocks, with real JM business content. */
import Hero from '@/components/sections/Hero';
import LocalProof from '@/components/sections/LocalProof';
import TyreFinder from '@/components/sections/TyreFinder';
import About from '@/components/sections/About';
import Engineering from '@/components/sections/Engineering';
import ProductRange from '@/components/sections/ProductRange';
import QuoteEnquiry from '@/components/sections/QuoteEnquiry';
import Confidence from '@/components/sections/Confidence';
import TyreCare from '@/components/sections/TyreCare';
import ServicesGallery from '@/components/sections/ServicesGallery';
import Testimonials from '@/components/sections/Testimonials';
import FeaturedCatalogue from '@/components/catalogue/FeaturedCatalogue';
import BrandMarquees from '@/components/sections/BrandMarquees';
import PracticalGuide from '@/components/sections/PracticalGuide';
import LocationPanel from '@/components/sections/LocationPanel';
import { getHomeContent, getBrands } from '@/lib/backend';
import { business } from '@/lib/data/business';

export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const [content, catalogueBrands] = await Promise.all([getHomeContent(), getBrands()]);
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'TireShop',
    name: business.name,
    telephone: business.phoneDisplay,
    hasMap: business.mapHref,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Goshala Rd, opposite Aishwarya Tower, Ramgad Nagar, Ramgadh',
      addressLocality: 'Mulund West, Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400080',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 19.1683695, longitude: 72.9485972 },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <div className="mx-auto flex w-full max-w-[1640px] flex-col items-center">
        <Hero content={content} />
        <div className="w-full space-y-12 px-0 sm:px-0 lg:space-y-16 lg:px-14">
          <LocalProof />
          <TyreFinder />
          <About />
          <Engineering />
          <ProductRange />
          <FeaturedCatalogue content={content} />
          <BrandMarquees brands={catalogueBrands} />
          <QuoteEnquiry />
          <Confidence />
          <TyreCare />
          <ServicesGallery />
          <Testimonials />
          <PracticalGuide />
          <LocationPanel />
        </div>
      </div>
    </>
  );
}
