"use client";

import { useState, type FormEvent } from "react";
import { useSiteContent } from "@/components/content-provider";

export function ContactView() {
  const { content, locale } = useSiteContent();
  const contact = content.contact;

  return (
    <div className="container-page space-y-8 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary-200">{contact.title}</h1>
        <p className="text-sm text-slate-200">{contact.description}</p>
      </div>
      <ContactForm locale={locale} />
    </div>
  );
}

function ContactForm({ locale }: { locale: string }) {
  const { content } = useSiteContent();
  const messages = content.contact;
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
        setErrorMessage(body?.error || messages.errorMessage);
        setStatus("error");
        return;
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setErrorMessage(messages.errorMessage);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-live="polite">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span>{messages.fields.name}</span>
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
          <span>{messages.fields.email}</span>
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
        <span>{messages.fields.message}</span>
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
        {status === "loading" ? "..." : messages.fields.submit}
      </button>
      {status === "success" && <p className="text-sm text-primary-200">{messages.successMessage}</p>}
      {status === "error" && errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
    </form>
  );
}
