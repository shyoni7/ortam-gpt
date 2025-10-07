"use client";

import { useSiteContent } from "@/components/content-provider";

export function PlacementView() {
  const { content } = useSiteContent();
  const placement = content.placement;

  return (
    <div className="container-page space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary-200">{placement.title}</h1>
        <p className="text-sm text-slate-200">{placement.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold text-accent-200">{placement.employersTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {placement.employers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold text-accent-200">{placement.candidatesTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {placement.candidates.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
