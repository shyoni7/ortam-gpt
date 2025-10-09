import Image from "next/image";
import type { AcademyPageContent } from "@/content/types";
import { Markdown } from "@/components/markdown";

export function AcademyView({ content }: { content: AcademyPageContent }) {
  return (
    <div className="container-page space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary-200">{content.title}</h1>
        {content.subtitle && <p className="text-base text-slate-200">{content.subtitle}</p>}
        <Markdown content={content.body} className="max-w-none" />
      </div>
      {content.programs && content.programs.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.programs.map((program, index) => (
            <article
              key={`${program.title}-${index}`}
              className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm"
            >
              {program.image && (
                <div className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60">
                  <Image
                    src={program.image.url}
                    alt={program.image.alt}
                    width={320}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary-100">{program.title}</h2>
                {program.description && <p className="text-sm text-slate-300">{program.description}</p>}
                {program.sessionsLabel && (
                  <span className="inline-flex w-fit rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-accent-200">
                    {program.sessionsLabel}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
