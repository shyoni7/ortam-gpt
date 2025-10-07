"use client";

import { useSiteContent } from "@/components/content-provider";

export function AboutView() {
  const { content } = useSiteContent();
  const about = content.about;

  return (
    <div className="container-page space-y-8 py-16">
      <h1 className="text-3xl font-bold text-primary-200">{about.title}</h1>
      <div className="space-y-4 text-sm text-slate-200">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
