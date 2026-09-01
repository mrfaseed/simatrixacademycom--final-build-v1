import { useEffect, useState } from "react";
import { api, mediaUrl } from "../api/client";
import { Section, Spinner, PageHero, Reveal, TiltCard } from "../components/ui";
import { useSeo } from "../lib/useSeo";

export default function Awards() {
  const [awards, setAwards] = useState(null);

  useEffect(() => {
    api.getAwards().then((res) => setAwards(res.data)).catch(() => setAwards([]));
  }, []);

  useSeo({
    title: "Awards & Recognition | Simatrix Academy",
    description: "Explore verified awards and recognition received by Simatrix Academy.",
  });

  return (
    <>
      <PageHero
        eyebrow="Recognition"
        title="Awards & Recognition"
        subtitle="A transparent record of recognition published by the academy, including the awarding organisation and year when available."
      />

      <Section className="py-16">
        {!awards ? (
          <div className="grid place-items-center py-20"><Spinner className="text-3xl" /></div>
        ) : awards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
            <i className="ti ti-award mb-2 block text-4xl text-brand-200" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">No recognition records are published yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Verified award details will appear here with the issuer and year when they are available.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 100}>
                <TiltCard className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-brand-600/10">
                  {/* corner glow */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent-400/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0" />
                  {a.image ? (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <img src={mediaUrl(a.image)} alt={a.title}
                        className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <span className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent-300 to-accent-600 text-3xl text-white shadow-lg shadow-accent-500/30 ring-1 ring-white/30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <i className="ti ti-award" />
                    </span>
                  )}
                  {a.year && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-500/15">
                      {a.year}
                    </span>
                  )}
                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-700">{a.title}</h3>
                  {a.issuer && <p className="mt-1 text-sm font-medium text-accent-600">{a.issuer}</p>}
                  {a.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.description}</p>}
                </TiltCard>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
