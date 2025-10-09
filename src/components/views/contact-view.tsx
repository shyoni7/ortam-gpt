"use client";

import { useState, type FormEvent } from "react";
import type { ContactPageContent } from "@/content/types";
import type { AppLocale } from "@/i18n/request";
import { Markdown } from "@/components/markdown";

type ContactViewProps = {
  locale: AppLocale;
  content: ContactPageContent;
};

export function ContactView({ locale, content }: ContactViewProps) {
  const formConfig = content.contactForm;
  return (
    <div className="container-page space-y-8 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary-200">{content.title}</h1>
        {content.subtitle && <p className="text-sm text-slate-200">{content.subtitle}</p>}
        <Markdown content={content.body} className="max-w-none" />
        <div className="flex flex-col gap-2 text-xs text-slate-400">
          {content.email && <span>{content.email}</span>}
          {content.phone && <span>{content.phone}</span>}
          {content.address && <span>{content.address}</span>}
        </div>
      </div>
      {formConfig?.enabled ? (
        <ContactForm locale={locale} submitLabel={formConfig.submitLabel} successMessage={formConfig.successMessage} />
      ) : (
        <p className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          {locale === "he" ? "הטופס אינו פעיל כרגע. צרו קשר במייל או בטלפון." : "The form is currently disabled. Please reach out via email or phone."}
        </p>
      )}
    </div>
  );
}

type ContactFormProps = {
  locale: AppLocale;
  submitLabel?: string;
  successMessage?: string;
};

function ContactForm({ locale, submitLabel, successMessage }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setErrorMessage(body?.error || (locale === "he" ? "אירעה תקלה בשליחה." : "Submission failed."));
        setStatus("error");
        return;
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setErrorMessage(locale === "he" ? "אירעה תקלה בשליחה." : "Submission failed.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-live="polite">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span>{locale === "he" ? "שם מלא" : "Full name"}</span>
          <input
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-primary-400 focus:outline-none"
            name="name"
            type="text"
            required
            autoComplete="name"
            dir={locale === "he" ? "rtl" : "ltr"}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span>{locale === "he" ? "אימייל" : "Email"}</span>
          <input
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-primary-400 focus:outline-none"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        <span>{locale === "he" ? "איך נוכל לעזור?" : "How can we help?"}</span>
        <textarea
          className="min-h-[160px] rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-primary-400 focus:outline-none"
          name="message"
          required
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-accent-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={status === "loading"}
      >
        {status === "loading" ? (locale === "he" ? "שולח..." : "Sending...") : submitLabel ?? (locale === "he" ? "שליחה" : "Send")}
      </button>
      {status === "success" && (
        <p className="text-sm text-primary-200">{successMessage ?? (locale === "he" ? "הטופס נשלח בהצלחה!" : "Thanks! We'll be in touch soon.")}</p>
      )}
      {status === "error" && errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
    </form>
  );
}
