"use client";

import Image from "next/image";
import { useSiteContent } from "@/components/content-provider";

export function AcademyView() {
  const { content } = useSiteContent();
  const academy = content.academy;

  return (
    <div className="container-page space-y-8 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary-200">{academy.title}</h1>
        <p className="text-sm text-slate-200">{academy.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {academy.programs.map((program) => (
          <article
            key={program.key}
            className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60">
              <Image
                src={program.image.src}
                alt={program.image.alt}
                width={320}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-primary-100">{program.title}</h2>
              <p className="text-sm text-slate-300">{program.description}</p>
              <span className="inline-flex w-fit rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-accent-200">
                {program.duration}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
