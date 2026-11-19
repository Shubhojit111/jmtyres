/* Navbar.jsx — five primary destinations with a structured mobile menu. */
"use client";
import { ArrowUpRight, MapPin, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Brand from "@/components/ui/Brand";
import { business } from "@/lib/data/business";
import { navLinks } from "@/lib/data/nav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    const onPointer = (event) => {
      if (!event.target.closest(".site-header")) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header
      className={`site-header sticky top-0 z-40 w-full h-20 bg-white transition-all duration-200 border-b border-transparent ${scrolled ? "is-scrolled bg-white/95 shadow-[0_8px_28px_rgba(20,31,22,.09)] border-[#ebeee8] backdrop-blur-[14px]" : "is-top"} max-[720px]:h-[66px]`}
    >
      <div className="header-inner max-w-[1600px] mx-auto w-full h-full flex items-center justify-between gap-5 px-4 sm:px-6 lg:px-10 max-[720px]:gap-2">
        <Brand />
        <nav
          aria-label="Primary navigation"
          className={`header-nav [display:flex] [align-items:center] [justify-content:center] [gap:3px] [margin:0_auto] [&>a]:[display:inline-flex] [&>a]:[align-items:center] [&>a]:[justify-content:center] [&>a]:[min-height:32px] [&>a]:[padding:0_13px] [&>a]:[border-radius:999px] [&>a]:[background:#f3f4f2] [&>a]:[color:#161c18] [&>a]:[font-size:12px] [&>a]:[font-weight:700] [&>a]:[white-space:nowrap] [&>a]:[transition:background_.2s_ease,_color_.2s_ease] [&>a:hover]:[background:#dfe9dc] [&>a:hover]:[color:#143723] [&_.mobile-only-link]:[display:none] max-[1250px]:[&>a]:[padding:0_8px] max-[1250px]:[&>a]:[font-size:10px] max-[970px]:[top:74px] max-[720px]:[top:64px] max-[720px]:[left:6px] max-[720px]:[right:6px] max-[720px]:[max-height:calc(100dvh_-_69px)] [&_.nav-index]:[display:none] [&_.nav-arrow]:[display:none] [&_.nav-label_small]:[display:none] [&_.nav-label]:[display:inline] max-[1200px]:[&>a]:[padding-left:9px] max-[1200px]:[&>a]:[padding-right:9px] max-[1200px]:[&>a]:[font-size:10px] max-[1080px]:[position:absolute] max-[1080px]:[top:78px] max-[1080px]:[left:16px] max-[1080px]:[right:16px] max-[1080px]:[display:none] max-[1080px]:[flex-direction:column] max-[1080px]:[align-items:stretch] max-[1080px]:[gap:0] max-[1080px]:[max-height:calc(100dvh_-_89px)] max-[1080px]:[padding:9px_14px] max-[1080px]:[overflow-y:auto] max-[1080px]:[overscroll-behavior:contain] max-[1080px]:[border:1px_solid_#e2e9e1] max-[1080px]:[border-radius:17px] max-[1080px]:[background:#fff] max-[1080px]:[box-shadow:0_16px_44px_rgba(19,43,26,.15)] max-[1080px]:[&.header-nav-open]:[display:flex] max-[1080px]:[&>a]:[display:grid] max-[1080px]:[&>a]:[grid-template-columns:36px_minmax(0,1fr)_20px] max-[1080px]:[&>a]:[align-items:center] max-[1080px]:[&>a]:[justify-content:stretch] max-[1080px]:[&>a]:[gap:7px] max-[1080px]:[&>a]:[min-height:58px] max-[1080px]:[&>a]:[height:auto] max-[1080px]:[&>a]:[padding:8px_9px] max-[1080px]:[&>a]:[border-bottom:1px_solid_#e9eee8] max-[1080px]:[&>a]:[border-radius:0] max-[1080px]:[&>a]:[background:transparent] max-[1080px]:[&>a]:[font-size:13px] max-[1080px]:[&>a:hover]:[background:#f2f7f0] max-[1080px]:[&_.nav-index]:[display:inline] max-[1080px]:[&_.nav-index]:[color:#65806b] max-[1080px]:[&_.nav-index]:[font-size:14px] max-[1080px]:[&_.nav-index]:[font-weight:700] max-[1080px]:[&_.nav-label]:[display:flex] max-[1080px]:[&_.nav-label]:[flex-direction:column] max-[1080px]:[&_.nav-label]:[gap:3px] max-[1080px]:[&_.nav-label]:[font-size:14px] max-[1080px]:[&_.nav-label]:[font-weight:800] max-[1080px]:[&_.nav-label_small]:[display:block] max-[1080px]:[&_.nav-label_small]:[color:#657568] max-[1080px]:[&_.nav-label_small]:[font-size:10.5px] max-[1080px]:[&_.nav-label_small]:[font-weight:550] max-[1080px]:[&_.nav-label_small]:[line-height:1.3] max-[1080px]:[&_.nav-label_small]:[white-space:normal] max-[1080px]:[&_.nav-arrow]:[display:inline] max-[1080px]:[&_.nav-arrow]:[color:#52775b] max-[1080px]:[&_.mobile-only-link]:[display:flex] max-[1080px]:[&_.mobile-only-link]:[justify-content:space-between] max-[1080px]:[&_.mobile-only-link]:[min-height:42px] max-[1080px]:[&_.mobile-only-link]:[margin-top:5px] max-[1080px]:[&_.mobile-only-link]:[border:0] max-[1080px]:[&_.mobile-only-link]:[color:#235b3b] max-[1080px]:[&_.mobile-only-link]:[font-weight:800] max-[720px]:[&>a]:[min-height:53px] max-[720px]:[&>a]:[padding:7px_8px] max-[720px]:[&_.nav-label]:[font-size:13px] max-[720px]:[&_.nav-label_small]:[font-size:10px] ${open ? "header-nav-open" : ""}`}
          id="primary-nav"
        >
          {navLinks.map((link, index) => (
            <a
              aria-current={
                pathname === link.href ||
                (link.href === "/services" &&
                  pathname?.startsWith("/services/"))
                  ? "page"
                  : undefined
              }
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true" className="nav-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="nav-label">
                {link.label}
                <small>{link.description}</small>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="nav-arrow"
                size={17}
              />
            </a>
          ))}
        </nav>
        <div className="header-actions [display:flex] [align-items:center] [gap:9px] [white-space:nowrap] max-[970px]:[margin-left:auto] max-[1080px]:[margin-left:auto]">
          <a
            className="header-find [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [height:38px] [padding:0_16px] [border-radius:999px] [font-size:12px] [font-weight:750] [transition:transform_.2s_ease,_background_.2s_ease] [background:#fff] [border:1px_solid_#c8d0c9] [&:hover]:[transform:translateY(-2px)] max-[1250px]:[padding:0_11px] max-[1250px]:[font-size:10px] max-[970px]:[display:none] max-[1080px]:[display:none]"
            href={business.mapHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MapPin aria-hidden="true" size={15} strokeWidth={1.9} /> Find our
            shop
          </a>
          <a
            className="header-call [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [height:38px] [padding:0_18px] [border-radius:999px] [font-size:12px] [font-weight:750] [transition:transform_.2s_ease,_background_.2s_ease] [background:#102c1d] [color:#fff] [&:hover]:[transform:translateY(-2px)] [&:hover]:[background:#245135] max-[1250px]:[padding:0_11px] max-[1250px]:[font-size:10px] max-[720px]:[height:34px] max-[720px]:[padding:0_11px] max-[720px]:[font-size:10px] max-[720px]:[gap:3px] max-[720px]:[&_svg]:[width:13px] max-[375px]:[font-size:9px] max-[375px]:[padding:0_8px]"
            href={business.phoneHref}
          >
            Call now{" "}
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
          </a>
        </div>
        <button
          aria-controls="primary-nav"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="menu-toggle [display:none] [align-items:center] [justify-content:center] [border:0] [background:#f1f3ef] [width:38px] [height:38px] [border-radius:50%] max-[970px]:[display:inline-flex] max-[720px]:[width:34px] max-[720px]:[height:34px] max-[720px]:[flex:0_0_auto] max-[1080px]:[display:inline-flex]"
          onClick={() => setOpen((value) => !value)}
          ref={menuRef}
          type="button"
        >
          {open ? (
            <X aria-hidden="true" size={22} />
          ) : (
            <Menu aria-hidden="true" size={22} />
          )}
        </button>
      </div>
    </header>
  );
}
