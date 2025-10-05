import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORTAM AI – AI Innovation Hub",
  description:
    "Modern marketing site for ORTAM AI showcasing the incubator, academy, and placement services.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      {children}
    </html>
  );
}
