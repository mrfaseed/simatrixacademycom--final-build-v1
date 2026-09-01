import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo";

export default function NotFound() {
  useSeo({ title: "Page Not Found | Simatrix Academy" });
  return (
    <main id="main-content" className="grid min-h-[70vh] place-items-center bg-slate-50 px-5 py-20 text-center">
      <div className="max-w-xl">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-100 text-4xl text-amber-700"><i className="ti ti-map-question" /></span>
        <p className="mt-7 text-sm font-bold uppercase tracking-[.24em] text-amber-700">Error 404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">This path does not lead anywhere yet.</h1>
        <p className="mt-5 leading-7 text-slate-600">The page may have moved or the link may be incorrect. Return home or continue by exploring available courses.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0d1b32] px-6 py-3 font-bold text-white hover:bg-slate-800"><i className="ti ti-home" />Back home</Link><Link to="/courses" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800 hover:bg-slate-100">Explore courses<i className="ti ti-arrow-right" /></Link></div>
      </div>
    </main>
  );
}
