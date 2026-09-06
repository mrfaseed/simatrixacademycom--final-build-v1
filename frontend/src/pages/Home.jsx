import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, mediaUrl } from "../api/client";
import { icon } from "../lib/icons";
import { ResponsiveImage } from "../components/ui";
import PageLoader from "./Pageloader";
import EnquiryForm from "../components/EnquiryForm";
import { useSeo } from "../lib/useSeo";
import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const HERO_BANNERS = [
  {
    id: "banner-offer-20",
    src: "/banner/REF1.png",
    alt: "September Special Offer: Get 20% OFF Full Stack & AI Courses with hands-on projects and expert mentors",
    to: "/courses",
    title: "Get 20% OFF Full Stack & AI Courses",
  },
  {
    id: "banner-learn-build",
    src: "/banner/REF2.png",
    alt: "Learn Today, Build Tomorrow: Industry-oriented IT training programs with live classes and placement support",
    to: "/courses",
    title: "Learn Today. Build Tomorrow.",
  },
  {
    id: "banner-lead-tomorrow",
    src: "/banner/REF3.png",
    alt: "Learn Today, Lead Tomorrow: Practical learning and placement assistance from industry experts",
    to: "/career-guidance",
    title: "Learn Today. Lead Tomorrow.",
  },
  {
    id: "banner-learn-without-limits",
    src: "/banner/REF4.png",
    mobileSrc: "/banner/REF4_MOBILE.png",
    alt: "Learn Without Limits: Start Your Journey Toward a Successful Career in Technology",
    to: "/contact",
    title: "Learn Without Limits",
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

const TECH_ROW_1 = [
  {
    name: "HTML5",
    detail: "Structures modern web pages",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#E44D26] text-xs font-black text-white shadow-sm">
        5
      </span>
    ),
  },
  {
    name: "CSS3",
    detail: "Styles responsive interfaces",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#264DE4] text-xs font-black text-white shadow-sm">
        3
      </span>
    ),
  },
  {
    name: "JS",
    detail: "Adds interactive web behavior",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7DF1E] text-[11px] font-black text-black shadow-sm">
        JS
      </span>
    ),
  },
  {
    name: "React",
    detail: "Builds component-based interfaces",
    icon: <i className="ti ti-brand-react text-2xl text-cyan-400" />,
  },
  {
    name: "Node.js",
    detail: "Runs JavaScript on servers",
    icon: <i className="ti ti-brand-nodejs text-2xl text-emerald-400" />,
  },
  {
    name: "Python",
    detail: "Powers web, data and AI apps",
    icon: <i className="ti ti-brand-python text-2xl text-amber-300" />,
  },
  {
    name: "Git",
    detail: "Version control and collaboration",
    icon: (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F05032] text-xs font-bold text-white shadow-sm">
        <i className="ti ti-git-branch text-base" />
      </span>
    ),
  },
];

const TECH_ROW_2 = [
  {
    name: "Docker",
    detail: "Packages apps into containers",
    icon: <i className="ti ti-brand-docker text-2xl text-sky-400" />,
  },
  {
    name: "AWS",
    detail: "Deploys apps in the cloud",
    icon: (
      <span className="font-black text-amber-400 text-sm tracking-tighter">
        aws
      </span>
    ),
  },
  {
    name: "MySQL",
    detail: "Relational database management",
    icon: <i className="ti ti-brand-mysql text-2xl text-sky-400" />,
  },
  {
    name: "MongoDB",
    detail: "Document-oriented NoSQL database",
    icon: <i className="ti ti-brand-mongodb text-2xl text-emerald-400" />,
  },
  {
    name: "PostgreSQL",
    detail: "Enterprise-grade SQL database",
    icon: <i className="ti ti-database text-2xl text-sky-300" />,
  },
  {
    name: "API",
    detail: "Connects applications and services",
    icon: (
      <span className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white">
        API
      </span>
    ),
  },
  {
    name: "Cloud",
    detail: "Scalable cloud infrastructure",
    icon: <i className="ti ti-cloud text-2xl text-white" />,
  },
];

