import { useEffect, useState } from "react";
import { api } from "../api/client";
import { PageHero, Section, Reveal, Spinner } from "../components/ui";
import { useSeo } from "../lib/useSeo";
import ReviewForm from "../components/ReviewForm";

function Stars({ n = 5, className = "" }) {
  return <div className={`flex gap-1 text-amber-400 ${className}`} aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => <i key={i} aria-hidden="true" className={`ti ti-star-filled ${i < n ? "" : "text-slate-200"}`} />)}
  </div>;
}

export default function Reviews() {
  const [reviews, setReviews] = useState(null);
  const load = () => api.getReviews().then((r) => setReviews(r.data)).catch(() => setReviews([]));
  useEffect(() => { load(); }, []);
  useSeo({ title: "Student Reviews · Simatrix Academy", description: "Read approved feedback from Simatrix Academy learners and share your own training experience.", canonical: "/reviews" });

  const average = reviews?.length
    ? (reviews.reduce((sum, review) => sum + (review.rating || 5), 0) / reviews.length).toFixed(1)
    : null;

  return <>
    <PageHero eyebrow="Student stories" title="Real experiences. Honest perspectives." subtitle="Discover what learners say about their training, mentors and career journey at Simatrix Academy.">
      <div className="reveal mt-7 flex flex-wrap gap-3" style={{ "--d": "160ms" }}>
        {average && <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white backdrop-blur-sm">
          <span className="font-display text-3xl font-bold">{average}</span>
          <div className="border-l border-white/20 pl-4"><Stars n={Math.round(Number(average))} className="text-sm" /><p className="mt-1 text-xs text-slate-300">From {reviews.length} verified student {reviews.length === 1 ? "review" : "reviews"}</p></div>
        </div>}
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white backdrop-blur-sm">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300"><i className="ti ti-shield-check" /></span>
          <div><p className="text-sm font-semibold">Student-first feedback</p><p className="text-xs text-slate-300">Shared by our learner community</p></div>
        </div>
      </div>
    </PageHero>

    <Section className="py-16 sm:py-20">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-700">Learner feedback</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">What our students say</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">First-hand perspectives from students building practical, career-ready skills.</p></div>
        <a href="#share-review" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-brand-300 hover:text-brand-700 sm:self-auto">Share your experience <i className="ti ti-arrow-down" /></a>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <main>
          {!reviews ? <div className="grid min-h-72 place-items-center rounded-3xl border border-slate-200 bg-white"><Spinner className="text-3xl" /></div>
          : reviews.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700"><i className="ti ti-message-2-star" /></span><p className="mt-5 font-display text-xl font-semibold text-slate-900">Start the conversation</p><p className="mt-2 text-sm text-slate-500">Be the first student to share an experience.</p></div>
          : <div className="grid gap-5 sm:grid-cols-2">{reviews.map((review, index) => <Reveal key={review.id} delay={(index % 2) * 80} className="group flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5 sm:p-7">
              <div className="flex items-center justify-between"><Stars n={review.rating || 5} className="text-sm" /><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-300 transition group-hover:bg-brand-100 group-hover:text-brand-600"><i className="ti ti-quote" /></span></div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-slate-600">“{review.content}”</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-violet-600 font-bold text-white shadow-md shadow-brand-700/20">{review.name?.charAt(0).toUpperCase() || "?"}</span><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{review.name}</p><p className="truncate text-xs text-slate-500">{review.role || "Simatrix Academy student"}</p></div><i className="ti ti-circle-check-filled ml-auto text-lg text-emerald-500" title="Approved review" /></div>
            </Reveal>)}</div>}
        </main>

        <aside id="share-review" className="scroll-mt-28 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="bg-gradient-to-br from-[#0d1b32] via-brand-950 to-brand-800 p-6 text-white sm:p-7"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-xl text-amber-300"><i className="ti ti-pencil-star" /></span><h3 className="mt-5 font-display text-2xl font-semibold">Share your story</h3><p className="mt-2 text-sm leading-6 text-slate-300">Your experience can help another student choose their next step with confidence.</p></div>
            <div className="p-6 sm:p-7"><ReviewForm onSubmitted={load} /></div>
          </div>
        </aside>
      </div>
    </Section>
  </>;
}
