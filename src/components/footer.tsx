import Link from "next/link";
import type { AppLocale } from "@/i18n/request";
import type { Navigation, ContactPageContent } from "@/content/types";

type FooterProps = {
  locale: AppLocale;
  navigation: Navigation;
  contact: ContactPageContent;
};

export function Footer({ locale, navigation, contact }: FooterProps) {
  const footerItems = [...navigation.footer.items].sort((a, b) => a.order - b.order);
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="container-page flex flex-col gap-4 py-8 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-3 text-slate-300">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.address && <span>{contact.address}</span>}
        </div>
        <nav className="flex flex-wrap gap-4 text-[13px]">
          {footerItems.map((item) => (
            <Link key={`${item.title}-${item.order}`} href={`/${locale}${item.path}`} className="transition-colors hover:text-accent-200">
              {item.title}
            </Link>
          ))}
        </nav>
        {navigation.footer.legal && <span>{navigation.footer.legal}</span>}
        <Link href="/admin" className="w-fit text-[11px] font-semibold text-primary-200 transition-colors hover:text-primary-100">
          {locale === "he" ? "ניהול תכנים" : "Content admin"}
        </Link>
      </div>
    </footer>
  );
}
