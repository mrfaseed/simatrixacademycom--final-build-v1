import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = () => {
    setFailed(false);
    Promise.all([api.adminList("courses"), api.adminList("categories"), api.adminList("enquiries"), api.adminList("testimonials")])
      .then(([courses, categories, enquiries, testimonials]) => setData({ courses: courses.data || [], categories: categories.data || [], enquiries: enquiries.data || [], testimonials: testimonials.data || [] }))
      .catch(() => { setData({ courses: [], categories: [], enquiries: [], testimonials: [] }); setFailed(true); });
  };

  useEffect(() => { load(); }, []);
  const analytics = useMemo(() => data ? buildAnalytics(data.enquiries) : null, [data]);

  if (!data) return <DashboardSkeleton />;

  const cards = [
    { label: "Total enquiries", value: data.enquiries.length, icon: "ti-inbox", tone: "blue", to: "/admin/enquiries", note: `${analytics.newCount} awaiting response` },
    { label: "Active courses", value: data.courses.filter((item) => item.is_active !== false && item.is_active !== 0).length, icon: "ti-book-2", tone: "amber", to: "/admin/courses", note: `${data.categories.length} categories` },
    { label: "Student reviews", value: data.testimonials.length, icon: "ti-message-star", tone: "violet", to: "/admin/testimonials", note: "Published feedback" },
    { label: "Conversions", value: analytics.converted, icon: "ti-chart-line", tone: "emerald", to: "/admin/enquiries", note: `${analytics.conversionRate}% conversion rate` },
  ];

  return <div className="min-h-full p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-[1600px]">
      {failed && <div className="mb-5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><span><i className="ti ti-alert-triangle mr-2" />Some dashboard data could not be loaded.</span><button type="button" onClick={load} className="font-bold underline">Retry</button></div>}

      <section className="relative overflow-hidden rounded-3xl bg-brand-950 p-6 text-white shadow-xl shadow-brand-950/15 sm:p-8">
        <div className="bg-dotgrid absolute inset-0 opacity-25" /><div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" /><div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[.22em] text-accent-300">Workspace overview</p><h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Welcome back to Simatrix.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-brand-100">Review new student interest, maintain course content and keep the academy website up to date.</p></div>
          <div className="flex flex-wrap gap-3"><Link to="/admin/enquiries" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent-400 px-5 text-sm font-bold text-brand-950 hover:bg-accent-300"><i className="ti ti-inbox" /> Review enquiries</Link><Link to="/admin/courses" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-bold hover:bg-white/15"><i className="ti ti-plus" /> Manage courses</Link></div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <MetricCard key={card.label} {...card} />)}</section>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,.7fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Student pipeline</p><h3 className="mt-1 font-display text-2xl font-bold text-slate-950">Recent enquiries</h3></div><Link to="/admin/enquiries" className="text-sm font-bold text-brand-700 hover:text-accent-700">View all <i className="ti ti-arrow-right ml-1" /></Link></div>
          {data.enquiries.length ? <div className="divide-y divide-slate-100">{data.enquiries.slice(0, 7).map((item) => <Link key={item.id} to="/admin/enquiries" className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{item.name?.charAt(0)?.toUpperCase() || "?"}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{item.name}</p><p className="truncate text-xs text-slate-500">{item.course_title || item.type || "General enquiry"} · {item.phone}</p></div><Status value={item.status} /><span className="hidden text-xs text-slate-400 sm:block">{dateLabel(item.created_at)}</span><i className="ti ti-chevron-right text-slate-300" /></Link>)}</div> : <Empty icon="ti-inbox-off" title="No enquiries yet" text="New student enquiries will appear here." />}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Enquiry status</p><h3 className="mt-1 font-display text-2xl font-bold text-slate-950">Pipeline health</h3><div className="mt-6 space-y-4">{analytics.statuses.map((item) => <div key={item.label}><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold capitalize text-slate-600">{item.label}</span><span className="font-bold text-slate-900">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} /></div></div>)}</div></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Quick actions</p><div className="mt-4 grid grid-cols-2 gap-3">{[["/admin/blog","ti-news","New article"],["/admin/gallery","ti-photo","Add gallery"],["/admin/testimonials","ti-star","Reviews"],["/admin/settings","ti-settings","Settings"]].map(([to, icon, label]) => <Link key={to} to={to} className="group rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"><i className={`ti ${icon} mb-3 block text-xl text-slate-400 group-hover:text-brand-600`} />{label}</Link>)}</div></section>
        </div>
      </div>
    </div>
  </div>;
}

function buildAnalytics(enquiries) {
  const statusNames = ["new", "contacted", "qualified", "converted", "lost"];
  const colors = ["bg-brand-500", "bg-sky-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500"];
  const total = enquiries.length || 1;
  const counts = Object.fromEntries(statusNames.map((name) => [name, enquiries.filter((item) => item.status === name).length]));
  return { newCount: counts.new, converted: counts.converted, conversionRate: Math.round((counts.converted / total) * 100), statuses: statusNames.map((label, index) => ({ label, value: counts[label], percent: Math.round((counts[label] / total) * 100), color: colors[index] })) };
}

function MetricCard({ label, value, icon, tone, to, note }) { const tones = { blue: "bg-brand-50 text-brand-700", amber: "bg-amber-50 text-amber-700", violet: "bg-violet-50 text-violet-700", emerald: "bg-emerald-50 text-emerald-700" }; return <Link to={to} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"><div className="flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${tones[tone]}`}><i className={`ti ${icon}`} /></span><i className="ti ti-arrow-up-right text-slate-300 transition group-hover:text-brand-600" /></div><p className="mt-5 text-3xl font-extrabold text-slate-950">{value}</p><p className="mt-1 text-sm font-bold text-slate-700">{label}</p><p className="mt-2 text-xs text-slate-400">{note}</p></Link>; }
function Status({ value = "new" }) { const tones = { new: "bg-violet-50 text-violet-700", contacted: "bg-sky-50 text-sky-700", qualified: "bg-amber-50 text-amber-700", converted: "bg-emerald-50 text-emerald-700", lost: "bg-rose-50 text-rose-700" }; return <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold capitalize sm:inline-flex ${tones[value] || tones.new}`}>{value}</span>; }
function dateLabel(value) { if (!value) return ""; return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
function Empty({ icon, title, text }) { return <div className="px-6 py-16 text-center"><i className={`ti ${icon} text-3xl text-slate-300`} /><p className="mt-3 font-bold text-slate-800">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div>; }
function DashboardSkeleton() { return <div className="animate-pulse p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-[1600px]"><div className="h-56 rounded-3xl bg-slate-200" /><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-44 rounded-2xl bg-slate-200" />)}</div><div className="mt-6 grid gap-6 xl:grid-cols-3"><div className="h-96 rounded-2xl bg-slate-200 xl:col-span-2" /><div className="h-96 rounded-2xl bg-slate-200" /></div></div></div>; }
