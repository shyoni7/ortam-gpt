import Image from "next/image";
import type { AboutPageContent } from "@/content/types";
import { Markdown } from "@/components/markdown";

export function AboutView({ content }: { content: AboutPageContent }) {
  return (
    <div className="container-page space-y-8 py-16">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary-200">{content.title}</h1>
        {content.subtitle && <p className="text-base text-slate-200">{content.subtitle}</p>}
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
