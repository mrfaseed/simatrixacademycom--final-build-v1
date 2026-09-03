import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, mediaUrl } from "../api/client";
import { icon } from "../lib/icons";
import { Spinner } from "../components/ui";
import EnquiryForm from "../components/EnquiryForm";
import { useSeo } from "../lib/useSeo";
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";

const HERO_SLIDES = [
  {
    eyebrow: "September 1–30 limited-time offer",
    title: "Get 20% off Full Stack and AI courses.",
    text: "Build in-demand development and artificial intelligence skills through practical training, projects and mentor support.",
    quote: "The right skills today create stronger opportunities tomorrow.",
    theme: "campus",
    primary: { label: "Explore eligible courses", to: "/courses" },
    secondary: { label: "Get free guidance", action: "enquiry" },
    benefits: ["20% course offer", "Full Stack & AI tracks", "September enrolment"],
  },
  {
    eyebrow: "Government and Vinsys-supported opportunity",
    title: "Join a free internship with a ₹12,000 stipend.",
    text: "Gain practical experience through an internship supported by the government and the Vinsys team, with placement preparation and career support.",
    quote: "Experience turns what you know into confidence employers can see.",
    theme: "launchpad",
    primary: { label: "Apply for internship", href: "#internship" },
    secondary: { label: "View courses", to: "/courses" },
    benefits: ["₹12,000 stipend", "Free internship", "Placement support"],
  },
  {
    eyebrow: "Free guidance every Saturday",
    title: "Career guidance for school and college students.",
    text: "Get age-appropriate guidance to understand career options, learning paths and the skills needed to make confident academic and career decisions.",
    quote: "Clarity is the first step toward a career you can grow with.",
    theme: "universe",
    primary: { label: "Book Saturday guidance", to: "/career-guidance" },
    secondary: { label: "Explore programs", to: "/courses" },
    benefits: ["Every Saturday", "School students", "College students"],
  },
];

const STORIES = [
  { name: "Priya Kumari", role: "Full Stack Developer", quote: "The practical projects gave me the confidence to explain my work clearly in interviews." },
  { name: "Sanjay Rao", role: "Data Analyst", quote: "Mentor feedback helped me move from tutorials to building a portfolio I was proud to share." },
  { name: "Meera Varma", role: "Cloud Engineer", quote: "Mock interviews and resume reviews made the job search feel structured and achievable." },
];

const STEPS = [
  ["01", "Choose your direction", "Compare learning paths or speak with a counsellor when you are unsure where to begin."],
  ["02", "Learn by building", "Practise each concept through guided exercises and portfolio-ready industry projects."],
  ["03", "Prepare for interviews", "Strengthen your resume, communication, technical answers and interview confidence."],
  ["04", "Move toward your role", "Apply with a clearer profile and continued career support from the Simatrix team."],
];

const VISITOR_PATHS = [
  { icon: "ti-compass", label: "I’m exploring", title: "Find the right tech path", text: "Compare domains, course levels and career outcomes before you commit.", action: "Explore all courses", to: "/courses" },
  { icon: "ti-briefcase", label: "I need experience", title: "Build a portfolio you can explain", text: "Learn through practical work designed to give freshers something meaningful to discuss in interviews.", action: "View placement assistance", to: "/placement" },
  { icon: "ti-message-circle", label: "I need direction", title: "Talk to a career guide", text: "Share your background and goals, then get a clearer recommendation for your next step.", action: "Book free guidance", to: "/career-guidance" },
];

const OUTCOMES = [
  ["ti-folders", "Portfolio-ready projects", "Turn concepts into practical work you can demonstrate and explain."],
  ["ti-file-description", "A stronger professional profile", "Improve how your skills, projects and experience appear on your resume."],
  ["ti-messages", "Interview confidence", "Practise technical explanations and common interview conversations."],
  ["ti-route", "A clearer career roadmap", "Know which skills to build now and what your next milestone should be."],
];

const FAQS = [
  ["I’m a complete beginner. Can I still join?", "Yes. Start with a beginner-friendly path and build foundational skills before moving into projects. A guidance session can help you choose the appropriate level."],
  ["How do I know which course is right for me?", "Consider your current skills, the role you want and the time you can commit. If you are unsure, request free guidance before enrolling."],
  ["What makes the learning practical?", "Courses focus on guided exercises, projects, feedback and interview preparation so that you practise applying what you learn."],
  ["What happens after I submit an enquiry?", "The Simatrix team will contact you to understand your goal and share relevant course, eligibility and batch information."],
];

const TRUST_LINKS = [
  ["ti-star", "Student reviews", "Read experiences shared by learners", "/reviews"],
  ["ti-trophy", "Awards & recognition", "Explore Simatrix achievements", "/awards"],
  ["ti-compass", "Career guidance", "Understand your next learning step", "/career-guidance"],
  ["ti-briefcase", "Placement support", "Understand our career-support process", "/placement"],
];

const LANGUAGE_ITEMS = [
  ["ti-brand-html5", "HTML5", "text-orange-500"], ["ti-brand-css3", "CSS3", "text-sky-400"],
  ["ti-brand-javascript", "JavaScript", "text-yellow-400"], ["ti-brand-typescript", "TypeScript", "text-blue-400"],
  ["ti-brand-react", "React", "text-cyan-400"], ["ti-brand-nodejs", "Node.js", "text-green-400"],
  ["ti-brand-python", "Python", "text-yellow-300"], ["ti-brand-java", "Java", "text-orange-400"],
  ["ti-brand-php", "PHP", "text-indigo-300"], ["ti-brand-c-sharp", "C#", "text-violet-400"],
  ["ti-brand-golang", "Go", "text-cyan-300"], ["ti-brand-kotlin", "Kotlin", "text-purple-400"],
  ["ti-brand-swift", "Swift", "text-orange-400"], ["ti-brand-flutter", "Flutter", "text-sky-400"],
  ["ti-brand-github", "GitHub", "text-white"], ["ti-brand-docker", "Docker", "text-blue-400"],
  ["ti-brand-aws", "AWS", "text-amber-300"], ["ti-database", "SQL", "text-emerald-300"],
];