function CommunitySection({ data, courses, testimonials }) {
  const people = [avatar1, avatar2, avatar3];

  return (
    <section className="bg-white pb-12 pt-2 sm:pb-16 sm:pt-3" aria-labelledby="community-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header - Kept 100% untouched as requested */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-700">Why Simatrix</p>
          <h2 id="community-title" className="mt-3 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">
            You don’t have to learn alone.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Connect practical learning with mentor support, peer momentum and technology-focused career preparation.
          </p>
          <div className="mt-8 flex justify-center -space-x-3" aria-label="Simatrix learner community">
            {people.map((src) => (
              <img key={src} src={src} alt="" className="h-14 w-14 rounded-full border-4 border-white object-cover shadow-md" />
            ))}
            {["AK", "RS", "MP", "VK", "SN"].map((name, index) => (
              <span
                key={name}
                className={`grid h-14 w-14 place-items-center rounded-full border-4 border-white text-xs font-bold text-white shadow-md ${
                  ["bg-brand-700", "bg-amber-600", "bg-emerald-700", "bg-violet-700", "bg-slate-800"][index]
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* 1. Four Feature Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 01: Industry-Ready Learning */}
          <Link
            to="/courses"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-blue-50/30 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-xl"
          >
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-blue-100/60 blur-xl transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-200/70" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-school" />
                </span>
                <span className="font-mono text-sm font-semibold text-blue-300">01</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Industry-Ready Learning
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Learn skills aligned with today’s technology industry.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
                Explore Curriculum
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>

          {/* 02: Real-World Projects */}
          <Link
            to="/courses"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-emerald-50/30 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/80 hover:shadow-xl"
          >
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-emerald-100/60 blur-xl transition-all duration-300 group-hover:scale-125 group-hover:bg-emerald-200/70" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-code" />
                </span>
                <span className="font-mono text-sm font-semibold text-emerald-300">02</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Real-World Projects
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Build practical projects for your portfolio.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700">
                Explore Projects
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>

          {/* 03: Personalized Learning */}
          <Link
            to="/career-guidance"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-purple-50/30 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/80 hover:shadow-xl"
          >
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-purple-100/60 blur-xl transition-all duration-300 group-hover:scale-125 group-hover:bg-purple-200/70" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-users" />
                </span>
                <span className="font-mono text-sm font-semibold text-purple-300">03</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Personalized Learning
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Learn at your pace with guidance that fits your goals.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 transition-colors group-hover:text-purple-700">
                Personalize Track
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-purple-50 text-purple-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>

          {/* 04: Career & Placement Support */}
          <Link
            to="/placement"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-amber-50/30 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/80 hover:shadow-xl"
          >
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-amber-100/60 blur-xl transition-all duration-300 group-hover:scale-125 group-hover:bg-amber-200/70" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-2xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <i className="ti ti-briefcase" />
                </span>
                <span className="font-mono text-sm font-semibold text-amber-300">04</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Career &amp; Placement Support
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Prepare for interviews, careers and placement opportunities.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition-colors group-hover:text-amber-700">
                Placement Support
                <i className="ti ti-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-50 text-amber-600 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white">
                <i className="ti ti-arrow-right text-xs" />
              </span>
            </div>
          </Link>
        </div>

        {/* 2. Four Stats Cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
              <i className="ti ti-file-text" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">
                {courses.length ? `${courses.length}+` : "34+"}
              </strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Courses to explore</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-50 text-2xl text-purple-600">
              <i className="ti ti-stack-2" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">
                {data?.categories?.length || "10"}
              </strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Technology domains</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
              <i className="ti ti-file-text" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">50+</strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Real World Projects</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] sm:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-50 text-2xl text-purple-600">
              <i className="ti ti-users" />
            </span>
            <div>
              <strong className="font-display text-3xl font-bold text-slate-950">500+</strong>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Learners supported</p>
            </div>
          </div>
        </div>

        {/* 3. Two Big Bento Cards: Support (with Lottie) & Tech Stacks */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Support Card with Lottie */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] sm:p-8">
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Always-on learning support
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-slate-950 sm:text-3xl">
                  Questions become progress when you can discuss them.
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Learn through mentor feedback, peer conversations, project reviews and structured career preparation.
                </p>
                <div className="mt-6">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0b1528] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-900"
                  >
                    <span>Get Started</span>
                    <i className="ti ti-arrow-right text-xs" />
                  </Link>
                </div>
              </div>

              {/* Lottie Animation (Share.lottie) */}
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-full max-w-[280px] sm:h-56">
                  <DotLottieReact
                    src="/Lottie/Share.lottie"
                    loop
                    autoplay
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2.5 text-xs font-bold text-slate-800">Connect with our community</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://discord.gg"
                    target="_blank"
                    rel="noreferrer"
                    title="Discord"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#5865F2] shadow-xs transition hover:border-[#5865F2] hover:bg-[#5865F2]/10"
                  >
                    <i className="ti ti-brand-discord text-lg" />
                  </a>
                  <a
                    href="https://wa.me/919677781155"
                    target="_blank"
                    rel="noreferrer"
                    title="WhatsApp"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#25D366] shadow-xs transition hover:border-[#25D366] hover:bg-[#25D366]/10"
                  >
                    <i className="ti ti-brand-whatsapp text-lg" />
                  </a>
                  <a
                    href="https://instagram.com/simatrixacademy"
                    target="_blank"
                    rel="noreferrer"
                    title="Instagram"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#E4405F] shadow-xs transition hover:border-[#E4405F] hover:bg-[#E4405F]/10"
                  >
                    <i className="ti ti-brand-instagram text-lg" />
                  </a>
                  <a
                    href="https://linkedin.com/company/simatrixacademy"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#0A66C2] shadow-xs transition hover:border-[#0A66C2] hover:bg-[#0A66C2]/10"
                  >
                    <i className="ti ti-brand-linkedin text-lg" />
                  </a>
                  <a
                    href="https://youtube.com/@simatrixacademy"
                    target="_blank"
                    rel="noreferrer"
                    title="YouTube"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white text-[#FF0000] shadow-xs transition hover:border-[#FF0000] hover:bg-[#FF0000]/10"
                  >
                    <i className="ti ti-brand-youtube text-lg" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <i className="ti ti-shield-check text-lg" />
                </span>
                <div className="text-[11px] leading-tight">
                  <p className="font-semibold text-slate-700">Mentor-guided • Peer-driven • Project-focused</p>
                  <p className="mt-0.5 font-bold text-blue-700">Career-ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Tech Stack Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#050b18] p-7 text-white shadow-2xl sm:p-8">
            {/* Ambient Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl"
            />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 sm:text-[11px]">
                Build with relevant tools
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">
                From foundations to modern technology stacks.
              </h3>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                Explore technologies through guided courses and combine them into portfolio-ready projects.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {/* Row 1: 7 technologies */}
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                {TECH_ROW_1.map((item) => (
                  <div
                    key={item.name}
                    title={`${item.name} — ${item.detail}`}
                    className="group/tech flex h-16 cursor-default flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-1 transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.09] sm:h-18"
                  >
                    <span className="flex h-7 w-7 items-center justify-center text-xl sm:text-2xl">
                      {item.icon}
                    </span>
                    <span className="mt-1 text-[10px] font-medium tracking-tight text-slate-300 group-hover/tech:text-white">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 2: 7 technologies */}
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                {TECH_ROW_2.map((item) => (
                  <div
                    key={item.name}
                    title={`${item.name} — ${item.detail}`}
                    className="group/tech flex h-16 cursor-default flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-1 transition-all duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.09] sm:h-18"
                  >
                    <span className="flex h-7 w-7 items-center justify-center text-xl sm:text-2xl">
                      {item.icon}
                    </span>
                    <span className="mt-1 text-[10px] font-medium tracking-tight text-slate-300 group-hover/tech:text-white">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
              >
                <span>Explore All Technologies</span>
                <i className="ti ti-arrow-right text-xs" />
              </Link>

              {/* Handwritten "Learn Build Belong ↗" watermark */}
              <div className="select-none text-right font-caveat text-sm leading-tight text-slate-300 sm:text-base -rotate-3">
                <p className="tracking-wide">Learn</p>
                <p className="tracking-wide pl-1">Build</p>
                <p className="flex items-center justify-end gap-1 font-bold tracking-wide text-white">
                  <span>Belong</span>
                  <span className="text-base sm:text-lg">↗</span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function HeroCarousel({ onEnquiry }) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 639px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } else {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  const activeBanners = useMemo(() => {
    if (isMobile) {
      const mobileOnly = HERO_BANNERS.filter((b) => Boolean(b.mobileSrc)).map((b) => ({
        ...b,
        src: b.mobileSrc,
      }));
      return mobileOnly.length > 0 ? mobileOnly : HERO_BANNERS;
    }
    return HERO_BANNERS;
  }, [isMobile]);

  const isSingle = activeBanners.length <= 1;

  // Build slide list with boundary clones for infinite loop when multiple slides exist:
  // [Clone of Last, ...Banners, Clone of First]
  const extendedSlides = useMemo(() => {
    if (activeBanners.length <= 1) return activeBanners;
    const first = activeBanners[0];
    const last = activeBanners[activeBanners.length - 1];
    return [
      { ...last, keyId: `${last.id}-clone-start`, isClone: true, realIndex: activeBanners.length - 1 },
      ...activeBanners.map((b, i) => ({ ...b, keyId: b.id, isClone: false, realIndex: i })),
      { ...first, keyId: `${first.id}-clone-end`, isClone: true, realIndex: 0 },
    ];
  }, [activeBanners]);

  // Index 1 corresponds to activeBanners[0] when cloned; index 0 when single
  const [current, setCurrent] = useState(() => (activeBanners.length <= 1 ? 0 : 1));
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const hasDragged = useRef(false);
  const isAnimating = useRef(false);
  const containerRef = useRef(null);

  // Sync current index when switching between single and multiple banners
  useEffect(() => {
    setCurrent(activeBanners.length <= 1 ? 0 : 1);
  }, [activeBanners.length]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // When transition was disabled for instant boundary reset, re-enable it on next animation frame
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Safety fallback for isAnimating flag in case transitionend is interrupted
  useEffect(() => {
    if (isAnimating.current) {
      const timer = setTimeout(() => {
        isAnimating.current = false;
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [current]);

  // Autoplay (only when multiple slides exist)
  useEffect(() => {
    if (isSingle || paused || tabHidden || isDragging || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      setWithTransition(true);
      setCurrent((val) => val + 1);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isSingle, paused, tabHidden, isDragging]);

  const move = (direction) => {
    if (isSingle || isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setCurrent((val) => val + direction);
  };

  // Seamless jump when reaching boundary clones
  const handleTransitionEnd = (e) => {
    if (isSingle || e.target !== e.currentTarget) return;
    isAnimating.current = false;

    if (current >= extendedSlides.length - 1) {
      // Reached clone of first slide -> snap instantly to real first slide
      setWithTransition(false);
      setCurrent(1);
    } else if (current <= 0) {
      // Reached clone of last slide -> snap instantly to real last slide
      setWithTransition(false);
      setCurrent(extendedSlides.length - 2);
    }
  };

  // Unified Pointer Events (works for both mouse cursor on desktop and finger touch on mobile)
  const handlePointerDown = (e) => {
    if (isSingle) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (isAnimating.current) return;
    startX.current = e.clientX;
    setIsDragging(true);
    hasDragged.current = false;
    setDragOffset(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (isSingle || !isDragging) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 8) {
      hasDragged.current = true;
    }
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const clamped = Math.max(-containerWidth, Math.min(containerWidth, diff));
    setDragOffset(clamped);
  };

  const handlePointerUp = (e) => {
    if (isSingle || !isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    const threshold = 50;
    if (dragOffset < -threshold) {
      // Swiped left -> move to next
      isAnimating.current = true;
      setWithTransition(true);
      setCurrent((val) => val + 1);
    } else if (dragOffset > threshold) {
      // Swiped right -> move to previous
      isAnimating.current = true;
      setWithTransition(true);
      setCurrent((val) => val - 1);
    } else {
      // Snapped back
      setWithTransition(true);
    }
    setDragOffset(0);

    // Reset hasDragged after a brief delay so click handler can block unwanted link navigation during drag
    setTimeout(() => {
      hasDragged.current = false;
    }, 80);
  };

  const handlePointerCancel = () => {
    if (isSingle) return;
    setIsDragging(false);
    setDragOffset(0);
    setWithTransition(true);
    hasDragged.current = false;
  };

  return (
    <section
      className="relative w-full bg-white"
      aria-label="Simatrix Featured Announcements"
    >
      <div
        ref={containerRef}
        tabIndex={isSingle ? -1 : 0}
        className={`group relative w-full overflow-hidden bg-white outline-none select-none ${
          isSingle ? "" : isDragging ? "cursor-grabbing touch-pan-y" : "cursor-grab touch-pan-y"
        }`}
        aria-roledescription="carousel"
        aria-label="Simatrix opportunities"
        onKeyDown={(e) => {
          if (isSingle) return;
          if (e.key === "ArrowLeft") move(-1);
          if (e.key === "ArrowRight") move(1);
        }}
        onMouseEnter={() => !isSingle && setPaused(true)}
        onMouseLeave={() => !isSingle && setPaused(false)}
        onFocusCapture={() => !isSingle && setPaused(true)}
        onBlurCapture={(e) => {
          if (!isSingle && !e.currentTarget.contains(e.relatedTarget)) setPaused(false);
        }}
        onPointerDown={isSingle ? undefined : handlePointerDown}
        onPointerMove={isSingle ? undefined : handlePointerMove}
        onPointerUp={isSingle ? undefined : handlePointerUp}
        onPointerCancel={isSingle ? undefined : handlePointerCancel}
      >
        {/* Banner Slides Track */}
        <div
          className="flex motion-reduce:transition-none"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: isSingle ? "none" : `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
            transition: isSingle || isDragging || !withTransition ? "none" : "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {extendedSlides.map((banner, index) => {
            const isCurrent = isSingle ? true : index === current;
            return (
              <article
                key={banner.keyId || `${banner.id}-${index}`}
                className="relative w-full shrink-0 aspect-square sm:aspect-auto h-auto sm:h-[240px] md:h-[320px] lg:h-[470px] max-h-[85vh]"
                aria-hidden={!isCurrent}
                inert={!isCurrent ? "" : undefined}
              >
                <Link
                  to={banner.to}
                  onClick={(e) => {
                    if (hasDragged.current) {
                      e.preventDefault();
                    }
                  }}
                  className="block h-full w-full select-none focus:outline-none"
                  aria-label={banner.title}
                  tabIndex={isCurrent ? 0 : -1}
                  draggable="false"
                >
                  <ResponsiveImage
                    src={banner.src}
                    alt={banner.alt}
                    priority={isSingle ? true : index === 1}
                    widths={isMobile ? [360, 480, 640, 768, 1080, 1254] : [480, 768, 1080, 1440, 1920, 2120]}
                    sizes="100vw"
                    className="h-full w-full object-cover object-center select-none pointer-events-none"
                    draggable="false"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [enquiryIntent, setEnquiryIntent] = useState("guidance");
  const [scrollProgress, setScrollProgress] = useState(0);
  const enquiryRef = useRef(null);
  const mainRef = useRef(null);

  useSeo({
    title: "Simatrix Academy | Build Skills That Lead to Tech Careers",
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

  if (!data && !error) return <PageLoader />;

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
