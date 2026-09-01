import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo";

const BELIEFS = [
  ["ti-bulb", "Clarity before complexity", "Learners progress faster when they understand why a skill matters and where it fits."],
  ["ti-tools", "Practice creates confidence", "Real capability grows through application, feedback and repeated improvement."],
  ["ti-users-group", "Support should feel human", "Questions deserve patient guidance—not judgment or generic answers."],
  ["ti-shield-check", "Trust requires honesty", "Career support should set clear expectations and be backed by visible effort."],
];

const PROMISES = [
  ["01", "Make the learning path visible", "Explain the goal, sequence and expected outcome of every stage."],
  ["02", "Connect theory to practical work", "Use exercises, labs and projects to turn concepts into usable skills."],
  ["03", "Give feedback that helps", "Show learners what is working, what needs attention and what to do next."],
  ["04", "Prepare beyond the syllabus", "Support resumes, project communication and interview readiness—not only course completion."],
  ["05", "Keep expectations transparent", "Communicate eligibility, learning effort and career-support processes clearly."],
  ["06", "Improve with the industry", "Review learning material as tools, roles and employer expectations evolve."],
];

const IMPACT = [
  ["For learners", "A clearer route from curiosity to practical confidence."],
  ["For families", "A learning decision they can understand and evaluate."],
  ["For employers", "Candidates who can explain and demonstrate what they know."],
  ["For communities", "More accessible pathways into technology careers."],
];

function Eyebrow({ children, dark = false }) {
  return <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] ${dark ? "text-amber-300" : "text-amber-700"}`}><span className={`h-px w-7 ${dark ? "bg-amber-300" : "bg-amber-600"}`} />{children}</p>;
}

export default function Mission() {
  useSeo({
    title: "Mission & Vision | Simatrix Academy",
    description: "Learn what Simatrix Academy stands for, the future we are working toward, and the commitments that shape every learner experience.",
    canonical: "/about/mission",
  });

  return <main id="main-content" className="overflow-hidden bg-white">
    <section className="relative isolate bg-[#0d1b32] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(30,143,224,.18),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(202,138,4,.16),transparent_30%),linear-gradient(140deg,#0a1020,#172642)]" />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20"><nav className="flex items-center gap-2 text-sm text-slate-400" aria-label="Breadcrumb"><Link to="/" className="hover:text-white">Home</Link><i className="ti ti-chevron-right text-xs" /><Link to="/about" className="hover:text-white">About</Link><i className="ti ti-chevron-right text-xs" /><span className="text-slate-200">Mission & Vision</span></nav><div className="grid items-end gap-10 pt-16 lg:grid-cols-[1.15fr_.85fr]"><div><Eyebrow dark>What guides us</Eyebrow><h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">Technology education should create <span className="text-amber-300">capability, not just certificates.</span></h1></div><p className="max-w-xl border-l border-white/15 pl-6 text-lg leading-8 text-slate-300">Our mission and vision define the learner experience we want to build—and the standard we expect ourselves to meet.</p></div></div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28"><div className="grid gap-6 lg:grid-cols-2"><article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10"><span aria-hidden="true" className="absolute -right-8 -top-16 font-display text-[12rem] font-semibold leading-none text-brand-900/[.035]">M</span><span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-800 text-2xl text-white shadow-lg"><i className="ti ti-target-arrow" /></span><Eyebrow>Our mission</Eyebrow><h2 className="relative mt-4 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">Help learners turn ambition into demonstrable technology skills.</h2><p className="relative mt-5 leading-7 text-slate-600">We create structured, practical learning experiences that connect foundational knowledge with projects, mentor feedback and career preparation. Our purpose is to help every learner understand what to learn, practise it meaningfully and communicate it confidently.</p></article><article className="group relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 sm:p-10"><span aria-hidden="true" className="absolute -right-8 -top-16 font-display text-[12rem] font-semibold leading-none text-amber-900/[.045]">V</span><span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-amber-500 text-2xl text-slate-950 shadow-lg"><i className="ti ti-eye" /></span><Eyebrow>Our vision</Eyebrow><h2 className="relative mt-4 font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">A future where career opportunity is shaped by capability, not uncertainty.</h2><p className="relative mt-5 leading-7 text-slate-600">We aim to become a trusted bridge between education and technology careers—known for making practical learning easier to navigate, widening access to guidance and helping learners become confident contributors in the workplace.</p></article></div></section>

    <section className="bg-slate-50 py-20 sm:py-28"><div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.8fr_1.2fr]"><div className="lg:sticky lg:top-24 lg:self-start"><Eyebrow>What we believe</Eyebrow><h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">Principles that shape everyday decisions</h2><p className="mt-5 leading-7 text-slate-600">These are not decorative values. They influence how courses are structured, how mentors support learners and how progress is discussed.</p></div><div className="grid gap-4 sm:grid-cols-2">{BELIEFS.map(([icon,title,text], index) => <article key={title} className="group relative min-h-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl"><span className="font-display text-5xl font-semibold text-slate-100">0{index + 1}</span><span className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-xl text-brand-700"><i className={`ti ${icon}`} /></span><h3 className="mt-8 font-display text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></div></section>

    <section className="bg-[#0d1b32] py-20 text-white sm:py-28"><div className="mx-auto max-w-7xl px-6"><div className="mx-auto max-w-3xl text-center"><Eyebrow dark>Our learner promise</Eyebrow><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">What our mission should look like in practice</h2><p className="mt-5 leading-7 text-slate-300">Learners should be able to experience these commitments—not merely read them on an About page.</p></div><ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">{PROMISES.map(([number,title,text]) => <li key={number} className="group bg-[#0d1b32] p-7 transition hover:bg-white/[.05]"><span className="font-display text-3xl text-amber-300">{number}</span><h3 className="mt-4 text-lg font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{text}</p></li>)}</ol></div></section>

    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28"><div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><Eyebrow>The change we want to create</Eyebrow><h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">Progress that extends beyond the classroom</h2><p className="mt-5 leading-7 text-slate-600">When practical education works well, its value reaches learners, families, employers and the wider community.</p></div><div className="grid gap-4 sm:grid-cols-2">{IMPACT.map(([title,text], index) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><span className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">{index + 1}</span><h3 className="mt-4 font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></section>

    <section className="bg-amber-50 py-20"><div className="mx-auto max-w-4xl px-6 text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">Experience the mission</p><h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">Choose your next learning step.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Explore practical programs or speak with a career guide when you need help deciding where to begin.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/courses" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-800 px-7 py-3 font-bold text-white transition hover:bg-brand-700">Explore courses<i className="ti ti-arrow-right" /></Link><Link to="/career-guidance" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-7 py-3 font-bold text-slate-800 transition hover:border-brand-300">Get free guidance</Link></div></div></section>
  </main>;
}
