import { Link } from "react-router-dom";
import { PageHero, Reveal, Section } from "../components/ui";
import { useSeo } from "../lib/useSeo";

const pillars = [
  ["ti-book-2", "Structured curriculum", "Concepts are organised into a visible sequence so learners understand what they are building toward."],
  ["ti-tools", "Hands-on practice", "Exercises, labs and projects help learners turn knowledge into work they can explain and improve."],
  ["ti-users", "Mentor guidance", "Feedback and doubt support help learners recognise mistakes and choose a useful next step."],
  ["ti-briefcase", "Placement assistance", "Resume guidance, interview preparation and opportunity updates support the transition toward employment."],
  ["ti-refresh", "Relevant learning", "Program content is reviewed as tools, workflows and entry-level role expectations change."],
  ["ti-heart-handshake", "Student-first support", "Learning choices begin with the student's background, goals and readiness—not a one-size-fits-all promise."],
];

export default function Pillars() {
  useSeo({ title: "Our Learning Pillars | Simatrix Academy", description: "Explore the principles behind Simatrix Academy's practical learning, mentor guidance and placement assistance.", canonical: "/about/pillars" });
  return (
    <main id="main-content">
      <PageHero eyebrow="How we support learning" title="Principles learners can experience—not promises they must simply trust." subtitle="Six practical standards guide how Simatrix Academy structures learning, feedback and career preparation." />
      <Section className="py-16 sm:py-20">
        <div className="mb-10 max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-amber-700">What this means for you</p><h2 className="mt-3 font-display text-3xl font-semibold text-slate-950 sm:text-4xl">A learning experience designed around progress.</h2><p className="mt-4 leading-7 text-slate-600">Each pillar should be visible in the way you learn, practise, receive feedback and prepare for your next opportunity.</p></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(([icon, title, text], index) => <Reveal key={title} delay={index * 70}><article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#0d1b32] text-2xl text-amber-300"><i className={`ti ${icon}`} /></span><h3 className="mt-4 font-display text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article></Reveal>)}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-amber-50 p-7 sm:flex-row sm:items-center sm:p-9"><div><h2 className="font-display text-2xl font-semibold text-slate-950">See these pillars applied to a learning path.</h2><p className="mt-2 text-slate-600">Compare courses by goal, level and the skills you want to practise.</p></div><Link to="/courses" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0d1b32] px-6 py-3 font-bold text-white transition hover:bg-slate-800">Explore courses<i className="ti ti-arrow-right" /></Link></div>
      </Section>
    </main>
  );
}
