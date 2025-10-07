"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteContent } from "@/components/content-provider";

export function HomeView() {
  const { content, locale } = useSiteContent();
  const hero = content.home;

  return (
    <div className="container-page space-y-16 py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="space-y-6 text-center lg:text-start">
          <span className="inline-flex items-center justify-center rounded-full bg-primary-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-200">
            {hero.eyebrow}
          </span>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{hero.heading}</h1>
          <p className="text-base text-slate-200 lg:text-lg">{hero.subheading}</p>
          <p className="text-sm text-slate-400 lg:text-base">{hero.description}</p>
          <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary-500/30 transition-transform hover:-translate-y-0.5 hover:bg-primary-400"
              href={`/${locale}${hero.primaryCta.path}`}
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-400 hover:text-accent-200"
              href={`/${locale}${hero.secondaryCta.path}`}
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/50 shadow-xl shadow-primary-500/10">
          <Image
            src={hero.media.src}
            alt={hero.media.alt}
            width={720}
            height={480}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary-200">
          {locale === "he" ? "ההצעה שלנו" : "How we create value"}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {hero.pillars.map((pillar) => (
            <div key={pillar.key} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-primary-200">{pillar.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{pillar.description}</p>
              <Link
                className="mt-4 inline-flex items-center text-sm font-semibold text-accent-200 transition-colors hover:text-accent-100"
                href={`/${locale}${pillar.path}`}
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-primary-200">
            {locale === "he" ? "מה קורה אצלנו" : "Scenes from the hub"}
          </h2>
          <p className="text-sm text-slate-400">
            {locale === "he"
              ? "טעימה מהחממה, מהאקדמיה ומהאפרנטיסשיפ – הכל ניתן לעריכה מהאדמין."
              : "A glimpse into the incubator, academy, and apprenticeship experiences – all editable from the admin."}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {hero.gallery.map((image) => (
            <div
              key={image.src}
              className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 shadow-inner shadow-slate-900/60"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
