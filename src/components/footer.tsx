"use client";

import Link from "next/link";
import { useSiteContent } from "@/components/content-provider";

export function Footer() {
  const { content, locale } = useSiteContent();

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-400">
        <span>{content.footer.rights}</span>
        <span>{content.footer.contact}</span>
        <Link
          href="/admin"
          className="w-fit text-[11px] font-semibold text-primary-200 transition-colors hover:text-primary-100"
        >
          {locale === "he" ? "ניהול תכנים" : "Content admin"}
        </Link>
      </div>
    </footer>
  );
}
