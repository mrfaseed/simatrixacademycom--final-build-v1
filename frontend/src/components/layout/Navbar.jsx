import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { api } from "../../api/client";
import { icon } from "../../lib/icons";
import { Button } from "../ui";

/**
 * Palette pulled directly from simatrix_logo_only.svg:
 *   --logo-blue    #1E8FE0  (left cap)
 *   --logo-indigo  #241C6B  (the crossover, darkest point)
 *   --logo-violet  #000000  (right cap)
 *   --logo-magenta #C026D3  (the dissolving pixels)
 * These replace the old generic brand-400/600/700 scale in this file so the
 * navbar reads as an extension of the mark, not a separate design system.
 */

const ABOUT_LINKS = [
  { label: "Academy Overview", to: "/about", icon: "ti-building-community" },
  { label: "Mission & Vision", to: "/about/mission", icon: "ti-target" },
  { label: "Our Pillars", to: "/about/pillars", icon: "ti-columns" },
  { label: "Awards", to: "/awards", icon: "ti-award" },
  { label: "Gallery", to: "/gallery", icon: "ti-photo" },
];

const SUPPORT_LINKS = [
  { label: "Placement Training", to: "/placement", icon: "ti-briefcase" },
  { label: "Career Guidance", to: "/career-guidance", icon: "ti-compass" },
  { label: "Book Appointment", to: "/appointment", icon: "ti-calendar-event" },
  { label: "Help Center", to: "/help-center", icon: "ti-help-circle" },
  { label: "Blog", to: "/blog", icon: "ti-news" },
  { label: "Student Reviews", to: "/reviews", icon: "ti-star" },
  { label: "Interview Resources", to: "/interview-resources", icon: "ti-file-text" },
];

function PixelTrail({ active }) {
  return <span aria-hidden className={`pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 transition duration-300 ${active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-80"}`} />;
}

export default function Navbar() {
  const { pathname, search } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    api.getSite().then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname, search]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      setOpenMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (name) => setOpenMenu((m) => (m === name ? null : name));

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 bg-[#081426]/95 text-white transition-all duration-300 backdrop-blur-xl ${
        scrolled
          ? "shadow-[0_16px_40px_-20px_rgba(2,6,23,.75)]"
          : "shadow-none"
      }`}
    >
      {/* hairline that carries the exact logo gradient, not a generic brand tint */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #1E8FE0 22%, #7B2FCB 55%, #C026D3 78%, transparent)",
        }}
      />

      <div
        ref={navRef}
        className={`relative mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 transition-[height] duration-300 sm:px-6 ${scrolled ? "h-16" : "h-20"}`}
      >
        <Link to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Simatrix Academy home">
          {/* logo carries its own gradient — no boxed background fighting it */}
          <span className="grid h-11 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1 shadow-lg shadow-black/20 transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105" aria-hidden="true">
            <img
              src="/simatrix_logo_only.svg"
              alt=""
              className="block h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
            />
          </span>
          <span className="min-w-0 whitespace-nowrap font-display text-base font-extrabold tracking-tight text-white sm:text-lg">
            Simatrix <span className="text-sky-300">Academy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[.06] p-1.5 shadow-inner shadow-black/20 lg:flex">
          <TopLink to="/" label="Home" />

          <Dropdown label="About" open={openMenu === "about"} onToggle={() => toggle("about")}>
            <div className="w-64 p-2">
              {ABOUT_LINKS.map((l) => (
                <MenuItem key={l.to} {...l} onClick={() => setOpenMenu(null)} />
              ))}
            </div>
          </Dropdown>

          <Dropdown label="Courses" wide open={openMenu === "courses"} onToggle={() => toggle("courses")}>
            <div className="grid w-[34rem] grid-cols-2 gap-1 p-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/courses?category=${c.slug}`}
                  onClick={() => setOpenMenu(null)}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-[#1E8FE0]/5 hover:text-[#4A2E9E]"
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg text-white ring-1 ring-black/5 transition-transform group-hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #29395b, #131c30)" }}
                  >
                    <i className={icon(c.icon)} />
                  </span>
                  <span>
                    {c.name}
                    <span className="block text-xs text-slate-500">{(c.courses || []).length} courses</span>
                  </span>
                </Link>
              ))}
              <Link
                to="/courses"
                onClick={() => setOpenMenu(null)}
                className="col-span-2 mt-1 flex items-center justify-center gap-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                style={{ background: "linear-gradient(90deg, #131c30, #29395b)" }}
              >
                View all courses <i className="ti ti-arrow-right" />
              </Link>
            </div>
          </Dropdown>

          <Dropdown label="Support" open={openMenu === "support"} onToggle={() => toggle("support")}>
            <div className="w-64 p-2">
              {SUPPORT_LINKS.map((l) => (
                <MenuItem key={l.to} {...l} onClick={() => setOpenMenu(null)} />
              ))}
            </div>
          </Dropdown>

          <TopLink to="/contact" label="Contact" />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
         
          <Link to="/contact" className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sky-300">Enquire now<i className="ti ti-arrow-up-right transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        </div>

        <button
          className={`grid h-11 w-11 place-items-center rounded-xl border text-white transition-all lg:hidden ${mobileOpen ? "border-violet-400/50 bg-violet-400/20" : "border-white/15 bg-white/[.07] hover:bg-white/15"}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          <i className={`ti text-xl ${mobileOpen ? "ti-x" : "ti-menu-2"}`} />
        </button>
      </div>

      {mobileOpen && (
        <MobileMenu categories={categories} onClose={() => setMobileOpen(false)} />
      )}
    </header>
  );
}

function TopLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `group relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          isActive ? "bg-white text-slate-950 shadow-md" : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <PixelTrail active={isActive} />
        </>
      )}
    </NavLink>
  );
}

