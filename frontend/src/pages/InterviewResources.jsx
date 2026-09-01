import { Link } from "react-router-dom";
import { PageHero, Reveal, Section } from "../components/ui";
import { useSeo } from "../lib/useSeo";

const topics = [
  ["ti-binary-tree", "Problem solving", "Explain your reasoning before optimising.", ["Arrays and strings", "Trees and searching", "Complexity basics"]],
  ["ti-database", "Data and databases", "Connect database choices to real application needs.", ["Queries and joins", "Normalisation", "Indexes and transactions"]],
  ["ti-world-www", "Web fundamentals", "Show that you understand what happens beyond the UI.", ["HTTP and REST", "Browser and DOM", "Authentication basics"]],
  ["ti-cpu", "Core computing", "Revise the foundations commonly discussed in technical rounds.", ["Object-oriented design", "Operating systems", "Networks and system basics"]],
];

const stages = [
  ["01", "Before the interview", "Research the role, revise relevant fundamentals and choose two projects you can explain clearly."],
  ["02", "During the discussion", "Clarify the question, think aloud and communicate trade-offs instead of rushing toward an answer."],
  ["03", "After the interview", "Record the questions you found difficult and convert them into a focused practice list."],
];

export default function InterviewResources() {
  useSeo({ title: "Interview Preparation Resources | Simatrix Academy", description: "Use a structured checklist to revise technical foundations, explain projects and prepare for entry-level interviews.", canonical: "/interview-resources" });
  return (
    <main id="main-content">
      <PageHero eyebrow="Career toolkit" title="Prepare to explain how you think—not only what you remember." subtitle="Use this checklist to organise technical revision, project stories and interview-day communication.">
        <div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href="#revision" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-[#0d1b32] hover:bg-amber-300">Start the checklist<i className="ti ti-arrow-down" /></a><Link to="/resume-building" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-bold hover:bg-white/10">Review your resume</Link></div>
      </PageHero>

      <Section id="revision" className="scroll-mt-24 py-16 sm:py-20">
        <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-amber-700">Technical revision map</p><h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 sm:text-4xl">Prioritise the foundations relevant to your role.</h2><p className="mt-4 leading-7 text-slate-600">This is a starting framework, not a universal question bank. Adjust the depth according to the job description.</p></div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2">{topics.map(([icon,title,text,items], index) => <Reveal key={title} delay={index * 70}><article className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"><div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#0d1b32] text-2xl text-amber-300"><i className={`ti ${icon}`} /></span><h3 className="font-display text-xl font-semibold text-slate-950">{title}</h3></div><p className="mt-4 text-sm leading-6 text-slate-600">{text}</p><ul className="mt-5 grid gap-2 sm:grid-cols-3">{items.map((item) => <li key={item} className="flex gap-2 text-xs font-semibold text-slate-700"><i className="ti ti-check text-emerald-600" />{item}</li>)}</ul></article></Reveal>)}</div>
      </Section>

      <section className="bg-slate-50"><Section className="py-16 sm:py-20"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-amber-700">Interview journey</p><h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 sm:text-4xl">Prepare across all three stages.</h2><blockquote className="mt-7 rounded-3xl bg-[#0d1b32] p-7 text-xl font-semibold leading-8 text-white"><i className="ti ti-quote mb-4 block text-3xl text-amber-300" />“A strong answer makes your reasoning visible.”</blockquote></div><ol className="space-y-4">{stages.map(([number,title,text]) => <li key={number} className="grid grid-cols-[auto_1fr] gap-5 rounded-2xl border border-slate-200 bg-white p-6"><span className="text-2xl font-bold text-amber-600">{number}</span><div><h3 className="font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div></li>)}</ol></div></Section></section>

      <Section className="py-16 sm:py-20"><div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-amber-50 p-7 sm:flex-row sm:items-center sm:p-10"><div><h2 className="font-display text-2xl font-semibold text-slate-950">Need help connecting your preparation to a career path?</h2><p className="mt-2 max-w-2xl text-slate-600">Use a guidance session to discuss the roles you are targeting and identify practical next steps.</p></div><Link to="/career-guidance" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0d1b32] px-6 py-3 font-bold text-white hover:bg-slate-800">Get career guidance<i className="ti ti-arrow-right" /></Link></div></Section>
    </main>
  );
}
