/* Footer.jsx — contact-first footer; no fake newsletter endpoint or invented social profiles. */
import { ArrowUpRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import Brand from '@/components/ui/Brand';
import { business } from '@/lib/data/business';
import { formatEnquiry, whatsappLink } from '@/lib/data/enquiry';
import { footerColumns } from '@/lib/data/footer';

export default function Footer() {
  return (
    <footer className="w-full mt-14 bg-[#f1f2f0] border-t border-[#dfe3df]" id="contact">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand className="footer-brand" />
            <strong>Your road. Your journey.<br />Our commitment.</strong>
            <p>Tyres and practical wheel care from your local team in Mulund West.</p>
          </div>
          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <strong>{column.title}</strong>
              {column.links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
            </div>
          ))}
          <div className="footer-column footer-contact-column max-[720px]:gap-[9px] max-[970px]:col-span-2">
            <strong>Find us</strong>
            <a href={business.mapHref} rel="noopener noreferrer" target="_blank"><MapPin aria-hidden="true" size={15} />Goshala Road, Mulund West</a>
            <a href={business.phoneHref}><Phone aria-hidden="true" size={15} />{business.phoneDisplay}</a>
            <a href={whatsappLink(formatEnquiry())} rel="noopener noreferrer" target="_blank"><MessageCircle aria-hidden="true" size={15} />Ask on WhatsApp</a>
            <span className="footer-fine [font-size:11.5px] [font-weight:600] [line-height:1.4] [color:#66746a] max-[720px]:[font-size:11.5px]">Check current opening hours on Google Maps.</span>
          </div>
          <div className="footer-cta">
            <strong>Ready for the road?</strong>
            <p>Talk to us about the right tyres and care for your vehicle.</p>
            <a aria-label={`Call J.M. Tyre Services at ${business.phoneDisplay}`} className="footer-cta-link [display:flex] [align-items:center] [justify-content:space-between] [gap:18px] [width:100%] [max-width:200px] [height:40px] [padding:0_6px_0_14px] [border-radius:999px] [background:#fff] [color:#243126] [font-size:11.5px] [font-weight:750] [&_svg]:[box-sizing:content-box] [&_svg]:[width:14px] [&_svg]:[height:14px] [&_svg]:[padding:6px] [&_svg]:[border-radius:50%] [&_svg]:[background:#111b14] [&_svg]:[color:#fff]" href={business.phoneHref}>Call the shop <ArrowUpRight aria-hidden="true" size={19} /></a>
            <a className="footer-whatsapp [display:inline-flex] [align-items:center] [gap:3px] [margin-top:10px] [font-size:11px] [line-height:1.25] [font-weight:750] [color:#295b3a] [text-decoration:underline] [text-underline-offset:3px]" href={whatsappLink(formatEnquiry())} rel="noopener noreferrer" target="_blank">Or prepare a WhatsApp message <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
        </div>
        <div className="footer-bottom [&_a:hover]:[text-decoration:underline] [display:flex] [align-items:center] [justify-content:space-between] [padding-top:13px] [border-top:1px_solid_#dfe2de] [color:#576059] [font-size:10.5px] [font-weight:600] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:3px] max-[970px]:[margin-top:18px] max-[720px]:[gap:11px] max-[720px]:[flex-wrap:wrap] max-[720px]:[margin-top:24px] max-[720px]:[font-size:10px]"><span>© {new Date().getFullYear()} J.M. Tyre Services. All rights reserved.</span><span>Made for every journey in Mumbai.</span><a href={business.mapHref} rel="noopener noreferrer" target="_blank">View on Google Maps <ArrowUpRight aria-hidden="true" size={11} /></a></div>
      </div>
    </footer>
  );
}
