'use client';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';

const initial = {q:'',category:'',brand:'',size:'',minPrice:'',maxPrice:'',availability:'',sort:'newest'};
export default function CatalogueClient({ initialCategory = '', initialBrand = '' }) {
  const [filters,setFilters] = useState({...initial,category:initialCategory,brand:initialBrand});
  const [page,setPage] = useState(1); const [data,setData] = useState(null); const [options,setOptions] = useState({categories:[],brands:[]});
  const [busy,setBusy] = useState(false); const [error,setError] = useState('');
  useEffect(() => { let alive=true; Promise.all([fetch('/api/categories').then(r=>r.json()),fetch('/api/brands').then(r=>r.json())]).then(([a,b])=>{if(alive)setOptions({categories:a.items || [],brands:b.items || []});}).catch(()=>{});return()=>{alive=false;}; },[]);
  const filterKey = JSON.stringify(filters);
  useEffect(() => {
    const controller = new AbortController(); const timer = setTimeout(async()=>{
      setBusy(true);setError('');
      const params = new URLSearchParams(); Object.entries(filters).forEach(([key,value])=>{if(value)params.set(key,value);});params.set('page',String(page));params.set('limit','12');
      try { const response = await fetch(`/api/products?${params}`,{signal:controller.signal});const result = await response.json();if(!response.ok)throw Error(result.error || 'Search unavailable.');setData(result); }
      catch(e){if(e.name!=='AbortError')setError(e.message);}
      finally { if(!controller.signal.aborted)setBusy(false); }
    },filters.q ? 250 : 0);
    return()=>{clearTimeout(timer);controller.abort();};
  },[filterKey,page]);
  const change=(key,value)=>{setFilters(prev=>({...prev,[key]:value}));setPage(1);};
  const demo = useMemo(()=>data?.items?.some(p=>p.isDemo),[data]);
  const control = 'mt-1.5 h-[42px] w-full rounded-[10px] border border-[#d8e4d8] bg-white px-3 text-[12px] text-[#183424] outline-offset-2 focus:border-[#3a7750]';
  return <div className="mx-4 mb-10 mt-7 sm:mx-8">
    <div className="rounded-[22px] bg-[#edf3ec] p-6 sm:p-10"><span className="rounded-full bg-[#dfebdd] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#245234]">Tyre catalogue</span><h1 className="mt-5 text-[42px] font-extrabold leading-[1.03] tracking-[-.078em] sm:text-[60px]">Find what fits your search.</h1><p className="mt-4 max-w-[650px] text-[14px] leading-relaxed text-[#465c4b]">Search products and tyre sizes in the current database. Vehicle fitment is shown only when verified compatibility is entered by staff.</p></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[245px_minmax(0,1fr)]">
      <aside aria-label="Catalogue filters" className="h-fit rounded-[19px] border border-[#e3eae1] bg-[#f8faf7] p-5">
        <h2 className="flex items-center gap-2 text-[18px] font-extrabold"><SlidersHorizontal size={18} aria-hidden="true" /> Refine results</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <label className="block text-[12px] font-bold" htmlFor="catalogue-search">Product or brand<div className="relative"><input className={`${control} pr-9`} id="catalogue-search" onChange={e=>change('q',e.target.value)} placeholder="Search name, SKU, brand…" type="search" value={filters.q}/><Search aria-hidden="true" className="absolute right-3 top-4 text-[#58705d]" size={16}/></div></label>
          <label className="block text-[12px] font-bold" htmlFor="catalogue-category">Category<select className={control} id="catalogue-category" onChange={e=>change('category',e.target.value)} value={filters.category}><option value="">All categories</option>{options.categories.map(item=><option key={item.name}>{item.name}</option>)}</select></label>
          <label className="block text-[12px] font-bold" htmlFor="catalogue-brand">Brand<select className={control} id="catalogue-brand" onChange={e=>change('brand',e.target.value)} value={filters.brand}><option value="">All brands</option>{options.brands.map(item=><option key={item.name}>{item.name}</option>)}</select></label>
          <label className="block text-[12px] font-bold" htmlFor="catalogue-size">Tyre size<input className={control} id="catalogue-size" onChange={e=>change('size',e.target.value)} placeholder="205/55 R16" value={filters.size}/></label>
          <div className="grid grid-cols-2 gap-2"><label className="block text-[12px] font-bold" htmlFor="price-min">Min ₹<input className={control} id="price-min" min="0" onChange={e=>change('minPrice',e.target.value)} placeholder="0" type="number" value={filters.minPrice}/></label><label className="block text-[12px] font-bold" htmlFor="price-max">Max ₹<input className={control} id="price-max" min="0" onChange={e=>change('maxPrice',e.target.value)} placeholder="Any" type="number" value={filters.maxPrice}/></label></div>
          <label className="block text-[12px] font-bold" htmlFor="catalogue-availability">Availability<select className={control} id="catalogue-availability" onChange={e=>change('availability',e.target.value)} value={filters.availability}><option value="">All stock states</option><option value="available">Available</option><option value="out">Out of stock</option></select></label>
          <button className="min-h-[39px] rounded-full border border-[#b9cbb9] text-[12px] font-extrabold hover:bg-[#e1ebe0]" onClick={()=>{setFilters(initial);setPage(1);}} type="button">Clear filters</button>
        </div>
      </aside>
      <section aria-label="Catalogue results" className="min-w-0">
        {demo && <div className="mb-4 rounded-xl border border-[#b7d0b8] bg-[#f0f6ed] p-4 text-[12px] font-bold text-[#31583a]">DEMO PRODUCTS: All sample stock, prices, names and images are fictional test data. Do not treat them as real shop availability.</div>}
        <div className="flex flex-wrap items-end justify-between gap-3"><p aria-live="polite" className="text-[13px] font-semibold text-[#4f6555]">{busy ? 'Searching database…' : data ? `${data.total} ${data.total===1?'product':'products'} found` : 'Loading products…'}</p><label className="text-[12px] font-bold" htmlFor="catalogue-sort">Sort by <select className="ml-2 h-[38px] rounded-full border border-[#d7e3d6] bg-white px-3" id="catalogue-sort" onChange={e=>change('sort',e.target.value)} value={filters.sort}><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="name">Name</option></select></label></div>
        {error && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-[12px] text-red-800" role="alert">{error}</p>}
        {data?.items?.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.items.map(item=><ProductCard key={item.id} product={item}/>)}</div> : <div className="mt-5 rounded-[18px] border border-[#e3ebe0] bg-[#f9fbf8] p-9 text-[14px] text-[#465d4c]">{data ? 'No tyres match these filters. Try a different size or ask the shop for help.' : 'Loading the current catalogue…'} <a className="mt-3 flex items-center gap-2 font-bold text-[#245b38] underline" href="/contact">Contact Owner <ArrowRight size={15} aria-hidden="true" /></a></div>}
        {data?.pages > 1 && <nav aria-label="Product pages" className="mt-6 flex items-center justify-center gap-3"><button className="rounded-full border border-[#c9d8c9] px-4 py-2 text-[12px] font-bold disabled:opacity-40" disabled={page===1} onClick={()=>setPage(page-1)} type="button">Previous</button><span className="text-[12px] font-bold">Page {page} of {data.pages}</span><button className="rounded-full border border-[#c9d8c9] px-4 py-2 text-[12px] font-bold disabled:opacity-40" disabled={page===data.pages} onClick={()=>setPage(page+1)} type="button">Next</button></nav>}
      </section>
    </div>
  </div>;
}
