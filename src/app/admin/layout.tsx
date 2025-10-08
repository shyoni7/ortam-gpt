import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { ContentProvider } from "@/components/content-provider";
import { LocaleAttributes } from "@/components/locale-attributes";

export const metadata: Metadata = {
  title: "ORTAM AI Admin",
  description: "Content management for the ORTAM AI marketing site.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LocaleAttributes locale="he" />
      <ContentProvider locale="he">
        <div className="min-h-screen" lang="he" dir="rtl">
          {children}
        </div>
      </ContentProvider>
    </>
  );
}
