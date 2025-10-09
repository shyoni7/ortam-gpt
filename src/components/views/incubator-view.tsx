import Image from "next/image";
import type { IncubatorPageContent } from "@/content/types";
import { Markdown } from "@/components/markdown";

export function IncubatorView({ content }: { content: IncubatorPageContent }) {
  return (
    <div className="container-page space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary-200">{content.title}</h1>
        {content.subtitle && <p className="max-w-3xl text-sm text-slate-200">{content.subtitle}</p>}
        <Markdown content={content.body} className="max-w-none" />
      </div>
      {content.hero && (
        <div className="overflow-hidden rounded-3xl border border-slate-800/70">
          <Image
            src={content.hero.url}
            alt={content.hero.alt}
            width={1200}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
