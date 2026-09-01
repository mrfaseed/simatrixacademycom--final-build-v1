import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import EnquiryForm from "../components/EnquiryForm";
import { useSeo } from "../lib/useSeo";

const expectations = [
  ["ti-target-arrow", "Start with your goal", "Tell us whether you need course selection, career guidance or program information."],
  ["ti-message-circle", "Have a focused conversation", "Our team will ask about your background before suggesting a useful next step."],
  ["ti-route", "Receive clear options", "Understand relevant paths, current availability and what you should do after the conversation."],
];

export default function Appointment() {
  const [courses, setCourses] = useState([]);
  useSeo({ title: "Book a Guidance Appointment | Simatrix Academy", description: "Request a guidance conversation with Simatrix Academy about courses, learning paths and career preparation.", canonical: "/appointment" });
  useEffect(() => { api.getCourses().then((res) => setCourses(res.data)).catch(() => setCourses([])); }, []);

  return (
    <main id="main-content" className="bg-slate-50">
      <section className="relative overflow-hidden bg-[#0d1b32] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,.16),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(14,165,233,.15),transparent_30%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-10 lg:py-24">
          <div><nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300"><Link to="/" className="hover:text-white">Home</Link><i className="ti ti-chevron-right text-xs" /><span className="text-amber-300">Appointment</span></nav><p className="mt-8 text-sm font-bold uppercase tracking-[.2em] text-amber-300">A conversation before a commitment</p><h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">Choose your next step with better information.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Request a guidance conversation about courses, career direction or program eligibility. We’ll confirm the available time with you.</p></div>
          <div className="rounded-3xl border border-white/15 bg-white/[.07] p-6 backdrop-blur"><p className="text-sm font-bold text-amber-300">Before you submit</p><ul className="mt-5 space-y-4 text-sm text-slate-200">{["Mention the decision you need help with", "Use a reachable phone number or email", "Course selection is optional if you are undecided"].map((item) => <li key={item} className="flex gap-3"><i className="ti ti-circle-check-filled mt-0.5 text-emerald-400" />{item}</li>)}</ul><p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">Submitting this request does not confirm a slot. The academy team will contact you with availability.</p></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:px-10">
        <div><p className="text-sm font-bold uppercase tracking-[.2em] text-amber-700">What to expect</p><h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 sm:text-4xl">A simple, no-pressure process.</h2><div className="mt-8 space-y-4">{expectations.map(([icon, title, text], index) => <article key={title} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-slate-200 bg-white p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0d1b32] text-xl text-amber-300"><i className={`ti ${icon}`} /></span><div><p className="text-xs font-bold text-amber-700">STEP {index + 1}</p><h3 className="mt-1 font-bold text-slate-950">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></article>)}</div></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"><div className="flex items-start gap-4 border-b border-slate-100 pb-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-2xl text-amber-700"><i className="ti ti-calendar-plus" /></span><div><h2 className="font-display text-2xl font-semibold text-slate-950">Request your appointment</h2><p className="mt-1 text-sm text-slate-600">We’ll use these details only to respond to your enquiry and confirm availability.</p></div></div><div className="mt-6"><EnquiryForm courses={courses} type="appointment" /></div></div>
      </section>
    </main>
  );
}
