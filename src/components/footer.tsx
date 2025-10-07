import { useSiteContent } from "@/components/content-provider";

export function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-400">
        <span>{content.footer.rights}</span>
        <span>{content.footer.contact}</span>
      </div>
    </footer>
  );
}