function initials(name = "Student") {
  return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function SectionTitle({ eyebrow, title, description, dark = false, left = false }) {
  return <div className={`${left ? "" : "mx-auto text-center"} max-w-2xl`}>
    <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] ${dark ? "text-amber-300" : "text-amber-700"}`}><span className={`h-px w-7 ${dark ? "bg-amber-300" : "bg-amber-600"}`} />{eyebrow}<span className={`h-px w-7 ${left ? "hidden" : ""} ${dark ? "bg-amber-300" : "bg-amber-600"}`} /></p>
    <h2 className={`mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>
    {description && <p className={`mt-4 leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}>{description}</p>}
  </div>;
}

function CourseTile({ course }) {
  return <Link to={`/courses/${course.slug}`} className="group relative mx-auto flex h-full w-full max-w-[350px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_-24px_rgba(15,23,42,.45)] transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_20px_45px_-26px_rgba(15,23,42,.5)] focus-visible:ring-2 focus-visible:ring-brand-500">
    <span className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-gradient-to-r from-amber-400 via-brand-600 to-brand-900 transition-transform duration-500 group-hover:scale-x-100" />
    <div className="relative aspect-[16/7] overflow-hidden bg-gradient-to-br from-brand-50 to-slate-100">
      {course.image ? <img src={mediaUrl(course.image)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-3xl text-brand-700"><i className={icon(course.icon || course.category?.icon || "book")} /></div>}
    </div>
    <div className="flex flex-1 flex-col p-4">
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">{course.duration && <span><i className="ti ti-clock mr-1" />{course.duration}</span>}{course.level && <span><i className="ti ti-chart-bar mr-1" />{course.level}</span>}</div>
      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-slate-950 group-hover:text-brand-700">{course.title}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-5 text-slate-600">{course.summary}</p>
      <span className="mt-3 inline-flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-brand-700"><span>View course</span><span className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 transition group-hover:bg-brand-700 group-hover:text-white"><i className="ti ti-arrow-right transition-transform group-hover:translate-x-0.5" /></span></span>
    </div>
  </Link>;
}

function PopularCoursesCarousel({ courses }) {
  const trackRef = useRef(null);
  const move = (direction) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return <div className="mt-8">
    <div ref={trackRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {courses.map((course) => <div key={course.id} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"><CourseTile course={course} /></div>)}
    </div>
    <div className="mt-3 flex items-center justify-between gap-4">
      <div className="flex gap-2" role="group" aria-label="Browse popular courses">
        <button type="button" onClick={() => move(-1)} aria-label="Previous popular course" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur transition hover:border-sky-300/60 hover:bg-white/20"><i className="ti ti-arrow-left" /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next popular course" className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-600 text-white shadow-lg shadow-violet-950/30 transition hover:scale-105 hover:brightness-110"><i className="ti ti-arrow-right" /></button>
      </div>
      <Link to="/courses" className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:brightness-110">Explore all courses <i className="ti ti-arrow-up-right transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
    </div>
  </div>;
}

function TestimonialsCarousel({ testimonials }) {
  const reviewCard = (item, index, duplicate = false) => <figure key={`${duplicate ? "copy" : "review"}-${item.id || item.name || index}`} aria-hidden={duplicate ? "true" : undefined} className="relative flex min-h-64 w-[min(82vw,360px)] shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_55px_-30px_rgba(15,23,42,.55)] lg:w-[380px]"><i aria-hidden="true" className="ti ti-quote absolute -right-3 -top-5 text-8xl text-brand-900/[.035]" /><div className="relative flex gap-1 text-amber-500" aria-label={duplicate ? undefined : "5 out of 5 stars"}>{Array.from({ length: 5 }).map((_, star) => <i key={star} className="ti ti-star-filled" />)}</div><blockquote className="relative mt-5 flex-1 leading-7 text-slate-700">“{item.quote || item.content || item.message}”</blockquote><figcaption className="relative mt-6 flex items-center gap-3 border-t border-slate-100 pt-5"><span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800 ring-4 ring-brand-50">{initials(item.name)}</span><span><strong className="block text-sm text-slate-950">{item.name}</strong><span className="text-xs text-slate-500">{item.role || item.designation || "Simatrix learner"}</span></span></figcaption></figure>;

  return <div className="testimonial-spinner mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]" aria-roledescription="carousel" aria-label="Automatically scrolling learner stories">
    <div className="testimonial-spinner-track flex w-max">
      {[false, true].map((duplicate) => <div key={duplicate ? "copy" : "original"} className="flex shrink-0 gap-5 pr-5">{testimonials.map((item, index) => reviewCard(item, index, duplicate))}</div>)}
    </div>
    <style>{`
      .testimonial-spinner-track { animation: testimonial-spin 28s linear infinite; }
      .testimonial-spinner:hover .testimonial-spinner-track, .testimonial-spinner:focus-within .testimonial-spinner-track { animation-play-state: paused; }
      @keyframes testimonial-spin { to { transform: translateX(-50%); } }
      @media (prefers-reduced-motion: reduce) { .testimonial-spinner { overflow-x: auto; } .testimonial-spinner-track { animation: none; } }
    `}</style>
  </div>;
}

function TechnologyMarquee() {
  const rows = [LANGUAGE_ITEMS.slice(0, 9), LANGUAGE_ITEMS.slice(9)];
  return <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-[#0a1020] py-7 text-white shadow-xl" aria-label="Programming languages and technologies">
    <div className="mb-5 flex items-center justify-between gap-4 px-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Technologies you can explore</p><p className="mt-1 text-sm text-slate-300">Languages, frameworks and tools used in modern development.</p></div><i className="ti ti-code text-3xl text-white/20" aria-hidden="true" /></div>
    <div className="language-marquee space-y-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {rows.map((row, rowIndex) => <div key={rowIndex} className={`language-track flex w-max ${rowIndex ? "language-track-reverse" : ""}`}>
        {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1 ? "true" : undefined}>{row.map(([ic, name, color]) => <span key={`${copy}-${name}`} className="flex min-w-max items-center gap-2.5 rounded-xl border border-white/10 bg-white/[.07] px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-white/25 hover:bg-white/[.13]"><i className={`ti ${ic} text-xl ${color}`} /><span>{name}</span></span>)}</div>)}
      </div>)}
    </div>
    <style>{`
      .language-track { animation: language-scroll 28s linear infinite; }
      .language-track-reverse { animation-direction: reverse; animation-duration: 34s; }
      .language-marquee:hover .language-track, .language-marquee:focus-within .language-track { animation-play-state: paused; }
      @keyframes language-scroll { to { transform: translateX(-50%); } }
      @media (prefers-reduced-motion: reduce) { .language-track { animation: none; } .language-marquee { overflow-x: auto; } }
    `}</style>
  </div>;
}

function CommunitySection({ data, courses, testimonials }) {
  const suppliedStats = Array.isArray(data?.stats) ? data.stats.slice(0, 4) : [];
  const stats = suppliedStats.length ? suppliedStats.map((item) => ({ value: item.value || item.number || item.count, label: item.label || item.title })) : [
    { value: `${courses.length}+`, label: "Courses to explore" },
    { value: `${data?.categories?.length || 0}`, label: "Technology domains" },
    { value: "50+", label: "Real World Projects" },
    { value: `${testimonials.length}`, label: "Learner stories published" },
  ];
  const people = [avatar1, avatar2, avatar3];
  const technologies = [
    ["ti-brand-html5", "HTML5", "Structures modern web pages"], ["ti-brand-css3", "CSS3", "Styles responsive interfaces"],
    ["ti-brand-javascript", "JavaScript", "Adds interactive web behavior"], ["ti-brand-react", "React", "Builds component-based interfaces"],
    ["ti-brand-nodejs", "Node.js", "Runs JavaScript on servers"], ["ti-brand-python", "Python", "Powers web, data and AI apps"],
    ["ti-brand-github", "GitHub", "Hosts and collaborates on code"], ["ti-brand-docker", "Docker", "Packages apps into containers"],
    ["ti-brand-aws", "AWS", "Deploys apps in the cloud"], ["ti-database", "Databases", "Stores and manages application data"],
    ["ti-cloud", "Cloud", "Runs scalable online services"], ["ti-api", "APIs", "Connects applications and services"],
  ];

  return <section className="bg-white pb-8 pt-8 sm:pb-10 sm:pt-12" aria-labelledby="community-title"><div className="mx-auto max-w-7xl px-6"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">Why Simatrix</p><h2 id="community-title" className="mt-3 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">You don’t have to learn alone.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Connect practical learning with mentor support, peer momentum and technology-focused career preparation.</p><div className="mt-8 flex justify-center -space-x-3" aria-label="Simatrix learner community">{people.map((src, index) => <img key={src} src={src} alt="" className="h-14 w-14 rounded-full border-4 border-white object-cover shadow-md" />)}{["AK","RS","MP","VK","SN"].map((name, index) => <span key={name} className={`grid h-14 w-14 place-items-center rounded-full border-4 border-white text-xs font-bold text-white shadow-md ${["bg-brand-700","bg-amber-600","bg-emerald-700","bg-violet-700","bg-slate-800"][index]}`}>{name}</span>)}</div></div>
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ["ti-book-2", "Comprehensive Curriculum", "Industry-aligned syllabus covering fundamentals to advanced, real-world topics."],
        ["ti-code", "Real-World Projects", "Hands-on projects that mirror the work you’ll do on the job."],
        ["ti-route", "Personalized Learning Paths", "Flexible tracks tailored to your goals and current skill level."],
        ["ti-briefcase", "Job Placement Assistance", "Resume building, mock interviews and placement drives with hiring partners."],
      ].map(([ic, title, text]) => <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_-26px_rgba(15,23,42,.45)] transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white"><i className={`ti ${ic}`} /></span><h3 className="mt-5 font-display text-xl font-semibold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{stats.map((stat, index) => <div key={`${stat.label}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><strong className="font-display text-4xl font-semibold text-slate-950">{stat.value}</strong><p className="mt-1 text-sm text-slate-600">{stat.label}</p></div>)}</div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2"><article className="relative min-h-64 self-start overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-700">Always-on learning support</p><h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">Questions become progress when you can discuss them.</h3><p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">Learn through mentor feedback, peer conversations, project reviews and structured career preparation.</p><div className="absolute inset-x-6 bottom-5 flex flex-wrap items-center gap-3 text-2xl sm:gap-4 sm:text-3xl" aria-hidden="true">{["ti-message-circle","ti-brand-whatsapp","ti-brand-instagram","ti-mail","ti-video"].map((item, index) => <span key={item} className={`grid h-11 w-11 place-items-center rounded-xl bg-white shadow-md ${index % 2 ? "rotate-3 text-emerald-600" : "-rotate-3 text-brand-700"}`}><i className={`ti ${item}`} /></span>)}</div></article><article className="relative min-h-64 self-start rounded-3xl border border-slate-200 bg-[#0d1b32] p-6 text-white sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-300">Build with relevant tools</p><h3 className="mt-1.5 font-display text-xl font-semibold">From foundations to modern technology stacks.</h3><p className="mt-1.5 max-w-lg text-xs leading-5 text-slate-300">Explore technologies through guided courses and combine them into portfolio-ready projects.</p><div className="mt-3 flex max-w-sm flex-wrap gap-2" aria-label="Technologies covered">{technologies.map(([ic, name, detail]) => <button type="button" key={name} aria-label={`${name}: ${detail}`} className="group/tech relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/10 text-lg text-white transition hover:-translate-y-1 hover:bg-white hover:text-brand-800 focus-visible:bg-white focus-visible:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"><i className={`ti ${ic}`} /><span className="pointer-events-none absolute bottom-[calc(100%+.5rem)] left-1/2 z-20 w-44 -translate-x-1/2 translate-y-1 rounded-lg bg-white px-3 py-2 text-left text-xs leading-4 text-slate-600 opacity-0 shadow-xl transition group-hover/tech:translate-y-0 group-hover/tech:opacity-100 group-focus-visible/tech:translate-y-0 group-focus-visible/tech:opacity-100"><strong className="mb-1 block text-slate-950">{name}</strong>{detail}</span></button>)}</div></article></div>
    {/* <TechnologyMarquee /> */}
  </div></section>;
}

function HeroSlideVisual({ theme }) {
  if (theme === "guidance") return <div className="relative mx-auto w-full max-w-[540px]" aria-label="Saturday career guidance program illustration" role="img"><div className="absolute -inset-8 rounded-full bg-violet-400/10 blur-3xl" /><div className="relative overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-[#241b4f] via-[#172642] to-[#111b31] p-6 shadow-[0_28px_70px_-24px_rgba(0,0,0,.75)] sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Free every Saturday</p><h2 className="mt-2 font-display text-2xl font-semibold">Career clarity starts here.</h2></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-400/15 text-2xl text-violet-300"><i className="ti ti-calendar-event" /></span></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><i className="ti ti-school text-3xl text-violet-300" /><strong className="mt-5 block">School students</strong><span className="mt-1 block text-xs leading-5 text-slate-400">Explore interests, subjects and future career possibilities.</span></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><i className="ti ti-building-community text-3xl text-amber-300" /><strong className="mt-5 block">College students</strong><span className="mt-1 block text-xs leading-5 text-slate-400">Understand skill paths, roles and career preparation.</span></div></div><div className="mt-4 flex items-center justify-between rounded-xl border border-violet-300/20 bg-violet-300/10 px-4 py-3"><span className="flex items-center gap-2 text-sm"><i className="ti ti-clock text-violet-300" />Available every Saturday</span><span className="rounded-full bg-violet-300 px-3 py-1 text-xs font-bold text-slate-950">FREE</span></div></div></div>;

  if (theme === "internship") return <div className="relative mx-auto w-full max-w-[540px]" aria-label="Free internship with stipend and placement support illustration" role="img"><div className="absolute -inset-8 rounded-full bg-emerald-400/10 blur-3xl" /><div className="relative overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-[#0c302e] via-[#102a34] to-[#111b31] p-6 shadow-[0_28px_70px_-24px_rgba(0,0,0,.75)] sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Free internship program</p><h2 className="mt-2 font-display text-2xl font-semibold">Learn with real experience.</h2></div><span className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-right"><strong className="block text-xl text-emerald-300">₹12,000</strong><span className="text-[10px] uppercase tracking-wider text-slate-400">Stipend</span></span></div><div className="mt-6 rounded-2xl border border-white/10 bg-[#08151d] p-5"><p className="text-xs uppercase tracking-[.18em] text-slate-500">Program support</p><div className="mt-4 grid grid-cols-2 gap-3"><span className="rounded-xl bg-white/[.06] p-3 text-center text-sm font-semibold"><i className="ti ti-building-bank mr-2 text-emerald-300" />Government</span><span className="rounded-xl bg-white/[.06] p-3 text-center text-sm font-semibold"><i className="ti ti-users-group mr-2 text-emerald-300" />Vinsys team</span></div></div><div className="mt-5 grid grid-cols-3 gap-3">{[["ti-folders","Real projects"],["ti-currency-rupee","Stipend"],["ti-briefcase","Placement"]].map(([ic,label]) => <span key={label} className="grid place-items-center rounded-xl border border-white/10 bg-white/[.05] px-2 py-3 text-center text-xs text-slate-300"><i className={`ti ${ic} mb-1 text-xl text-emerald-300`} />{label}</span>)}</div></div></div>;

  return <div className="relative mx-auto w-full max-w-[540px]" aria-label="September Full Stack and AI course offer illustration" role="img"><div className="absolute -inset-8 rounded-full bg-orange-300/20 blur-3xl" /><div className="relative overflow-hidden rounded-[2rem] border border-orange-200/25 bg-gradient-to-br from-[#9a3412] via-[#7c2d12] to-[#431407] p-6 shadow-[0_28px_70px_-24px_rgba(67,20,7,.9)] sm:p-8"><div aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-300/20 blur-2xl" /><div className="relative flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-200">September 1–30</p><h2 className="mt-2 font-display text-3xl font-semibold">Course offer</h2></div><span className="grid h-20 w-20 place-items-center rounded-full border border-amber-100/50 bg-gradient-to-br from-yellow-200 to-orange-300 text-center text-orange-950 shadow-lg shadow-orange-950/30"><strong className="text-2xl leading-none">20%</strong><span className="-mt-5 text-[10px] font-bold uppercase">Off</span></span></div><div className="relative mt-7 grid grid-cols-2 gap-4"><div className="rounded-2xl border border-orange-100/15 bg-white/[.09] p-5"><i className="ti ti-stack-2 text-3xl text-amber-200" /><strong className="mt-6 block text-lg">Full Stack</strong><span className="mt-1 block text-xs leading-5 text-orange-100/70">Frontend, backend, databases and deployment.</span></div><div className="rounded-2xl border border-orange-100/15 bg-white/[.09] p-5"><i className="ti ti-brain text-3xl text-yellow-200" /><strong className="mt-6 block text-lg">AI Courses</strong><span className="mt-1 block text-xs leading-5 text-orange-100/70">Practical artificial intelligence learning paths.</span></div></div><div className="relative mt-4 flex items-center justify-between rounded-xl border border-amber-200/25 bg-amber-200/10 px-4 py-3 text-xs"><span className="flex items-center gap-2 text-orange-50"><i className="ti ti-calendar text-amber-200" />Limited September enrolment</span><strong className="text-amber-200">SAVE 20%</strong></div></div></div>;
}

function CarouselThemeVisual({ theme }) {
  if (theme === "launchpad") return <div className="relative mx-auto h-[400px] w-full max-w-[540px] overflow-hidden rounded-[2rem] border border-orange-200/20 bg-gradient-to-br from-[#312e81] via-[#7c2d12] to-[#431407] shadow-[0_28px_70px_-24px_rgba(0,0,0,.8)]" role="img" aria-label="Career launchpad with rocket, pathway and achievement milestones"><div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-amber-300/20 blur-3xl" /><div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1e1b4b] to-transparent" /><div className="absolute bottom-12 left-12 right-12 h-28 rounded-[50%] border-t-2 border-dashed border-amber-200/40" /><div className="absolute bottom-20 left-[43%] grid h-24 w-24 -rotate-12 place-items-center rounded-full bg-orange-300/10 text-7xl text-amber-200 drop-shadow-2xl motion-safe:animate-[launchFloat_5s_ease-in-out_infinite]"><i className="ti ti-rocket" /></div>{[["left-6 bottom-8","ti-code","Build"],["left-16 top-28","ti-certificate","Achieve"],["right-8 top-16","ti-briefcase","Launch"]].map(([position,ic,label]) => <span key={label} className={`absolute ${position} flex items-center gap-2 rounded-xl border border-white/15 bg-slate-950/55 px-3 py-2 text-xs font-bold shadow-xl backdrop-blur`}><i className={`ti ${ic} text-lg text-amber-200`} />{label}</span>)}<div className="absolute left-7 top-7"><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-200">Career launchpad</p><h2 className="mt-2 font-display text-2xl font-semibold">Experience that moves you forward.</h2></div><div className="absolute bottom-5 right-6 rounded-xl border border-emerald-200/20 bg-emerald-300/15 px-4 py-2 text-right"><strong className="block text-lg text-emerald-200">₹12,000</strong><span className="text-[10px] uppercase tracking-wider text-orange-100/70">Stipend</span></div></div>;

  if (theme === "universe") return <div className="relative mx-auto h-[400px] w-full max-w-[540px] overflow-hidden rounded-[2rem] border border-violet-200/20 bg-[radial-gradient(circle_at_50%_45%,#312e81,#11112c_48%,#030712_85%)] shadow-[0_28px_70px_-24px_rgba(0,0,0,.9)]" role="img" aria-label="Code universe with programming languages represented as orbiting planets"><div className="absolute inset-0 opacity-50 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:34px_34px]" /><div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/20" /><div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-300/25 motion-safe:animate-[spin_24s_linear_infinite]" /><div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-indigo-600 shadow-[0_0_55px_rgba(167,139,250,.45)]"><i className="ti ti-compass text-4xl" /></div>{[["left-10 top-20","ti-brand-python","Python","bg-yellow-300 text-slate-950"],["right-10 top-28","ti-brand-react","React","bg-cyan-300 text-slate-950"],["bottom-10 left-24","ti-brand-javascript","JS","bg-amber-300 text-slate-950"],["bottom-16 right-20","ti-brand-nodejs","Node","bg-emerald-300 text-slate-950"]].map(([position,ic,label,color]) => <span key={label} className={`absolute ${position} grid h-14 w-14 place-items-center rounded-full ${color} shadow-[0_0_28px_rgba(255,255,255,.18)]`}><i className={`ti ${ic} text-2xl`} /><span className="sr-only">{label}</span></span>)}<div className="absolute left-6 top-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Code universe</p><h2 className="mt-2 font-display text-2xl font-semibold">Explore a universe of possibilities.</h2></div><span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-xs text-slate-300 backdrop-blur">Free guidance every Saturday</span></div>;

  if (theme !== "campus") return <HeroSlideVisual theme={theme} />;
  return <div className="relative mx-auto h-[400px] w-full max-w-[540px] overflow-hidden rounded-[2rem] border border-sky-200/25 bg-gradient-to-b from-[#075985] via-[#0369a1] to-[#0c4a6e] shadow-[0_28px_70px_-24px_rgba(3,105,161,.85)]" role="img" aria-label="Modern digital academy campus with floating technology elements"><div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-100 to-amber-300 shadow-[0_0_60px_rgba(253,224,71,.45)]" /><div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-emerald-950/80 to-transparent" /><div className="absolute bottom-12 left-1/2 h-52 w-72 -translate-x-1/2 rounded-t-[2.5rem] border border-white/20 bg-gradient-to-br from-slate-100/95 to-sky-100/80 p-5 shadow-2xl"><div className="mx-auto flex h-12 w-40 items-center justify-center rounded-xl bg-sky-900 text-sm font-bold tracking-wide text-white">SIMATRIX</div><div className="mt-5 grid grid-cols-5 gap-3">{Array.from({length:15}).map((_,index) => <span key={index} className="h-5 rounded bg-sky-700/70 shadow-inner" />)}</div><div className="absolute bottom-0 left-1/2 h-16 w-14 -translate-x-1/2 rounded-t-xl bg-sky-950" /></div>{[["left-5 top-20","ti-brand-react","text-cyan-200"],["right-5 top-32","ti-brand-python","text-yellow-200"],["left-10 bottom-12","ti-brain","text-violet-200"]].map(([position,ic,color]) => <span key={ic} className={`absolute ${position} grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-slate-950/45 text-2xl shadow-xl backdrop-blur ${color} motion-safe:animate-[campusFloat_6s_ease-in-out_infinite]`}><i className={`ti ${ic}`} /></span>)}<div className="absolute left-6 top-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-sky-100">Digital campus</p><h2 className="mt-2 font-display text-2xl font-semibold">Learn where technology comes alive.</h2></div><span className="absolute bottom-5 right-6 rounded-full bg-amber-300 px-4 py-2 text-sm font-extrabold text-orange-950 shadow-lg">20% OFF</span></div>;
}

function HeroCarousel({ onEnquiry }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const touchStart = useRef(null);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || tabHidden || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % HERO_SLIDES.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, tabHidden, timerKey]);

  const select = (index) => { setCurrent((index + HERO_SLIDES.length) % HERO_SLIDES.length); setTimerKey((value) => value + 1); };
  const move = (direction) => select(current + direction);
  const buttonClass = (primary, dark = false) => primary
    ? `group/cta inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold shadow-[0_12px_28px_-14px_rgba(15,23,42,.7)] transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 ${dark ? "bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500 text-white hover:brightness-110 focus-visible:ring-sky-300 focus-visible:ring-offset-slate-950" : "bg-brand-900 text-white hover:bg-brand-800 focus-visible:ring-brand-400 focus-visible:ring-offset-[#f7f1e5]"}`
    : `group/cta inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border px-5 py-2 text-sm font-bold transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 ${dark ? "border-white/20 bg-white/[.08] text-white hover:border-sky-300/50 hover:bg-white/[.14] focus-visible:ring-white focus-visible:ring-offset-slate-950" : "border-brand-900/25 bg-white/65 text-brand-900 hover:border-brand-900/45 hover:bg-white focus-visible:ring-brand-500 focus-visible:ring-offset-[#f7f1e5]"}`;
  const action = (item, primary = false, dark = false) => item.to
    ? <Link to={item.to} className={buttonClass(primary, dark)}>{item.label}<i className="ti ti-arrow-right transition-transform duration-200 group-hover/cta:translate-x-1" /></Link>
    : item.href ? <a href={item.href} className={buttonClass(primary, dark)}>{item.label}<i className="ti ti-arrow-down transition-transform duration-200 group-hover/cta:translate-y-1" /></a>
    : <button type="button" onClick={onEnquiry} className={buttonClass(primary, dark)}>{item.label}<i className="ti ti-arrow-right transition-transform duration-200 group-hover/cta:translate-x-1" /></button>;

  return <section tabIndex={0} className="relative isolate overflow-hidden border-b border-white/10 bg-[#071426] text-white outline-none" aria-roledescription="carousel" aria-label="Simatrix opportunities" onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current == null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 50) move(distance > 0 ? -1 : 1); touchStart.current = null; }}>
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,.18),transparent_32%),radial-gradient(circle_at_15%_85%,rgba(168,85,247,.15),transparent_30%),linear-gradient(135deg,#071426,#101d3a)]" />
    <div className="absolute inset-0 -z-10 opacity-[.035] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:40px_40px]" />
    <div className="flex transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none" style={{ transform: `translateX(-${current * 100}%)` }}>
      {HERO_SLIDES.map((slide, index) => <article key={slide.eyebrow} className="relative w-full shrink-0 text-white" aria-hidden={index !== current} inert={index !== current}>
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${slide.theme === "universe" ? "bg-[radial-gradient(circle_at_80%_20%,rgba(244,114,182,.32),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(99,102,241,.3),transparent_34%),linear-gradient(120deg,#080b2d,#312e81_52%,#581c87)]" : slide.theme === "launchpad" ? "bg-[radial-gradient(circle_at_82%_20%,rgba(251,191,36,.3),transparent_30%),radial-gradient(circle_at_8%_88%,rgba(239,68,68,.22),transparent_34%),linear-gradient(120deg,#210c12,#7c2d12_52%,#4c1d5f)]" : "bg-[radial-gradient(circle_at_82%_18%,rgba(34,211,238,.3),transparent_30%),radial-gradient(circle_at_8%_88%,rgba(16,185,129,.22),transparent_34%),linear-gradient(120deg,#031827,#075985_52%,#064e3b)]"}`} />
        <div className="relative mx-auto grid min-h-[310px] max-w-[880px] items-center gap-3 px-5 pb-12 pt-2 md:min-h-[330px] md:grid-cols-[minmax(0,1.25fr)_minmax(240px,.75fr)] md:px-7 lg:gap-6">
          <div key={`copy-${current}`} className="mx-auto w-full max-w-[560px] text-center motion-safe:animate-[heroCopyIn_.55s_cubic-bezier(.22,1,.36,1)_both] md:mx-0 md:text-left"><div className="flex items-center justify-center gap-2 md:justify-start"><span className={`grid h-8 w-8 place-items-center rounded-lg border text-[10px] font-black ${slide.theme === "universe" ? "border-pink-300/30 bg-pink-300/15 text-pink-200" : slide.theme === "launchpad" ? "border-amber-300/30 bg-amber-300/15 text-amber-200" : "border-cyan-300/30 bg-cyan-300/15 text-cyan-200"}`}>0{index + 1}</span><p className={`inline-flex items-center gap-1.5 rounded-full border bg-white/[.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur ${slide.theme === "universe" ? "border-pink-300/20 text-pink-200" : slide.theme === "launchpad" ? "border-amber-300/20 text-amber-200" : "border-cyan-300/20 text-cyan-200"}`}><span className={`h-1.5 w-1.5 rounded-full ${slide.theme === "universe" ? "bg-pink-300" : slide.theme === "launchpad" ? "bg-amber-300" : "bg-cyan-300"}`} />{slide.eyebrow}</p></div><h1 className="mx-auto mt-2 max-w-[550px] font-display text-[1.65rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.95rem] md:mx-0 lg:text-[2.2rem]">{slide.title}</h1><p className="mx-auto mt-2 max-w-[540px] text-xs leading-5 text-slate-200 sm:text-sm md:mx-0">{slide.text}</p><div className="mt-2 flex flex-wrap justify-center gap-1.5 md:justify-start">{slide.benefits.map((benefit) => <span key={benefit} className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur"><i className="ti ti-circle-check-filled text-emerald-300" />{benefit}</span>)}</div><blockquote className={`mx-auto mt-2 flex max-w-[540px] items-start gap-1.5 rounded-lg border bg-black/15 px-2.5 py-1 text-[11px] italic leading-4 backdrop-blur md:mx-0 ${slide.theme === "universe" ? "border-pink-300/15 text-pink-100" : slide.theme === "launchpad" ? "border-amber-300/15 text-amber-100" : "border-cyan-300/15 text-cyan-100"}`}><i className="ti ti-quote shrink-0 text-sm" /><span>“{slide.quote}”</span></blockquote><div className="mt-3 flex flex-col justify-center gap-2 sm:flex-row md:justify-start">{action(slide.primary, true, true)}{action(slide.secondary, false, true)}</div></div>
          <div className="hidden h-[175px] min-w-0 place-items-center md:grid [&>div]:w-[147%] [&>div]:origin-center [&>div]:scale-[.4] lg:[&>div]:scale-[.44]"><CarouselThemeVisual theme={slide.theme} /></div>
        </div>
      </article>)}
    </div>
    <button type="button" onClick={() => move(-1)} aria-label="Previous slide" className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/55 text-white shadow-lg backdrop-blur-md transition duration-200 hover:scale-105 hover:border-white/40 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white lg:grid xl:left-8"><i className="ti ti-chevron-left" /></button>
    <button type="button" onClick={() => move(1)} aria-label="Next slide" className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/55 text-white shadow-lg backdrop-blur-md transition duration-200 hover:scale-105 hover:border-white/40 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white lg:grid xl:right-8"><i className="ti ti-chevron-right" /></button>
    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/15 bg-slate-950/55 px-3 py-2 shadow-lg shadow-black/20 backdrop-blur-xl" role="group" aria-label="Choose slide">{HERO_SLIDES.map((slide, index) => <button type="button" key={slide.eyebrow} onClick={() => select(index)} aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`} aria-current={index === current ? "true" : undefined} className={`relative h-2.5 overflow-hidden rounded-full transition-all duration-300 ${index === current ? "w-8 bg-white/25" : "w-2.5 bg-white/30 hover:bg-white/60"}`}>{index === current && !paused && !tabHidden && <span key={`${current}-${timerKey}`} className="hero-progress absolute inset-0 origin-left bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400" />}</button>)}</div>
    <style>{`
      @keyframes heroCopyIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes campusFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      @keyframes launchFloat { 0%, 100% { transform: translateY(0) rotate(-12deg); } 50% { transform: translateY(-8px) rotate(-8deg); } }
      @keyframes heroProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      .hero-progress { animation: heroProgress 6.5s linear forwards; }
      @media (prefers-reduced-motion: reduce) { .hero-progress { animation: none; } }
    `}</style>
  </section>;
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [enquiryIntent, setEnquiryIntent] = useState("guidance");
  const [scrollProgress, setScrollProgress] = useState(0);
  const enquiryRef = useRef(null);
  const mainRef = useRef(null);

  useSeo({
    title: "Test Test",
    description: "Learn practical technology skills through mentor-led training, projects, career guidance and placement assistance at Simatrix Academy.",
    canonical: "/",
    jsonLd: { "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Simatrix Academy", url: typeof window !== "undefined" ? window.location.origin : "" },
  });

  useEffect(() => {
    let active = true;
    api.getSite().then((res) => active && setData(res.data)).catch((err) => active && setError(err.message));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(pageHeight > 0 ? Math.min(window.scrollY / pageHeight, 1) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [data]);

  useEffect(() => {
    if (!data || !mainRef.current || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const sections = mainRef.current.querySelectorAll(":scope > section:not(:first-of-type)");
    sections.forEach((section) => section.classList.add("home-reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("home-reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [data]);

  const courses = useMemo(() => data?.categories?.flatMap((category) => category.courses || []) || [], [data]);
  const featured = courses.slice(0, 6);
  const testimonials = data?.testimonials?.length ? data.testimonials : STORIES;
  const toEnquiry = (intent = "guidance") => {
    setEnquiryIntent(typeof intent === "string" ? intent : "guidance");
    window.requestAnimationFrame(() => enquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (!data && !error) return <div className="grid min-h-[60vh] place-items-center bg-slate-50"><Spinner className="text-3xl" /></div>;

  return <main ref={mainRef} id="main-content" className="overflow-hidden bg-white">
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-transparent" aria-hidden="true"><span className="block h-full origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-brand-600 shadow-[0_0_12px_rgba(245,158,11,.45)]" style={{ transform: `scaleX(${scrollProgress})` }} /></div>
    <HeroCarousel onEnquiry={toEnquiry} />
    <CommunitySection data={data} courses={courses} testimonials={testimonials} />

    {/* <section className="border-b border-slate-200 bg-slate-50" aria-label="Why choose Simatrix"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4">{[["ti-code","Project-based","Build while learning"],["ti-users","Mentor-led","Get human feedback"],["ti-briefcase","Career-focused","Prepare for interviews"],["ti-calendar","Flexible paths","Learn at your level"]].map(([ic,title,text]) => <div key={title} className="bg-slate-50 px-5 py-7 text-center"><i className={`ti ${ic} text-2xl text-amber-700`} /><p className="mt-2 font-bold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div>)}</div></section> 
    <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-10"><div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 -z-10 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />
      <SectionTitle eyebrow="Start from where you are" title="What would help you most right now?" description="Choose the option that best describes your situation. You can change direction at any time." />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">{VISITOR_PATHS.map((path, index) => <article key={path.label} className={`group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${index === 2 ? "border-amber-300 bg-gradient-to-br from-amber-50 to-white" : "border-slate-200 bg-white"}`}><span aria-hidden="true" className="absolute -right-8 -top-10 font-display text-[8rem] font-bold leading-none text-slate-900/[.035]">{index + 1}</span><div className="relative flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700 ring-1 ring-brand-100"><i className={`ti ${path.icon}`} /></span><span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">{path.label}</span></div><h2 className="relative mt-6 font-display text-2xl font-semibold text-slate-950">{path.title}</h2><p className="relative mt-3 flex-1 text-sm leading-6 text-slate-600">{path.text}</p><Link to={path.to} className="relative mt-6 inline-flex items-center gap-2 font-bold text-brand-700">{path.action}<i className="ti ti-arrow-right transition-transform group-hover:translate-x-1" /></Link></article>)}</div>
    </section>
 */}
    <section className="border-y border-slate-200 bg-slate-50" aria-labelledby="verify-heading"><div className="mx-auto max-w-7xl px-6 py-10"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700">Verify before you decide</p><h2 id="verify-heading" className="mt-2 font-display text-2xl font-semibold text-slate-950">Explore the proof behind the promise</h2></div><p className="max-w-lg text-sm leading-6 text-slate-600">Use these resources to evaluate Simatrix on your own terms before sharing your details.</p></div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{TRUST_LINKS.map(([ic,title,text,to]) => <Link key={title} to={to} className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md"><i className={`ti ${ic} mt-0.5 text-xl text-brand-700`} /><span><strong className="block text-sm text-slate-950">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span></span><i className="ti ti-arrow-up-right ml-auto text-slate-400 transition group-hover:text-brand-700" /></Link>)}</div></div></section>

    {error ? <section className="mx-auto max-w-7xl px-6 py-20 text-center"><p className="text-slate-600">We couldn’t load the latest courses right now.</p><Link to="/courses" className="mt-4 inline-flex font-bold text-brand-700">Browse courses</Link></section> : <>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <SectionTitle eyebrow="Find your path" title="Choose the skill you want to build" description="Start with a field that matches your goals. Each path takes you from essential concepts to practical application." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.categories?.slice(0, 6).map((category) => <Link key={category.id} to={`/courses?category=${category.slug}`} className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-xl text-brand-700"><i className={icon(category.icon)} /></span><span className="min-w-0 flex-1"><strong className="block text-slate-950">{category.name}</strong><span className="mt-1 block text-sm text-slate-500">{(category.courses || []).length} courses</span></span><i className="ti ti-chevron-right text-slate-400 transition group-hover:translate-x-1" /></Link>)}</div>
      </section>
      {featured.length > 0 && <section className="bg-slate-50 py-20 sm:py-28"><div className="mx-auto max-w-7xl px-6"><SectionTitle left eyebrow="Popular programs" title="Start with a learner favourite" description="Compare outcomes, duration and difficulty before choosing your course." /><PopularCoursesCarousel courses={featured} /></div></section>}
    </>}

    <section id="internship" className="scroll-mt-24 bg-white py-20 sm:py-28"><div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">Free full-stack internship</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">Bridge the gap between learning and your first interview.</h2><p className="mt-5 max-w-2xl leading-7 text-slate-600">Designed for final-year students and freshers who need structured practice, project exposure and a clearer way to present their skills.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => toEnquiry("internship")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-800 px-6 py-3 font-bold text-white transition hover:bg-brand-700">Apply for the internship<i className="ti ti-arrow-right" /></button><Link to="/career-guidance" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-bold text-slate-800 transition hover:bg-slate-50">Check if it fits my goal</Link></div><p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><i className="ti ti-info-circle" />Eligibility and batch availability will be confirmed by the Simatrix team.</p></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8"><h3 className="font-display text-2xl font-semibold text-slate-950">What the experience focuses on</h3><ul className="mt-6 space-y-5">{[["ti-code","Guided technical practice","Apply full-stack concepts through structured tasks."],["ti-folders","Project exposure","Build work you can discuss during interviews."],["ti-message-dots","Mentor feedback","Understand what to improve and how to progress."],["ti-briefcase","Career preparation","Connect your technical work to resume and interview needs."]].map(([ic,title,text]) => <li key={title} className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-lg text-amber-700 shadow-sm"><i className={`ti ${ic}`} /></span><span><strong className="block text-sm text-slate-950">{title}</strong><span className="mt-1 block text-sm leading-6 text-slate-600">{text}</span></span></li>)}</ul></div></div></section>

 {/*  <section className="border-y border-slate-200 bg-white py-20 sm:py-24"><div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><SectionTitle left eyebrow="More than course completion" title="Leave with evidence of what you can do" description="For freshers, knowledge becomes valuable when it can be demonstrated. The learning experience is structured around tangible career preparation." /><div className="grid gap-4 sm:grid-cols-2">{OUTCOMES.map(([ic,title,text]) => <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-xl text-amber-700 shadow-sm"><i className={`ti ${ic}`} /></span><h3 className="mt-4 font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></section>  */}

    <section className="bg-[#0d1b32] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-6"><SectionTitle dark eyebrow="Your learning journey" title="A simple path from learning to opportunity" description="Every stage is designed to answer the question: what should I do next?" /><ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{STEPS.map(([number,title,text]) => <li key={number} className="rounded-2xl border border-white/10 bg-white/[.04] p-6"><span className="font-display text-3xl text-amber-300">{number}</span><h3 className="mt-4 text-lg font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{text}</p></li>)}</ol></div></section>

    <section className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28"><div aria-hidden="true" className="pointer-events-none absolute -left-32 top-24 -z-10 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" /><SectionTitle eyebrow="Learner stories" title="Confidence built through practice" description="What learners value most about their experience." /><TestimonialsCarousel testimonials={testimonials} /></section>

    <section className="bg-slate-50 py-20 sm:py-24"><div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[.75fr_1.25fr]"><SectionTitle left eyebrow="Before you decide" title="Questions students often ask" description="Clear expectations make it easier to choose your next step confidently." /><div className="space-y-3">{FAQS.map(([question,answer], index) => <details key={question} className="group rounded-xl border border-slate-200 bg-white open:border-brand-300 open:shadow-sm" open={index === 0}><summary className="flex min-h-14 list-none items-center justify-between gap-4 px-5 py-4 font-bold text-slate-900"><span>{question}</span><i className="ti ti-plus shrink-0 text-brand-700 transition-transform group-open:rotate-45" /></summary><p className="px-5 pb-5 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></div></section>

    <section ref={enquiryRef} className="scroll-mt-24 bg-amber-50 py-20 sm:py-28"><div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[.9fr_1.1fr]"><div className="lg:sticky lg:top-24"><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">{enquiryIntent === "internship" ? "Internship application" : "Free career guidance"}</p><h2 className="mt-3 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">{enquiryIntent === "internship" ? "Take the first step toward practical experience." : "Not sure which course fits you?"}</h2><p className="mt-5 max-w-lg leading-7 text-slate-600">{enquiryIntent === "internship" ? "Share your details so the team can confirm eligibility, availability and the next stage of the internship process." : "Tell us about your interests and current experience. Our team will help you identify a suitable next step—without pressure."}</p><ul className="mt-7 space-y-3 text-sm text-slate-700">{(enquiryIntent === "internship" ? ["Confirm your eligibility","Understand the internship process","Get current batch information"] : ["Discuss your career goal","Understand suitable learning paths","Get course and batch information"]).map((item) => <li key={item} className="flex gap-3"><i className="ti ti-check mt-0.5 text-emerald-700" />{item}</li>)}</ul></div><div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-xl shadow-amber-900/5 sm:p-8"><h3 className="font-display text-2xl font-semibold text-slate-950">{enquiryIntent === "internship" ? "Register your interest" : "Request a callback"}</h3><p className="mb-6 mt-2 text-sm text-slate-500">Complete the form and the team will contact you about the next step.</p><EnquiryForm courses={courses} compact type={enquiryIntent} /></div></div></section>
    <style>{`
      #main-content > section[class*="py-20"] { padding-top: 3.5rem; padding-bottom: 3.5rem; }
      #main-content > section:last-of-type { padding-bottom: 1rem; }
      @media (max-width: 640px) { #main-content > section[class*="py-20"] { padding-top: 2.5rem; padding-bottom: 2.5rem; } }
    `}</style>
  </main>;
}
