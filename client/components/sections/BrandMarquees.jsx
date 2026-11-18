'use client';
import { useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import SectionTag from '@/components/ui/SectionTag';
import { brandLogos, brandNote } from '@/lib/data/brandLogos';

function LogoCard({ item, decorative = false }) {
  const mark = brandLogos[item.name];
  const content = <><span className={`flex h-[57px] w-full items-center justify-center rounded-lg ${mark?.dark ? 'bg-[#173523]' : 'bg-white'}`}>
    {mark ? <img alt={decorative ? '' : `${item.name} logo`} className="brand-logo max-h-[45px] max-w-[136px] object-contain" decoding="async" height={mark.height} loading="eager" src={mark.src} width={mark.width} /> : <strong className="text-[15px] font-extrabold text-[#224630]">{item.name}</strong>}
  </span><span className="block text-center text-[10px] font-bold text-[#506b54]">{item.name}</span></>;
  return decorative ? <span className="flex h-[88px] w-[178px] flex-none flex-col justify-center gap-1.5 rounded-xl border border-[#dde9dd] bg-[#f7faf5] px-4" aria-hidden="true">{content}</span> :
    <a aria-label={item.count ? `Browse ${item.name} catalogue listings` : `Ask about ${item.name} tyres`} className="flex h-[88px] w-[178px] flex-none flex-col justify-center gap-1.5 rounded-xl border border-[#dde9dd] bg-[#f7faf5] px-4 transition-colors hover:border-[#93b19b] hover:bg-white" href={item.count ? `/catalogue?brand=${encodeURIComponent(item.name)}` : '/contact'}>{content}</a>;
}

export default function BrandMarquees({ brands = [] }) {
  const [playing, setPlaying] = useState(true);
  const current = brands.filter(item => item.count > 0);
  const listed = current.length ? current : Object.keys(brandLogos).map(name => ({ name, count: 0, demoCount: 0 }));
  return <section aria-labelledby="home-brand-heading" className="mx-4 mt-12 overflow-hidden rounded-[20px] border border-[#e3ebe1] bg-[#f6f9f4] px-0 py-7 sm:mx-8 sm:py-9" id="home-brands">
    <div className="flex flex-wrap items-end justify-between gap-3 px-5 pb-5 sm:px-9"><div><SectionTag>{current.length ? 'In the catalogue' : 'Brands to ask about'}</SectionTag><h2 className="mt-3 text-[27px] font-extrabold leading-[1.08] tracking-[-.075em] sm:text-[37px]" id="home-brand-heading">A few familiar names. Your size comes first.</h2></div><div className="flex flex-wrap items-center gap-3"><button aria-pressed={!playing} className="inline-flex items-center gap-1 rounded-full border border-[#b8ceb8] px-3 py-2 text-[11px] font-extrabold text-[#2b6140] hover:bg-white motion-reduce:hidden" onClick={() => setPlaying(value => !value)} type="button">{playing ? <Pause aria-hidden="true" size={13} /> : <Play aria-hidden="true" size={13} />}{playing ? 'Pause logos' : 'Resume logos'}</button><a className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#2b6140] underline underline-offset-4" href="/services#service-brands">See the brand guide <ArrowUpRight aria-hidden="true" size={15} /></a></div></div>
    <div aria-label={current.length ? 'Brands represented in the current catalogue' : 'Illustrative brands to ask the shop about'} className="brand-rail overflow-hidden" role="group"><div className={`brand-track brand-track-left flex w-max motion-reduce:transform-none ${playing ? '' : 'is-paused'}`} style={{ '--brand-duration': '43s' }}><div className="brand-set flex flex-none gap-3 pr-3">{listed.map(item => <LogoCard item={item} key={item.name} />)}</div><div aria-hidden="true" className="brand-set flex flex-none gap-3 pr-3">{listed.map(item => <LogoCard decorative item={item} key={item.name} />)}</div></div></div>
    <div aria-hidden="true" className="brand-rail mt-3 overflow-hidden"><div className={`brand-track brand-track-right flex w-max motion-reduce:transform-none ${playing ? '' : 'is-paused'}`} style={{ '--brand-duration': '49s' }}><div className="brand-set flex flex-none gap-3 pr-3">{[...listed].reverse().map(item => <LogoCard decorative item={item} key={item.name} />)}</div><div className="brand-set flex flex-none gap-3 pr-3">{[...listed].reverse().map(item => <LogoCard decorative item={item} key={item.name} />)}</div></div></div>
    <p className="px-5 pt-5 text-[11px] leading-relaxed text-[#5c705f] sm:px-9">{brandNote(brands)} <a className="font-extrabold text-[#285d3b] underline underline-offset-2" href={current.length ? '/catalogue' : '/contact'}>{current.length ? 'Check listed sizes and availability without signing in.' : 'Ask the shop which brands and sizes are available.'}</a></p>
  </section>;
}
