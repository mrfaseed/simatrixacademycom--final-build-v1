import { useEffect, useState } from "react";
import { api, mediaUrl } from "../api/client";
import { Section, Spinner, PageHero, Reveal } from "../components/ui";
import { useSeo } from "../lib/useSeo";

export default function Gallery() {
  const [images, setImages] = useState(null);

  useEffect(() => {
    api.getGallery().then((res) => setImages(res.data)).catch(() => setImages([]));
  }, []);

  useSeo({
    title: "Academy Gallery | Simatrix Academy",
    description: "Moments from our classrooms, events, workshops and placement drives.",
  });

  return (
    <>
      <PageHero eyebrow="Life at Simatrix" title="See learning beyond the course list." subtitle="Explore published moments from workshops, learning activities and academy events." />

      <Section className="py-16">
        {!images ? (
          <div className="grid place-items-center py-20"><Spinner className="text-3xl" /></div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center text-slate-500">
            <i className="ti ti-photo text-4xl" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">No gallery moments are published yet</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6">New workshop and learner-activity photos will appear here after they are reviewed.</p>
          </div>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {images.map((img, i) => (
              <Reveal key={img.id} delay={(i % 4) * 80} className="mb-4 break-inside-avoid">
                <figure className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/10">
                  <img src={mediaUrl(img.image)} alt={img.title || "Gallery"} loading="lazy"
                    className="w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-brand-950/70 via-brand-950/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {img.title && <figcaption className="p-4 text-sm font-medium text-white">{img.title}</figcaption>}
                  </div>
                  <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                    <i className="ti ti-zoom-in" />
                  </span>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
