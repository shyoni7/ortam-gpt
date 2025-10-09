import Image from "next/image";
import Link from "next/link";
import type { AppLocale } from "@/i18n/request";
import type { HomePageContent, PageCommon } from "@/content/types";
import { Markdown } from "@/components/markdown";
import { buildNavigationHref, isExternalNavigationHref } from "@/lib/navigation";

type HomeViewProps = {
  locale: AppLocale;
  content: HomePageContent;
  relatedPages: PageCommon[];
};

export function HomeView({ locale, content, relatedPages }: HomeViewProps) {
  const cta = content.cta;

  function renderCta(
    label: string,
    href: string,
    variant: "primary" | "secondary"
  ) {
    const resolvedHref = buildNavigationHref(locale, href);
    const isExternal = isExternalNavigationHref(resolvedHref) || resolvedHref.startsWith("#");
    const className =
      variant === "primary"
        ? "rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary-500/30 transition-transform hover:-translate-y-0.5 hover:bg-primary-400"
        : "rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-400 hover:text-accent-200";

    if (isExternal) {
      return (
        <a
          key={`${label}-${href}`}
          href={resolvedHref}
          target={resolvedHref.startsWith("http") ? "_blank" : undefined}
          rel={resolvedHref.startsWith("http") ? "noreferrer" : undefined}
          className={className}
        >
          {label}
        </a>
      );
    }

    return (
      <Link key={`${label}-${href}`} className={className} href={resolvedHref}>
        {label}
      </Link>
    );
  }
  return (
    <div className="container-page space-y-16 py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="space-y-6 text-center lg:text-start">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{content.title}</h1>
          {content.subtitle && <p className="text-base text-slate-200 lg:text-lg">{content.subtitle}</p>}
          <Markdown content={content.body} className="mx-auto max-w-none text-sm lg:text-base" />
          {cta && (cta.primaryLabel || cta.secondaryLabel) && (
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              {cta.primaryLabel && cta.primaryHref &&
                renderCta(cta.primaryLabel, cta.primaryHref, "primary")}
              {cta.secondaryLabel && cta.secondaryHref &&
                renderCta(cta.secondaryLabel, cta.secondaryHref, "secondary")}
            </div>
          )}
        </div>
        {content.hero && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/50 shadow-xl shadow-primary-500/10">
            <Image
              src={content.hero.url}
              alt={content.hero.alt}
              width={720}
              height={480}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </section>

      {relatedPages.length > 0 && (
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPages.map((page) => (
              <article key={page.slug} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-primary-200">{page.title}</h3>
                {page.subtitle && <p className="mt-2 text-sm text-slate-300">{page.subtitle}</p>}
                <Markdown content={page.body} className="mt-3 max-w-none text-xs text-slate-400" />
                <Link
                  className="mt-4 inline-flex items-center text-sm font-semibold text-accent-200 transition-colors hover:text-accent-100"
                  href={buildNavigationHref(locale, `/${page.slug}`)}
                >
                  {locale === "he" ? "למעבר לעמוד" : "View page"}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {content.gallery && content.gallery.length > 0 && (
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {content.gallery.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 shadow-inner shadow-slate-900/60"
              >
                <Image src={image.url} alt={image.alt} width={600} height={400} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
