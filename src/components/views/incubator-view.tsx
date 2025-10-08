"use client";

import { useSiteContent } from "@/components/content-provider";

export function IncubatorView() {
  const { content } = useSiteContent();
  const incubator = content.incubator;

  return (
    <div className="container-page space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary-200">{incubator.title}</h1>
        <p className="max-w-3xl text-sm text-slate-200">{incubator.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {incubator.stages.map((stage, index) => (
          <div key={stage.title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-200">{index + 1}</span>
            <h2 className="mt-3 text-lg font-semibold text-primary-100">{stage.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{stage.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
