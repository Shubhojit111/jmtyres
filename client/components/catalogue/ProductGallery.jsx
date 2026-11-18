'use client';
import { useState } from 'react';
export default function ProductGallery({images = [],name}) {
  const [selected,setSelected] = useState(0);
  const current = images[selected];
  return <div><div className="flex h-[340px] items-center justify-center overflow-hidden rounded-[17px] bg-[#dfe9dd] sm:h-[430px]">{current ? <img alt={current.alt || name} className="h-full w-full object-cover" src={current.url}/> : <span className="text-[13px] font-semibold text-[#637967]">No product photo uploaded yet</span>}</div>{images.length > 1 && <div aria-label="Product image thumbnails" className="mt-3 flex flex-wrap gap-2">{images.map((image,i)=><button aria-label={`View image ${i+1}`} aria-pressed={selected===i} className={`h-[66px] w-[78px] overflow-hidden rounded-lg border-2 ${selected===i ? 'border-[#2d7048]' : 'border-transparent'}`} key={image.url} onClick={()=>setSelected(i)} type="button"><img alt={image.alt || `Thumbnail ${i+1}`} className="h-full w-full object-cover" src={image.url}/></button>)}</div>}</div>;
}
