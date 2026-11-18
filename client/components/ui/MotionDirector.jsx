'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: no JavaScript or reduced motion leaves every word and image visible. */
export default function MotionDirector() {
  const pathname = usePathname();
  useEffect(() => {
    const publicRoute = pathname === '/' || ['/about', '/find-tyres', '/services', '/contact', '/brands', '/gallery', '/offers', '/catalogue'].some(route => pathname === route || (route === '/services' && pathname?.startsWith('/services/'))) || pathname?.startsWith('/tyres/');
    if (!publicRoute || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const main = document.getElementById('main-content');
    if (!main) return;
    const seen = new WeakSet();
    const tracked = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('motion-pending');
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.01 });
    const watch = (el, kind) => {
      if (seen.has(el)) return;
      seen.add(el);
      const aboveFold = el.getBoundingClientRect().top < innerHeight * 0.9;
      el.classList.add(kind === 'image' ? 'motion-image' : 'motion-section');
      if (!aboveFold) el.classList.add('motion-pending');
      if (!aboveFold) {
        tracked.push(el);
        observer.observe(el);
      }
    };
    const scan = () => {
      main.querySelectorAll('section:not(.hero-section), .content-page > header').forEach(el => watch(el, 'section'));
      main.querySelectorAll('img:not(.brand-logo)').forEach(el => watch(el, 'image'));
    }; 
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(main, { childList: true, subtree: true });
    return () => { mutations.disconnect(); observer.disconnect(); tracked.forEach(el => el.classList.remove('motion-pending')); };
  }, [pathname]);
  return null;
}
