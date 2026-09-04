import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

// Simatrix Academy brand palette (matched to logo, light theme only)
// Bright blue  -> #1358E0
// Blue-violet  -> #4B3CC7
// Violet       -> #7C3AED
// Pale blue bg -> #EAF1FF
// Pale violet bg -> #F3ECFF

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t.slice(-3), { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = useMemo(() => ({
    success: (message) => push(message, "success"),
    error: (message) => push(message, "error"),
    info: (message) => push(message, "info"),
  }), [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border border-white/15 px-4 py-3.5 text-sm font-medium text-white shadow-2xl shadow-slate-950/20 animate-[fadeIn_.2s_ease-out] ${
              t.type === "success"
                ? "bg-emerald-600"
                : t.type === "error"
                ? "bg-rose-600"
                : "bg-[#1358E0]"
            }`}
          >
            <i
              className={`ti mt-0.5 text-lg ${
                t.type === "success"
                  ? "ti-circle-check"
                  : t.type === "error"
                  ? "ti-alert-circle"
                  : "ti-info-circle"
              }`}
            />
            <span className="min-w-0 flex-1 leading-5">{t.message}</span>
            <button type="button" onClick={() => remove(t.id)} aria-label="Dismiss notification" className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/75 transition hover:bg-white/15 hover:text-white"><i className="ti ti-x" /></button>
            <span aria-hidden="true" className="toast-life absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/55" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  magnetic,
  className = "",
  children,
  ...props
}) {
  const btnRef = useRef(null);
  // Large (hero) CTAs get the magnetic pull by default; callers can force it
  // on/off with the `magnetic` prop.
  const isMagnetic = magnetic ?? size === "lg";

  const onMove = (e) => {
    const el = btnRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${mx * 0.22}px, ${my * 0.32}px)`;
  };
  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "";
  };

  const variants = {
    primary: "bg-gradient-to-r from-[#1358E0] to-[#4B3CC7] text-white ring-1 ring-inset ring-white/15 shadow-sm shadow-[#1358E0]/25 hover:shadow-md hover:shadow-[#4B3CC7]/30 hover:brightness-105 focus-visible:ring-[#1358E0]/40",
    accent: "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30 hover:bg-[#6D28D9] hover:shadow-md hover:shadow-[#7C3AED]/40 focus-visible:ring-[#7C3AED]/40",
    gradient: "bg-gradient-to-br from-[#1358E0] via-[#4B3CC7] to-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/25 hover:shadow-lg hover:shadow-[#7C3AED]/35 focus-visible:ring-[#7C3AED]/40",
    outline: "border border-[#1358E0]/25 text-[#1358E0] hover:bg-[#1358E0]/5 hover:border-[#1358E0]/40 focus-visible:ring-[#1358E0]/20",
    ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-300",
  };
  const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };
  const shine = ["primary", "accent", "gradient", "danger"].includes(variant) ? "shine" : "";
  return (
    <Tag
      ref={btnRef}
      onMouseMove={isMagnetic ? onMove : undefined}
      onMouseLeave={isMagnetic ? onLeave : undefined}
      className={`group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${shine} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Field({ label, error, children, required }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
      )}
      {children}
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1358E0]/50 focus:ring-2 focus:ring-[#1358E0]/10";

export function Spinner({ className = "" }) {
  return (
    <i className={`ti ti-loader-2 animate-spin text-[#1358E0] ${className}`} role="status" aria-label="Loading" />
  );
}

export function Card({ as: Tag = "div", className = "", hover = false, children, ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-200 bg-white ${
        hover ? "transition duration-200 hover:-translate-y-1 hover:border-[#1358E0]/25 hover:shadow-lg hover:shadow-[#7C3AED]/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Badge({ tone = "brand", className = "", children }) {
  const tones = {
    brand: "bg-[#EAF1FF] text-[#1358E0] ring-[#1358E0]/15",
    accent: "bg-[#7C3AED]/10 text-[#7C3AED] ring-[#7C3AED]/20",
    success: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/15",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

// Fires once when the element scrolls into view. Shared by Reveal + others.
export function useInView({ threshold = 0.12, rootMargin = "0px 0px -8% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}

/**
 * Scroll-triggered entrance. `dir` controls the direction it enters from:
 * "up" (default) | "down" | "left" | "right" | "scale".
 */
export function Reveal({ as: Tag = "div", delay = 0, dir = "up", className = "", children, ...props }) {
  const [ref, visible] = useInView();
  return (
    <Tag
      ref={ref}
      data-dir={dir}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------- TiltCard
// 3D tilt toward the pointer + spotlight. Wrap any card content.
export function TiltCard({ as: Tag = "div", className = "", max = 8, children, ...props }) {
  const ref = useRef(null);
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * max * 2}deg) rotateX(${(0.5 - py) * max * 2}deg)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`tilt spotlight ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ----------------------------------------------------------------- Counter
// Counts up to `to` when scrolled into view. `suffix`/`prefix` optional.
export function Counter({ to = 0, duration = 1600, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setVal(to);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
}

// ----------------------------------------------------------------- Marquee
export function Marquee({ children, className = "", gap = "3rem" }) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track" style={{ gap }}>
        <div className="flex shrink-0 items-center" style={{ gap }}>{children}</div>
        <div className="flex shrink-0 items-center" style={{ gap }} aria-hidden>{children}</div>
      </div>
    </div>
  );
}

export function PageHero({ title, subtitle, eyebrow, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0d1b32] py-16 text-white sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_15%,rgba(251,191,36,.16),transparent_27%),radial-gradient(circle_at_8%_90%,rgba(14,165,233,.16),transparent_30%),linear-gradient(135deg,#071426,#152642)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-10 bg-amber-300" />
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
            {eyebrow || "Simatrix Academy"}
          </span>
        </div>
        <h1 className="headline-reveal mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ "--d": "120ms" }}>{title}</h1>
        {subtitle && <p className="reveal mt-5 max-w-2xl text-lg leading-8 text-slate-300" style={{ "--d": "240ms" }}>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export function Modal({ open, onClose, title, children, footer }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => event.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto overscroll-contain bg-slate-900/50 p-4 sm:items-center" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-2xl bg-white shadow-xl animate-[fadeIn_.15s_ease-out]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${title}`} className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <i className="ti ti-x text-xl" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <div ref={ref} className={`mb-10 ${center ? "text-center max-w-2xl mx-auto" : ""}`}>
      {eyebrow && (
        <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 scroll-reveal ${inView ? "is-visible" : ""}`}>
          <span className="h-px w-7 bg-amber-600" />
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl scroll-reveal ${inView ? "is-visible" : ""}`} style={{ "--d": "80ms" }}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 leading-7 text-slate-600 scroll-reveal ${inView ? "is-visible" : ""}`} style={{ "--d": "160ms" }}>{subtitle}</p>
      )}
      {center && (
        <span className={`mx-auto mt-5 block h-1 w-16 rounded-full bg-amber-500 rule-draw ${inView ? "is-visible" : ""}`} style={{ "--d": "220ms" }} />
      )}
    </div>
  );
}

export function Hairline({ className = "" }) {
  return <div className={`hairline ${className}`} />;
}

export { ResponsiveImage } from "./ResponsiveImage";
export { cfImageUrl, cfSrcSet } from "../../lib/cloudflareImage";
