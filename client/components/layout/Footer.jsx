/* Footer.jsx — contact-first footer; no fake newsletter endpoint or invented social profiles. */
import { ArrowUpRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import Brand from '@/components/ui/Brand';
import { business } from '@/lib/data/business';
import { formatEnquiry, whatsappLink } from '@/lib/data/enquiry';
import { footerColumns } from '@/lib/data/footer';

export default function Footer() {
  return (
    <footer className="site-footer [min-height:275px] [margin-top:44px] [padding:30px_32px_18px] [border-radius:20px] [background:#f1f2f0] max-[720px]:[margin-top:35px] max-[720px]:[padding:28px_20px_18px] max-[720px]:[border-radius:15px]" id="contact">
      <div className="footer-main [display:grid] [grid-template-columns:1.26fr_.78fr_.78fr_1.25fr_1.13fr] [gap:24px] [min-height:200px] max-[970px]:[grid-template-columns:1.26fr_1fr_1fr] max-[970px]:[min-height:0] max-[970px]:[row-gap:22px] max-[720px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[gap:28px_18px]">
        <div className="footer-brand-block [&_.brand]:[min-width:0] [&_.brand]:[margin-bottom:8px] [&_.brand-mark]:[width:52px] [&_.brand-mark]:[height:39px] [&_.brand-type_strong]:[font-size:21px] [&_.brand-type_small]:[font-size:7px] [&>strong]:[display:block] [&>strong]:[font-size:14px] [&>strong]:[line-height:1.28] [&>strong]:[letter-spacing:-.035em] [&>p]:[max-width:220px] [&>p]:[margin:10px_0_0] [&>p]:[font-size:11.5px] [&>p]:[line-height:1.42] [&>p]:[font-weight:550] max-[720px]:[grid-column:1_/_-1] max-[720px]:[&>p]:[max-width:290px]">
          <Brand className="footer-brand" />
          <strong>Your road. Your journey.<br />Our commitment.</strong>
          <p>Tyres and practical wheel care from your local team in Mulund West.</p>
        </div>
        {footerColumns.map((column) => (
          <div className="footer-column [display:flex] [flex-direction:column] [align-items:flex-start] [gap:8px] [padding-top:8px] [&>strong]:[margin-bottom:7px] [&>strong]:[font-size:14px] [&>strong]:[letter-spacing:-.04em] [&>strong]:[font-weight:800] [&>a]:[font-size:11.5px] [&>a]:[font-weight:600] [&>a]:[line-height:1.4] [&>a:hover]:[text-decoration:underline] max-[720px]:[gap:9px] max-[720px]:[&>a]:[font-size:11.5px]" key={column.title}>
            <strong>{column.title}</strong>
            {column.links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
          </div>
        ))}
        <div className="footer-column footer-contact-column [display:flex] [flex-direction:column] [align-items:flex-start] [gap:8px] [padding-top:8px] [&>strong]:[margin-bottom:7px] [&>strong]:[font-size:14px] [&>strong]:[letter-spacing:-.04em] [&>strong]:[font-weight:800] [&>a]:[font-size:11.5px] [&>a]:[font-weight:600] [&>a]:[line-height:1.4] [&>a:hover]:[text-decoration:underline] max-[720px]:[gap:9px] max-[720px]:[&>a]:[font-size:11.5px] [&>a]:[display:inline-flex] [&>a]:[align-items:flex-start] [&>a]:[gap:6px] [&_svg]:[flex:0_0_auto] [&_svg]:[width:15px] [&_svg]:[height:15px] max-[970px]:[grid-column:span_2]">
          <strong>Find us</strong>
          <a href={business.mapHref} rel="noopener noreferrer" target="_blank"><MapPin aria-hidden="true" size={15} />Goshala Road, Mulund West</a>
          <a href={business.phoneHref}><Phone aria-hidden="true" size={15} />{business.phoneDisplay}</a>
          <a href={whatsappLink(formatEnquiry())} rel="noopener noreferrer" target="_blank"><MessageCircle aria-hidden="true" size={15} />Ask on WhatsApp</a>
          <span className="footer-fine [font-size:11.5px] [font-weight:600] [line-height:1.4] [color:#66746a] max-[720px]:[font-size:11.5px]">Check current opening hours on Google Maps.</span>
        </div>
        <div className="footer-cta [&>strong]:[margin-bottom:7px] [&>strong]:[font-size:14px] [&>strong]:[letter-spacing:-.04em] [&>strong]:[font-weight:800] [display:flex] [flex-direction:column] [align-items:flex-start] [padding-top:8px] [&_p]:[max-width:220px] [&_p]:[margin:3px_0_14px] [&_p]:[font-size:11.5px] [&_p]:[line-height:1.42] [&_p]:[font-weight:600] max-[970px]:[grid-column:3] max-[720px]:[grid-column:1/-1] max-[720px]:[&_p]:[max-width:300px]">
          <strong>Ready for the road?</strong>
          <p>Talk to us about the right tyres and care for your vehicle.</p>
          <a aria-label={`Call J.M. Tyre Services at ${business.phoneDisplay}`} className="footer-cta-link [display:flex] [align-items:center] [justify-content:space-between] [gap:18px] [width:100%] [max-width:200px] [height:40px] [padding:0_6px_0_14px] [border-radius:999px] [background:#fff] [color:#243126] [font-size:11.5px] [font-weight:750] [&_svg]:[box-sizing:content-box] [&_svg]:[width:14px] [&_svg]:[height:14px] [&_svg]:[padding:6px] [&_svg]:[border-radius:50%] [&_svg]:[background:#111b14] [&_svg]:[color:#fff]" href={business.phoneHref}>Call the shop <ArrowUpRight aria-hidden="true" size={19} /></a>
          <a className="footer-whatsapp [display:inline-flex] [align-items:center] [gap:3px] [margin-top:10px] [font-size:11px] [line-height:1.25] [font-weight:750] [color:#295b3a] [text-decoration:underline] [text-underline-offset:3px]" href={whatsappLink(formatEnquiry())} rel="noopener noreferrer" target="_blank">Or prepare a WhatsApp message <ArrowUpRight aria-hidden="true" size={14} /></a>
        </div>
      </div>
      <div className="footer-bottom [&_a:hover]:[text-decoration:underline] [display:flex] [align-items:center] [justify-content:space-between] [padding-top:13px] [border-top:1px_solid_#dfe2de] [color:#576059] [font-size:10.5px] [font-weight:600] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:3px] max-[970px]:[margin-top:18px] max-[720px]:[gap:11px] max-[720px]:[flex-wrap:wrap] max-[720px]:[margin-top:24px] max-[720px]:[font-size:10px]"><span>© {new Date().getFullYear()} J.M. Tyre Services. All rights reserved.</span><span>Made for every journey in Mumbai.</span><a href={business.mapHref} rel="noopener noreferrer" target="_blank">View on Google Maps <ArrowUpRight aria-hidden="true" size={11} /></a></div>
    </footer>
  );
}
