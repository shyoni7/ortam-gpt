"use client";

import {
  FormEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { validateSiteContent } from "@/content/schema";
import type { ImageItem, Locale, Program, SiteContent } from "@/content/types";
import { locales as supportedLocales } from "@/i18n/request";

const localeLabels: Record<Locale, string> = {
  he: "עברית",
  en: "English",
};

type SectionKey =
  | "global.brand"
  | "global.header"
  | "global.footer"
  | "global.meta"
  | "pages.home"
  | "pages.about"
  | "pages.academy"
  | "pages.incubator"
  | "pages.placement"
  | "pages.contact";

const sections: Array<{
  key: "global" | "pages";
  label: string;
  items: Array<{ key: SectionKey; label: string }>;
}> = [
  {
    key: "global",
    label: "גלובלי",
    items: [
      { key: "global.brand", label: "שם המותג" },
      { key: "global.header", label: "תפריט עליון" },
      { key: "global.footer", label: "תפריט תחתון" },
      { key: "global.meta", label: "הגדרות Meta" },
    ],
  },
  {
    key: "pages",
    label: "עמודים",
    items: [
      { key: "pages.home", label: "עמוד הבית" },
      { key: "pages.about", label: "עלינו" },
      { key: "pages.academy", label: "האקדמיה" },
      { key: "pages.incubator", label: "חממה טכנולוגית" },
      { key: "pages.placement", label: "מחלקת השמה" },
      { key: "pages.contact", label: "צור קשר" },
    ],
  },
];

const commonPageFieldTemplates: Array<{ label: string; path: string }> = [
  { label: "נתיב העמוד (Slug)", path: "slug" },
  { label: "כותרת", path: "title" },
  { label: "כותרת משנית", path: "subtitle" },
  { label: "תוכן (Markdown)", path: "body" },
  { label: "כתובת תמונת Hero", path: "hero.url" },
  { label: "טקסט אלטרנטיבי לתמונת Hero", path: "hero.alt" },
  { label: "כתובת תמונה בגלריה", path: "gallery.0.url" },
  { label: "טקסט אלטרנטיבי לתמונה בגלריה", path: "gallery.0.alt" },
];

function buildPageEntries(section: Extract<SectionKey, `pages.${string}`>) {
  return commonPageFieldTemplates.map(({ label, path }) => ({
    section,
    label,
    path: `${section}.${path}`,
  }));
}

const searchEntries: Array<{ section: SectionKey; label: string; path?: string }> = [
  { section: "global.brand", label: "שם המותג", path: "brandName" },
  { section: "global.header", label: "כותרת הקישור (ניווט עליון)", path: "navigation.header.items.0.title" },
  { section: "global.header", label: "נתיב הקישור (ניווט עליון)", path: "navigation.header.items.0.path" },
  { section: "global.footer", label: "כותרת הקישור (פוטר)", path: "navigation.footer.items.0.title" },
  { section: "global.footer", label: "נתיב הקישור (פוטר)", path: "navigation.footer.items.0.path" },
  { section: "global.footer", label: "טקסט משפטי בפוטר", path: "navigation.footer.legal" },
  { section: "global.meta", label: "תבנית כותרת", path: "meta.titleTemplate" },
  { section: "global.meta", label: "תיאור ברירת מחדל", path: "meta.description" },
  ...buildPageEntries("pages.home"),
  { section: "pages.home", label: "CTA ראשי - טקסט", path: "pages.home.cta.primaryLabel" },
  { section: "pages.home", label: "CTA ראשי - קישור", path: "pages.home.cta.primaryHref" },
  { section: "pages.home", label: "CTA משני - טקסט", path: "pages.home.cta.secondaryLabel" },
  { section: "pages.home", label: "CTA משני - קישור", path: "pages.home.cta.secondaryHref" },
  ...buildPageEntries("pages.about"),
  ...buildPageEntries("pages.academy"),
  { section: "pages.academy", label: "תוכניות – כותרת", path: "pages.academy.programs.0.title" },
  { section: "pages.academy", label: "תוכניות – תיאור", path: "pages.academy.programs.0.description" },
  { section: "pages.academy", label: "תוכניות – תגית מפגשים", path: "pages.academy.programs.0.sessionsLabel" },
  { section: "pages.academy", label: "תוכניות – כתובת תמונה", path: "pages.academy.programs.0.image.url" },
  { section: "pages.academy", label: "תוכניות – טקסט אלטרנטיבי לתמונה", path: "pages.academy.programs.0.image.alt" },
  ...buildPageEntries("pages.incubator"),
  ...buildPageEntries("pages.placement"),
  ...buildPageEntries("pages.contact"),
  { section: "pages.contact", label: "כתובת", path: "pages.contact.address" },
  { section: "pages.contact", label: "טלפון", path: "pages.contact.phone" },
  { section: "pages.contact", label: "אימייל", path: "pages.contact.email" },
  { section: "pages.contact", label: "הפעלת טופס", path: "pages.contact.contactForm.enabled" },
  { section: "pages.contact", label: "כפתור שליחה", path: "pages.contact.contactForm.submitLabel" },
  { section: "pages.contact", label: "הודעת הצלחה", path: "pages.contact.contactForm.successMessage" },
];

const sectionFieldLabels = searchEntries.reduce<Record<SectionKey, string[]>>((acc, entry) => {
  acc[entry.section] = acc[entry.section] ? [...acc[entry.section], entry.label] : [entry.label];
  return acc;
}, {
  "global.brand": [],
  "global.header": [],
  "global.footer": [],
  "global.meta": [],
  "pages.home": [],
  "pages.about": [],
  "pages.academy": [],
  "pages.incubator": [],
  "pages.placement": [],
  "pages.contact": [],
});

function escapeAttribute(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/"/g, '\\"');
}

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function getValue(object: unknown, path: string) {
  return path.split(".").reduce<any>((acc, key) => (acc == null ? acc : acc[key]), object as any);
}

function isIndexSegment(segment: string) {
  return /^\d+$/.test(segment);
}

function setDeepValue(target: any, path: string, value: unknown) {
  const segments = path.split(".");
  let current = target;
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const last = i === segments.length - 1;
    if (last) {
      if (isIndexSegment(segment)) {
        if (!Array.isArray(current)) {
          throw new Error(`Expected array for segment ${segment} in path ${path}`);
        }
        current[Number(segment)] = value;
      } else {
        current[segment] = value;
      }
      return;
    }
    const nextSegment = segments[i + 1];
    const nextIsIndex = isIndexSegment(nextSegment);
    if (isIndexSegment(segment)) {
      const index = Number(segment);
      if (!Array.isArray(current)) {
        throw new Error(`Expected array for segment ${segment} in path ${path}`);
      }
      if (current[index] == null) {
        current[index] = nextIsIndex ? [] : {};
      }
      current = current[index];
    } else {
      if (current[segment] == null) {
        current[segment] = nextIsIndex ? [] : {};
      } else if (nextIsIndex && !Array.isArray(current[segment])) {
        current[segment] = [];
      } else if (!nextIsIndex && (typeof current[segment] !== "object" || current[segment] === null)) {
        current[segment] = {};
      }
      current = current[segment];
    }
  }
}

