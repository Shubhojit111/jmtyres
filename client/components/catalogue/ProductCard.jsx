import { ArrowUpRight, Phone, ShieldCheck } from 'lucide-react';
import { business } from '@/lib/data/business';
import { formatINR } from '@/lib/data/money';

export default function ProductCard({ product }) {
  const photo = product.images?.[0];
  return <article className="flex min-w-0 flex-col overflow-hidden rounded-[19px] border border-[#e2ebe1] bg-[#f9fbf8] shadow-[0_4px_20px_rgba(19,42,27,.035)]">
    <a aria-label={`View ${product.name}`} className="relative block h-[210px] overflow-hidden bg-[#e6ede5]" href={`/tyres/${product.slug}`}>
      {photo ? <img alt={photo.alt || product.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" src={photo.url} /> : <span className="flex h-full items-center justify-center text-sm text-[#47644b]">Image not uploaded yet</span>}
      {product.isDemo && <span className="absolute left-3 top-3 rounded-full bg-[#102c1d] px-3 py-1 text-[10px] font-extrabold tracking-wide text-white">DEMO EXAMPLE</span>}
    </a>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#44734c]">{product.brand} · {product.category}</p>
      <a className="mt-2 text-[19px] font-extrabold leading-[1.18] tracking-[-.055em] hover:text-[#2d6840]" href={`/tyres/${product.slug}`}>{product.name}</a>
      <p className="mt-2 text-[12px] leading-relaxed text-[#536957]">Size {product.tyre.size} · {product.tyre.type}</p>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
        <div><p className="text-[20px] font-extrabold tracking-[-.05em]">{formatINR(product.pricePaise)}</p><p className="text-[10px] font-semibold text-[#607361]">{product.isDemo ? 'Illustrative demo price' : 'Listed price'}</p></div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${product.stockQty ? 'bg-[#e4efe4] text-[#28593a]' : 'bg-[#f4eae6] text-[#854332]'}`}>{product.stockQty ? <ShieldCheck aria-hidden="true" size={13} /> : null}{product.stockQty ? `${product.stockQty} available` : 'Out of Stock'}</span>
      </div>
      {product.stockQty ? <a className="mt-5 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#163b27] px-4 text-[12px] font-extrabold text-white hover:bg-[#286246]" href={`/request/${product.slug}`}>Request to Buy <ArrowUpRight aria-hidden="true" size={15} /></a> : <a className="mt-5 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#163b27] px-4 text-[12px] font-extrabold text-white hover:bg-[#286246]" href={business.phoneHref}><Phone aria-hidden="true" size={15} />Call Owner</a>}
    </div>
  </article>;
}
