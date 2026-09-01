const orbitItems = ["</>", "AI", "JS", "{ }", "PY", "UX"];

export default function PageLoader({ compact = false }) {
  return (
    <div
      className={`${compact ? "min-h-[22rem]" : "fixed inset-0 z-[9998] min-h-screen"} grid place-items-center overflow-hidden bg-[#071426] px-6 text-white`}
      role="status"
      aria-live="polite"
      aria-label="Loading Simatrix Academy"
    >
      <div className="relative flex flex-col items-center text-center">
        <div className="pointer-events-none absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" aria-hidden="true" />

        <div className="simatrix-loader-mark relative h-36 w-64" aria-hidden="true">
          <svg viewBox="0 0 240 120" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#38bdf8" />
                <stop offset=".5" stopColor="#2563eb" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
              <filter id="loader-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path className="simatrix-loader-track" d="M18 60C18 22 59 18 91 60s73 38 73 0-41-42-73 0-73 38-73 0Z" />
            <path className="simatrix-loader-stroke" d="M18 60C18 22 59 18 91 60s73 38 73 0-41-42-73 0-73 38-73 0Z" />
            <circle className="simatrix-loader-spark" r="5" fill="#fbbf24" filter="url(#loader-glow)">
              <animateMotion dur="2.4s" repeatCount="indefinite" path="M18 60C18 22 59 18 91 60s73 38 73 0-41-42-73 0-73 38-73 0Z" />
            </circle>
          </svg>

          {orbitItems.map((item, index) => (
            <span
              key={item}
              className="simatrix-loader-token absolute grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 text-[10px] font-black text-slate-100 shadow-lg backdrop-blur"
              style={{ "--token-index": index }}
            >
              {item}
            </span>
          ))}

          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-amber-300/30 bg-[#0d1b32] text-2xl font-black text-amber-300 shadow-2xl shadow-blue-500/30">S</span>
        </div>

        <p className="mt-1 text-xs font-bold uppercase tracking-[.32em] text-amber-300">Simatrix Academy</p>
        <p className="mt-3 text-sm text-slate-400">Preparing your next learning step</p>
        <div className="mt-5 h-1 w-44 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><span className="simatrix-loader-progress block h-full w-1/2 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500" /></div>
      </div>

      <style>{`
        .simatrix-loader-track { fill: none; stroke: rgba(255,255,255,.09); stroke-width: 7; }
        .simatrix-loader-stroke { fill: none; stroke: url(#loader-gradient); stroke-width: 5; stroke-linecap: round; stroke-dasharray: 32 220; animation: simatrix-trace 2.4s linear infinite; filter: url(#loader-glow); }
        .simatrix-loader-token { left: calc(50% - 1.125rem); top: calc(50% - 1.125rem); animation: simatrix-token-orbit 4.8s linear infinite; animation-delay: calc(var(--token-index) * -0.8s); }
        .simatrix-loader-progress { animation: simatrix-progress 1.5s ease-in-out infinite; }
        @keyframes simatrix-trace { to { stroke-dashoffset: -252; } }
        @keyframes simatrix-token-orbit {
          0% { transform: rotate(0deg) translateX(108px) rotate(0deg) scale(.82); opacity: .45; }
          50% { opacity: 1; transform: rotate(180deg) translateX(108px) rotate(-180deg) scale(1); }
          100% { transform: rotate(360deg) translateX(108px) rotate(-360deg) scale(.82); opacity: .45; }
        }
        @keyframes simatrix-progress { 0% { transform: translateX(-110%); } 50% { transform: translateX(50%); } 100% { transform: translateX(210%); } }
        @media (prefers-reduced-motion: reduce) {
          .simatrix-loader-stroke, .simatrix-loader-token, .simatrix-loader-progress { animation: none; }
          .simatrix-loader-stroke { stroke-dasharray: none; }
          .simatrix-loader-token { display: none; }
          .simatrix-loader-progress { width: 100%; opacity: .75; }
        }
      `}</style>
    </div>
  );
}
