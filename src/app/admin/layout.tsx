import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { LocaleAttributes } from "@/components/locale-attributes";

export const metadata: Metadata = {
  title: "ORTAM AI Admin",
  description: "Content management for the ORTAM AI marketing site.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LocaleAttributes locale="he" />
      <div className="min-h-screen bg-slate-950 text-slate-100" lang="he" dir="rtl">
        {children}
      </div>
    </>
  );
}
