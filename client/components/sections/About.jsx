/* About.jsx — text introduction and the screenshot's two photographic vehicle cards. */
import PhotoTile from '@/components/ui/PhotoTile';
import PillLink from '@/components/ui/PillLink';
import SectionTag from '@/components/ui/SectionTag';
import { business } from '@/lib/data/business';

export default function About() {
  return (
    <section className="about-section section-inset [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:24px] [height:410px] [margin-top:32px] max-[720px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[gap:10px] max-[720px]:[height:auto] max-[720px]:[margin-top:22px] [margin-left:16px] [margin-right:16px] max-[720px]:[margin-left:9px] max-[720px]:[margin-right:9px]" id="about">
      <div className="about-copy [display:flex] [flex-direction:column] [align-items:flex-start] [padding:4px_12px_8px_18px] [&_h2]:[margin:12px_0_0] [&_h2]:[font-size:clamp(35px,2.95vw,44px)] [&_h2]:[line-height:.98] [&_h2]:[letter-spacing:-.083em] [&_h2]:[font-weight:800] [&_p]:[max-width:330px] [&_p]:[margin:13px_0_0] [&_p]:[font-size:15px] [&_p]:[line-height:1.25] [&_p]:[letter-spacing:-.035em] [&_p]:[font-weight:550] [&_.pill-button]:[margin-top:auto] max-[720px]:[grid-column:1_/_-1] max-[720px]:[min-height:280px] max-[720px]:[padding:2px_10px_0] max-[720px]:[&_h2]:[font-size:40px] max-[720px]:[&_p]:[max-width:300px] max-[720px]:[&_p]:[font-size:13px] max-[720px]:[&_.pill-button]:[margin-top:18px] max-[375px]:[&_h2]:[font-size:37px]">
        <SectionTag>About J.M. Tyre Services</SectionTag>
        <h2>The right tyres<br />make every<br />journey better.</h2>
        <p>From city streets to weekend detours, we help you find the right tyre, fit and care for your kind of drive.</p>
        <PillLink href="#technology">Discover our approach</PillLink>
      </div>
      <PhotoTile alt="Silver SUV with a new tyre and alloy wheel" className="about-tile [&:nth-child(3)_.photo-tile-image]:[object-position:center_56%] max-[720px]:[height:270px] max-[720px]:[border-radius:15px]" copy="Comfort, control, and everyday reliability." href={business.phoneHref} image="AboutPassenger" title="Passenger Car Tyres" />
      <PhotoTile alt="SUV on a mountain trail" className="about-tile [&:nth-child(3)_.photo-tile-image]:[object-position:center_56%] max-[720px]:[height:270px] max-[720px]:[border-radius:15px]" copy="Built for the commute and the adventure." href={business.phoneHref} image="AboutAdventure" title="SUV & 4×4 Tyres" />
    </section>
  );
}