function Dropdown({ label, open, onToggle, children }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          open ? "bg-white text-slate-950 shadow-md" : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        {label}
        <i className={`ti ti-chevron-down text-xs transition ${open ? "rotate-180" : ""}`} />
        <PixelTrail active={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white/98 text-slate-800 shadow-[0_24px_60px_-22px_rgba(2,6,23,.45)] backdrop-blur-xl animate-[fadeIn_.15s_ease-out]">
          <div className="h-1 bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500" />
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({ to, label, icon: ic, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:translate-x-0.5 hover:bg-amber-50 hover:text-brand-900"
    >
      <span
        className="grid h-7 w-7 place-items-center rounded-md bg-brand-50 text-brand-800 ring-1 ring-brand-900/10 transition-colors group-hover:bg-brand-900 group-hover:text-amber-300"
        onMouseEnter={(e) => (e.currentTarget.style.background = "#131c30")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "")
        }
      >
        <i className={`ti ${ic} text-base`} />
      </span>
      {label}
    </Link>
  );
}

function MobileMenu({ categories, onClose }) {
  const [section, setSection] = useState(null);
  const toggle = (s) => setSection((x) => (x === s ? null : s));

  return (
    <div id="mobile-navigation" className="relative max-h-[calc(100dvh-4rem)] overscroll-contain overflow-y-auto border-t border-white/10 bg-[#0b172a]/98 text-white shadow-2xl backdrop-blur-xl lg:hidden">
      <div
        className="h-px"
        style={{ background: "linear-gradient(90deg, transparent, #1E8FE0, #7B2FCB, transparent)" }}
      />
      <nav className="flex flex-col gap-1 px-4 py-5">
        <MLink to="/" label="Home" onClose={onClose} />

        <MGroup label="About" open={section === "about"} onToggle={() => toggle("about")}>
          {ABOUT_LINKS.map((l) => <MLink key={l.to} {...l} sub onClose={onClose} />)}
        </MGroup>

        <MGroup label="Courses" open={section === "courses"} onToggle={() => toggle("courses")}>
          {categories.map((c) => (
            <MLink key={c.id} to={`/courses?category=${c.slug}`} label={c.name} sub onClose={onClose} />
          ))}
          <MLink to="/courses" label="View all courses" sub onClose={onClose} />
        </MGroup>

        <MGroup label="Support" open={section === "support"} onToggle={() => toggle("support")}>
          {SUPPORT_LINKS.map((l) => <MLink key={l.to} {...l} sub onClose={onClose} />)}
        </MGroup>

        <MLink to="/contact" label="Contact" onClose={onClose} />
        <Button
          as={Link}
          to="/contact"
          className="mt-3 !border-0 !bg-gradient-to-r !from-brand-950 !via-brand-700 !to-amber-600 !text-white"
          onClick={onClose}
        >
          Enquire Now
        </Button>
      </nav>
    </div>
  );
}

function MGroup({ label, open, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${open ? "bg-white/10 text-sky-300" : "text-slate-200 hover:bg-white/[.07] hover:text-white"}`}
      >
        {label}
        <i className={`ti ti-chevron-down text-xs transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="ml-3 border-l border-sky-400/30 pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

function MLink({ to, label, sub, onClose }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClose}
      className={({ isActive }) =>
        `block min-h-11 rounded-xl px-3 py-2.5 ${sub ? "text-sm" : "text-sm font-semibold"} ${
          isActive ? "bg-white/10 text-sky-300" : "text-slate-300 hover:bg-white/[.07] hover:text-white"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? { background: "linear-gradient(90deg, rgba(30,143,224,0.16), rgba(123,47,203,0.1))" }
          : undefined
      }
    >
      {label}
    </NavLink>
  );
}
