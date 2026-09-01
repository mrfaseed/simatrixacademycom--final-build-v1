import { Link } from "react-router-dom";
import { PageHero, Section } from "../components/ui";
import { useSeo } from "../lib/useSeo";

const faqs = [
  ["Do I need programming experience?", "Not necessarily. Entry requirements vary by course. Check the course details or speak with the academy team to find a suitable starting level."],
  ["Are programs online or classroom-based?", "Learning mode and schedules can vary by program and batch. Contact the team for the currently available options."],
  ["Do you provide placement support?", "Simatrix Academy provides placement assistance such as resume guidance, interview preparation and relevant opportunity updates. Employment is not guaranteed."],
  ["Will I receive a certificate?", "Certificate availability and requirements depend on the selected program. Confirm the exact completion criteria before enrolling."],
  ["Can freshers and working professionals join?", "Programs may suit students, freshers and working professionals, depending on prerequisites and batch schedules."],
  ["How can I confirm fees and batch dates?", "Submit an enquiry or contact the academy team. They will share the latest program-specific fee, schedule and availability information."],
];

const topics = [
  ["ti-books", "Choosing a course", "Compare goals, prerequisites and expected learning outcomes."],
  ["ti-calendar-time", "Batches and schedules", "Confirm current learning mode and available timing."],
  ["ti-briefcase", "Career preparation", "Understand placement-assistance scope and readiness support."],
];

export default function HelpCenter() {
  useSeo({ title: "Help Center | Simatrix Academy", description: "Clear answers about Simatrix Academy courses, schedules, certificates, enrolment and placement assistance.", canonical: "/help-center", jsonLd: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) } });
  return (
    <main id="main-content">
      <PageHero eyebrow="Student support" title="Find a clear answer before making your decision." subtitle="Understand courses, batches, certificates and career support without relying on assumptions." />
      <Section className="py-16 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-3">{topics.map(([icon, title, text]) => <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><i className={`ti ${icon} text-2xl text-amber-700`} /><h2 className="mt-4 font-bold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div><p className="text-sm font-bold uppercase tracking-[.2em] text-amber-700">Common questions</p><h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">What students usually ask us.</h2><div className="mt-7 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-amber-200 open:shadow-md"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-slate-950">{question}<i className="ti ti-plus shrink-0 text-xl text-amber-700 transition group-open:rotate-45" /></summary><p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">{answer}</p></details>)}</div></div>
          <aside className="rounded-3xl bg-[#0d1b32] p-6 text-white lg:sticky lg:top-28"><span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-400 text-xl text-[#0d1b32]"><i className="ti ti-message-circle" /></span><h2 className="mt-5 font-display text-2xl font-semibold">Still need help?</h2><p className="mt-3 text-sm leading-6 text-slate-300">Share your question and the team will help you identify the relevant next step.</p><div className="mt-6 space-y-3"><Link to="/contact" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-bold text-[#0d1b32] hover:bg-amber-300">Contact the academy</Link><Link to="/appointment" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10">Request guidance</Link></div></aside>
        </div>
      </Section>
    </main>
  );
}