type AdminAppProps = {
  initialContent: Record<Locale, SiteContent>;
};

type ToastState = { type: "success" | "error"; message: string } | null;

type AdminFormContextValue = {
  values: SiteContent;
  setFieldValue: (path: string, value: unknown) => void;
  clearErrors: (path: string, includeChildren?: boolean) => void;
  errors: Record<string, string>;
};

const AdminFormContext = createContext<AdminFormContextValue | null>(null);

function useAdminForm() {
  const context = useContext(AdminFormContext);
  if (!context) {
    throw new Error("Admin form context is unavailable");
  }
  return context;
}

export function AdminApp({ initialContent }: AdminAppProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("he");
  const [activeSection, setActiveSection] = useState<SectionKey>("global.brand");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [saving, setSaving] = useState(false);
  const [dirtyLocales, setDirtyLocales] = useState<Set<Locale>>(new Set());
  const [pendingFocus, setPendingFocus] = useState<{ label: string; path?: string } | null>(null);
  const [formValues, setFormValues] = useState<SiteContent>(() => clone(initialContent.he));
  const [errorMap, setErrorMap] = useState<Record<Locale, Record<string, string>>>(
    Object.fromEntries(supportedLocales.map((locale) => [locale as Locale, {}])) as Record<Locale, Record<string, string>>
  );

  const initialRef = useRef<Record<Locale, SiteContent>>(clone(initialContent));
  const draftsRef = useRef<Record<Locale, SiteContent>>(clone(initialContent));

  useEffect(() => {
    setFormValues(clone(draftsRef.current[activeLocale]));
    setErrorMap((prev) => ({ ...prev, [activeLocale]: {} }));
  }, [activeLocale]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const term = searchQuery.trim().toLowerCase();
    return sections
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const labels = sectionFieldLabels[item.key] ?? [];
          return (
            item.label.toLowerCase().includes(term) ||
            labels.some((label) => label.toLowerCase().includes(term))
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const localeDirty = dirtyLocales.has(activeLocale);
  const dirtyCount = dirtyLocales.size;

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (dirtyCount === 0) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirtyCount]);

  useEffect(() => {
    if (!pendingFocus) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      let target: HTMLElement | null = null;
      if (pendingFocus.path) {
        const selector = escapeAttribute(pendingFocus.path);
        target = document.querySelector<HTMLElement>(
          `[data-field-name="${selector}"] input, [data-field-name="${selector}"] textarea, [data-field-name="${selector}"] select`
        );
      }
      if (!target && pendingFocus.label) {
        const selector = escapeAttribute(pendingFocus.label);
        target = document.querySelector<HTMLElement>(
          `[data-field-label="${selector}"] input, [data-field-label="${selector}"] textarea, [data-field-label="${selector}"] select`
        );
      }
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setPendingFocus(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pendingFocus, activeSection]);

  const clearFieldErrors = useCallback(
    (path: string, includeChildren = false) => {
      setErrorMap((prev) => {
        const localeErrors = prev[activeLocale] ?? {};
        const keys = Object.keys(localeErrors).filter((key) =>
          includeChildren ? key === path || key.startsWith(`${path}.`) : key === path
        );
        if (keys.length === 0) {
          return prev;
        }
        const nextErrors = { ...localeErrors };
        keys.forEach((key) => delete nextErrors[key]);
        return { ...prev, [activeLocale]: nextErrors };
      });
    },
    [activeLocale]
  );

  const updateFormValues = useCallback(
    (mutator: (draft: SiteContent) => void) => {
      setFormValues((current) => {
        const next = clone(current);
        mutator(next);
        draftsRef.current[activeLocale] = clone(next);
        const baseline = initialRef.current[activeLocale];
        const dirty = JSON.stringify(next) !== JSON.stringify(baseline);
        setDirtyLocales((prev) => {
          const nextSet = new Set(prev);
          if (dirty) {
            nextSet.add(activeLocale);
          } else {
            nextSet.delete(activeLocale);
          }
          return nextSet;
        });
        return next;
      });
    },
    [activeLocale]
  );

  const setFieldValue = useCallback(
    (path: string, value: unknown) => {
      updateFormValues((draft) => setDeepValue(draft as any, path, value));
      clearFieldErrors(path);
    },
    [updateFormValues, clearFieldErrors]
  );

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === activeLocale) return;
    draftsRef.current[activeLocale] = clone(formValues);
    setActiveLocale(nextLocale);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      return;
    }
    const match = searchEntries.find((entry) => entry.label.toLowerCase().includes(term));
    if (!match) {
      setToast({ type: "error", message: "לא נמצאו שדות תואמים לחיפוש" });
      return;
    }
    setActiveSection(match.section);
    setPendingFocus(match);
  }

  function resetField(path: string) {
    const baselineValue = clone(getValue(initialRef.current[activeLocale], path));
    updateFormValues((draft) => setDeepValue(draft as any, path, baselineValue));
    clearFieldErrors(path, true);
  }

  function resetSection(section: SectionKey) {
    const baseline = clone(initialRef.current[activeLocale]);
    updateFormValues((draft) => {
      switch (section) {
        case "global.brand":
          draft.brandName = baseline.brandName;
          break;
        case "global.header":
          draft.navigation.header.items = clone(baseline.navigation.header.items);
          break;
        case "global.footer":
          draft.navigation.footer.items = clone(baseline.navigation.footer.items);
          draft.navigation.footer.legal = baseline.navigation.footer.legal;
          break;
        case "global.meta":
          draft.meta = baseline.meta ? clone(baseline.meta) : undefined;
          break;
        case "pages.home":
          draft.pages.home = clone(baseline.pages.home);
          break;
        case "pages.about":
          draft.pages.about = clone(baseline.pages.about);
          break;
        case "pages.academy":
          draft.pages.academy = clone(baseline.pages.academy);
          break;
        case "pages.incubator":
          draft.pages.incubator = clone(baseline.pages.incubator);
          break;
        case "pages.placement":
          draft.pages.placement = clone(baseline.pages.placement);
          break;
        case "pages.contact":
          draft.pages.contact = clone(baseline.pages.contact);
          break;
      }
    });
    setErrorMap((prev) => ({ ...prev, [activeLocale]: {} }));
  }

  async function persist() {
    const current = clone(formValues);
    const validationErrors = validateSiteContent(current);
    if (Object.keys(validationErrors).length > 0) {
      setErrorMap((prev) => ({ ...prev, [activeLocale]: validationErrors }));
      setToast({ type: "error", message: "נתוני תוכן אינם תקינים" });
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: activeLocale, data: current }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || "שמירה נכשלה");
      }
      const snapshot = clone(current);
      draftsRef.current[activeLocale] = snapshot;
      initialRef.current[activeLocale] = snapshot;
      setFormValues(snapshot);
      setDirtyLocales((prev) => {
        const next = new Set(prev);
        next.delete(activeLocale);
        return next;
      });
      setErrorMap((prev) => ({ ...prev, [activeLocale]: {} }));
      setToast({ type: "success", message: "השינויים נשמרו בהצלחה" });
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: error instanceof Error ? error.message : "שמירה נכשלה" });
    } finally {
      setSaving(false);
    }
  }

  const errors = errorMap[activeLocale] ?? {};

  const contextValue = useMemo<AdminFormContextValue>(
    () => ({ values: formValues, setFieldValue, clearErrors: clearFieldErrors, errors }),
    [formValues, setFieldValue, clearFieldErrors, errors]
  );

  return (
    <AdminFormContext.Provider value={contextValue}>
      <div className="flex min-h-screen">
        <aside className="w-72 border-l border-slate-800 bg-slate-900/70 p-4">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="חיפוש שדות"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary-400 focus:outline-none"
            />
          </form>
          <nav className="space-y-6 text-sm">
            {filteredSections.map((group) => (
              <div key={group.key} className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{group.label}</div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveSection(item.key)}
                      className={clsx(
                        "w-full rounded-lg px-3 py-2 text-right transition-colors",
                        activeSection === item.key ? "bg-primary-500/20 text-primary-100" : "hover:bg-slate-800/60"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <div className="flex-1 border-l border-slate-800">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300" htmlFor="admin-locale">
                שפה
              </label>
              <select
                id="admin-locale"
                value={activeLocale}
                onChange={(event) => handleLocaleChange(event.target.value as Locale)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none"
              >
                {supportedLocales.map((locale) => (
                  <option key={locale} value={locale}>
                    {localeLabels[locale as Locale]}
                  </option>
                ))}
              </select>
              {localeDirty && <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">יש שינויים שלא נשמרו</span>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => resetSection(activeSection)}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500"
              >
                איפוס טופס
              </button>
              <button
                type="button"
                onClick={() => persist()}
                disabled={saving || !localeDirty}
                className="rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-opacity hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "שומר..." : "שמור שינויים"}
              </button>
            </div>
          </header>
          <main className="p-6">
            <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
              {activeSection === "global.brand" && <BrandSection resetField={resetField} />}
              {activeSection === "global.header" && <HeaderNavSection />}
              {activeSection === "global.footer" && <FooterNavSection resetField={resetField} />}
              {activeSection === "global.meta" && <MetaSection resetField={resetField} />}
              {activeSection === "pages.home" && <HomePageSection resetField={resetField} />}
              {activeSection === "pages.about" && (
                <CommonPageSection title="עמוד עלינו" basePath="pages.about" resetField={resetField} />
              )}
              {activeSection === "pages.academy" && <AcademySection resetField={resetField} />}
              {activeSection === "pages.incubator" && (
                <CommonPageSection title="עמוד החממה" basePath="pages.incubator" resetField={resetField} />
              )}
              {activeSection === "pages.placement" && (
                <CommonPageSection title="עמוד ההשמה" basePath="pages.placement" resetField={resetField} />
              )}
              {activeSection === "pages.contact" && <ContactSection resetField={resetField} />}
            </form>
          </main>
        </div>
        {toast && (
          <div
            className={clsx(
              "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-6 py-3 text-sm font-medium shadow-lg",
              toast.type === "success" ? "bg-emerald-500 text-emerald-950" : "bg-rose-500 text-rose-950"
            )}
          >
            {toast.message}
          </div>
        )}
      </div>
    </AdminFormContext.Provider>
  );
}

type Resettable = { resetField: (path: string) => void };

type FieldProps = {
  label: string;
  name: string;
  resetField?: (path: string) => void;
  type?: string;
  textarea?: boolean;
  readOnly?: boolean;
};

function Field({ label, name, resetField, type = "text", textarea, readOnly }: FieldProps) {
  const { values, setFieldValue, clearErrors, errors } = useAdminForm();
  const rawValue = getValue(values, name);
  const value = type === "checkbox" ? Boolean(rawValue) : rawValue == null ? "" : String(rawValue);
  const error = errors[name];
  const fieldId = `field-${String(name).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  const baseClassName =
    "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none disabled:opacity-70";

  function handleReset() {
    resetField?.(name);
    clearErrors(name, true);
  }

  return (
    <div className="space-y-2" data-field-label={label} data-field-name={name}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-200" htmlFor={fieldId}>
          {label}
        </label>
        {resetField && !readOnly && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-semibold text-primary-200 transition-colors hover:text-primary-100"
          >
            איפוס שדה
          </button>
        )}
      </div>
      {textarea ? (
        <textarea
          id={fieldId}
          value={String(value)}
          readOnly={readOnly}
          onChange={(event) => {
            setFieldValue(name, event.target.value);
            clearErrors(name);
          }}
          className={`${baseClassName} min-h-[140px]`}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          readOnly={readOnly}
          checked={type === "checkbox" ? Boolean(value) : undefined}
          value={type === "checkbox" ? undefined : String(value)}
          onChange={(event) => {
            const nextValue = type === "checkbox" ? event.target.checked : event.target.value;
            setFieldValue(name, nextValue);
            clearErrors(name);
          }}
          className={baseClassName}
        />
      )}
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}

function BrandSection({ resetField }: Resettable) {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">שם המותג</h2>
        <p className="text-sm text-slate-400">השם שמופיע באתר.</p>
      </header>
      <Field label="שם המותג" name="brandName" resetField={resetField} />
    </section>
  );
}

function HeaderNavSection() {
  const { values, setFieldValue, clearErrors } = useAdminForm();
  const items = (getValue(values, "navigation.header.items") as Array<any>) ?? [];

  function addItem() {
    const next = [...items, { title: "", path: "", order: items.length }];
    setFieldValue("navigation.header.items", next);
    clearErrors("navigation.header.items", true);
  }

  function remove(index: number) {
    const next = items.filter((_, idx) => idx !== index).map((item, idx) => ({ ...item, order: idx }));
    setFieldValue("navigation.header.items", next);
    clearErrors("navigation.header.items", true);
  }

  function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    const normalized = next.map((item, idx) => ({ ...item, order: idx }));
    setFieldValue("navigation.header.items", normalized);
    clearErrors("navigation.header.items", true);
  }

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">תפריט עליון</h2>
        <p className="text-sm text-slate-400">ניהול קישורי הניווט.</p>
      </header>
      <div className="space-y-4">
        {items.map((item: any, index: number) => (
          <div key={index} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">פריט #{index + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => reorder(index, -1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => reorder(index, 1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-[11px] font-semibold text-rose-300 hover:text-rose-200"
                >
                  מחיקה
                </button>
              </div>
            </div>
            <Field label="כותרת הקישור (ניווט עליון)" name={`navigation.header.items.${index}.title`} />
            <Field label="נתיב הקישור (ניווט עליון)" name={`navigation.header.items.${index}.path`} />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
        >
          הוספת פריט
        </button>
      </div>
    </section>
  );
}

function FooterNavSection({ resetField }: Resettable) {
  const { values, setFieldValue, clearErrors } = useAdminForm();
  const items = (getValue(values, "navigation.footer.items") as Array<any>) ?? [];

  function addItem() {
    const next = [...items, { title: "", path: "", order: items.length }];
    setFieldValue("navigation.footer.items", next);
    clearErrors("navigation.footer.items", true);
  }

  function remove(index: number) {
    const next = items.filter((_, idx) => idx !== index).map((item, idx) => ({ ...item, order: idx }));
    setFieldValue("navigation.footer.items", next);
    clearErrors("navigation.footer.items", true);
  }

  function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    const normalized = next.map((item, idx) => ({ ...item, order: idx }));
    setFieldValue("navigation.footer.items", normalized);
    clearErrors("navigation.footer.items", true);
  }

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">תפריט תחתון</h2>
        <p className="text-sm text-slate-400">קישורים וטקסט משפטי בפוטר.</p>
      </header>
      <div className="space-y-4">
        {items.map((item: any, index: number) => (
          <div key={index} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">קישור #{index + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => reorder(index, -1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => reorder(index, 1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-[11px] font-semibold text-rose-300 hover:text-rose-200"
                >
                  מחיקה
                </button>
              </div>
            </div>
            <Field label="כותרת הקישור (פוטר)" name={`navigation.footer.items.${index}.title`} />
            <Field label="נתיב הקישור (פוטר)" name={`navigation.footer.items.${index}.path`} />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
        >
          הוספת קישור
        </button>
      </div>
      <Field label="טקסט משפטי בפוטר" name="navigation.footer.legal" resetField={resetField} textarea />
    </section>
  );
}

function MetaSection({ resetField }: Resettable) {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">הגדרות Meta</h2>
        <p className="text-sm text-slate-400">ערכי ברירת מחדל לכותרות ולתיאורים לאתר.</p>
      </header>
      <Field label="תבנית כותרת" name="meta.titleTemplate" resetField={resetField} />
      <Field label="תיאור ברירת מחדל" name="meta.description" resetField={resetField} textarea />
    </section>
  );
}

function CommonPageSection({ title, basePath, resetField }: { title: string; basePath: string; resetField: (path: string) => void }) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">{title}</h2>
      </header>
      <PageCommonFields basePath={basePath} resetField={resetField} />
    </section>
  );
}

function PageCommonFields({ basePath, resetField }: { basePath: string; resetField: (path: string) => void }) {
  const { values, setFieldValue, clearErrors } = useAdminForm();
  const gallery = (getValue(values, `${basePath}.gallery`) as ImageItem[] | undefined) ?? [];

  function addImage() {
    const next = [...gallery, { url: "", alt: "" }];
    setFieldValue(`${basePath}.gallery`, next);
    clearErrors(`${basePath}.gallery`, true);
  }

  function remove(index: number) {
    const next = gallery.filter((_, idx) => idx !== index);
    setFieldValue(`${basePath}.gallery`, next);
    clearErrors(`${basePath}.gallery`, true);
  }

  function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= gallery.length) return;
    const next = [...gallery];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setFieldValue(`${basePath}.gallery`, next);
    clearErrors(`${basePath}.gallery`, true);
  }

  return (
    <div className="space-y-5">
      <Field label="נתיב העמוד (Slug)" name={`${basePath}.slug`} readOnly type="text" />
      <Field label="כותרת" name={`${basePath}.title`} resetField={resetField} />
      <Field label="כותרת משנית" name={`${basePath}.subtitle`} resetField={resetField} />
      <Field label="תוכן (Markdown)" name={`${basePath}.body`} resetField={resetField} textarea />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="כתובת תמונת Hero" name={`${basePath}.hero.url`} resetField={resetField} />
        <Field label="טקסט אלטרנטיבי לתמונת Hero" name={`${basePath}.hero.alt`} resetField={resetField} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">גלריה</h3>
          <button
            type="button"
            onClick={addImage}
            className="text-xs font-semibold text-primary-200 hover:text-primary-100"
          >
            הוספת תמונה
          </button>
        </div>
        {gallery.map((_, index) => (
          <div key={index} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">תמונה #{index + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => reorder(index, -1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => reorder(index, 1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-[11px] font-semibold text-rose-300 hover:text-rose-200"
                >
                  מחיקה
                </button>
              </div>
            </div>
            <Field label="כתובת תמונה בגלריה" name={`${basePath}.gallery.${index}.url`} />
            <Field label="טקסט אלטרנטיבי לתמונה בגלריה" name={`${basePath}.gallery.${index}.alt`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePageSection({ resetField }: Resettable) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">עמוד הבית</h2>
        <p className="text-sm text-slate-400">שליטה מלאה בכותרות, טקסטים וקריאות לפעולה.</p>
      </header>
      <PageCommonFields basePath="pages.home" resetField={resetField} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="CTA ראשי - טקסט" name="pages.home.cta.primaryLabel" resetField={resetField} />
        <Field label="CTA ראשי - קישור" name="pages.home.cta.primaryHref" resetField={resetField} />
        <Field label="CTA משני - טקסט" name="pages.home.cta.secondaryLabel" resetField={resetField} />
        <Field label="CTA משני - קישור" name="pages.home.cta.secondaryHref" resetField={resetField} />
      </div>
    </section>
  );
}

function AcademySection({ resetField }: Resettable) {
  const { values, setFieldValue, clearErrors } = useAdminForm();
  const programs = (getValue(values, "pages.academy.programs") as Program[] | undefined) ?? [];

  function addProgram() {
    const next = [...programs, { title: "", description: "", sessionsLabel: "", image: { url: "", alt: "" } }];
    setFieldValue("pages.academy.programs", next);
    clearErrors("pages.academy.programs", true);
  }

  function remove(index: number) {
    const next = programs.filter((_, idx) => idx !== index);
    setFieldValue("pages.academy.programs", next);
    clearErrors("pages.academy.programs", true);
  }

  function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= programs.length) return;
    const next = [...programs];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setFieldValue("pages.academy.programs", next);
    clearErrors("pages.academy.programs", true);
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">עמוד האקדמיה</h2>
      </header>
      <PageCommonFields basePath="pages.academy" resetField={resetField} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">תוכניות</h3>
          <button
            type="button"
            onClick={addProgram}
            className="text-xs font-semibold text-primary-200 hover:text-primary-100"
          >
            הוספת תוכנית
          </button>
        </div>
        {programs.map((_, index) => (
          <div key={index} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">תוכנית #{index + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => reorder(index, -1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => reorder(index, 1)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-[11px] font-semibold text-rose-300 hover:text-rose-200"
                >
                  מחיקה
                </button>
              </div>
            </div>
            <Field label="תוכניות – כותרת" name={`pages.academy.programs.${index}.title`} />
            <Field label="תוכניות – תיאור" name={`pages.academy.programs.${index}.description`} textarea />
            <Field label="תוכניות – תגית מפגשים" name={`pages.academy.programs.${index}.sessionsLabel`} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="תוכניות – כתובת תמונה" name={`pages.academy.programs.${index}.image.url`} />
              <Field label="תוכניות – טקסט אלטרנטיבי לתמונה" name={`pages.academy.programs.${index}.image.alt`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ resetField }: Resettable) {
  const { values, setFieldValue, clearErrors } = useAdminForm();
  const enabled = Boolean(getValue(values, "pages.contact.contactForm.enabled"));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-primary-200">עמוד צור קשר</h2>
      </header>
      <PageCommonFields basePath="pages.contact" resetField={resetField} />
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="כתובת" name="pages.contact.address" resetField={resetField} />
        <Field label="טלפון" name="pages.contact.phone" resetField={resetField} />
        <Field label="אימייל" name="pages.contact.email" resetField={resetField} />
      </div>
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4" data-field-label="הפעלת טופס" data-field-name="pages.contact.contactForm.enabled">
        <label className="flex items-center gap-2 text-sm text-slate-200" htmlFor="contact-form-enabled">
          <input
            id="contact-form-enabled"
            type="checkbox"
            checked={enabled}
            onChange={(event) => {
              setFieldValue("pages.contact.contactForm.enabled", event.target.checked);
              clearErrors("pages.contact.contactForm.enabled");
            }}
            className="h-4 w-4"
          />
          <span>הפעלת טופס</span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="כפתור שליחה" name="pages.contact.contactForm.submitLabel" />
          <Field label="הודעת הצלחה" name="pages.contact.contactForm.successMessage" />
        </div>
      </div>
    </section>
  );
}
