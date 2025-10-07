"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultContent } from "@/content/default-content";
import type { AppLocale } from "@/i18n/request";
import type { GalleryImage, LocaleSiteContent } from "@/content/types";
import { deepClone, useSiteContent } from "@/components/content-provider";

const localeLabels: Record<AppLocale, string> = {
  he: "עברית",
  en: "English",
};

export default function AdminPage() {
  const { contentMap, setLocaleContent, reset, ready } = useSiteContent();
  const [activeLocale, setActiveLocale] = useState<AppLocale>("he");
  const [draft, setDraft] = useState<LocaleSiteContent>(() => deepClone(contentMap["he"]));
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const current = useMemo(() => contentMap[activeLocale], [contentMap, activeLocale]);

  useEffect(() => {
    setDraft(deepClone(current));
  }, [current]);

  useEffect(() => {
    if (savedMessage) {
      const timeout = setTimeout(() => setSavedMessage(null), 2500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [savedMessage]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl py-20 text-center text-sm text-slate-400">Loading content…</div>
      </div>
    );
  }

  function updateDraft(updater: (prev: LocaleSiteContent) => LocaleSiteContent) {
    setDraft((prev) => updater(deepClone(prev)));
  }

  function updateGallery(index: number, value: Partial<GalleryImage>) {
    updateDraft((prev) => {
      prev.home.gallery[index] = { ...prev.home.gallery[index], ...value };
      return prev;
    });
  }

  function updatePillar(
    index: number,
    value: Partial<LocaleSiteContent["home"]["pillars"][number]>
  ) {
    updateDraft((prev) => {
      prev.home.pillars[index] = { ...prev.home.pillars[index], ...value };
      return prev;
    });
  }

  function updatePrimaryCta(value: Partial<LocaleSiteContent["home"]["primaryCta"]>) {
    updateDraft((prev) => {
      prev.home.primaryCta = { ...prev.home.primaryCta, ...value };
      return prev;
    });
  }

  function updateSecondaryCta(value: Partial<LocaleSiteContent["home"]["secondaryCta"]>) {
    updateDraft((prev) => {
      prev.home.secondaryCta = { ...prev.home.secondaryCta, ...value };
      return prev;
    });
  }

  function addGalleryImage() {
    updateDraft((prev) => {
      prev.home.gallery = [
        ...prev.home.gallery,
        {
          src:
            activeLocale === "he"
              ? "https://placehold.co/600x400/111827/06B6D4?text=%D7%AA%D7%9E%D7%95%D7%A0%D7%94+%D7%97%D7%93%D7%A9%D7%94"
              : "https://placehold.co/600x400/111827/06B6D4?text=New+image",
          alt: activeLocale === "he" ? "תמונה חדשה" : "New gallery image",
        },
      ];
      return prev;
    });
  }

  function removeGalleryImage(index: number) {
    updateDraft((prev) => {
      prev.home.gallery = prev.home.gallery.filter((_, i) => i !== index);
      return prev;
    });
  }

  function updateProgram(index: number, value: Partial<LocaleSiteContent["academy"]["programs"][number]>) {
    updateDraft((prev) => {
      prev.academy.programs[index] = { ...prev.academy.programs[index], ...value };
      return prev;
    });
  }

  function saveChanges() {
    setLocaleContent(activeLocale, deepClone(draft));
    setSavedMessage(activeLocale === "he" ? "השינויים נשמרו" : "Changes saved");
  }

  function resetLocale() {
    const defaults = deepClone(defaultContent[activeLocale]);
    setLocaleContent(activeLocale, defaults);
    setDraft(defaults);
    setSavedMessage(activeLocale === "he" ? "התוכן אופס" : "Locale reset to defaults");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 py-16">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div>
            <h1 className="text-2xl font-semibold text-primary-200">Site content manager</h1>
            <p className="text-sm text-slate-400">
              {activeLocale === "he"
                ? "עדכנו טקסטים ותמונות לכל השפות. השינויים נשמרים בדפדפן זה."
                : "Update copy and imagery per locale. Changes persist in this browser."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={activeLocale}
              onChange={(event) => setActiveLocale(event.target.value as AppLocale)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            >
              {Object.entries(localeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              onClick={saveChanges}
              className="rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-primary-500/30 transition-transform hover:-translate-y-0.5 hover:bg-primary-400"
            >
              {activeLocale === "he" ? "שמירת שינויים" : "Save changes"}
            </button>
            <button
              onClick={resetLocale}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-accent-400 hover:text-accent-200"
            >
              {activeLocale === "he" ? "איפוס שפה" : "Reset locale"}
            </button>
            <button
              onClick={() => {
                reset();
                setDraft(deepClone(defaultContent[activeLocale]));
                setSavedMessage(activeLocale === "he" ? "כל האתר אופס" : "All locales reset");
              }}
              className="rounded-full border border-red-500/60 px-4 py-2 text-xs font-semibold text-red-300 transition-colors hover:border-red-400 hover:text-red-200"
            >
              {activeLocale === "he" ? "איפוס מלא" : "Reset all"}
            </button>
          </div>
        </header>

        {savedMessage && (
          <div className="mx-auto w-full max-w-md rounded-2xl border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-center text-sm text-primary-100">
            {savedMessage}
          </div>
        )}

        <section className="grid gap-8">
          <AdminCard title={activeLocale === "he" ? "ניווט" : "Navigation"}>
            <div className="grid gap-4">
              <label className="flex flex-col gap-2 text-sm">
                <span>{activeLocale === "he" ? "שם המותג" : "Brand label"}</span>
                <input
                  value={draft.navigation.brand}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.navigation.brand = event.target.value;
                      return prev;
                    })
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
              <div className="grid gap-3">
                {draft.navigation.links.map((link, index) => (
                  <div key={link.key} className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {activeLocale === "he" ? `קישור ${index + 1}` : `Link ${index + 1}`}
                    </span>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Label"}</span>
                      <input
                        value={link.label}
                        onChange={(event) =>
                          updateDraft((prev) => {
                            prev.navigation.links[index].label = event.target.value;
                            return prev;
                          })
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400">{activeLocale === "he" ? "נתיב" : "Path"}</span>
                      <input
                        value={link.path}
                        onChange={(event) =>
                          updateDraft((prev) => {
                            prev.navigation.links[index].path = event.target.value;
                            return prev;
                          })
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                      />
                    </label>
                  </div>
                ))}
              </div>
              <label className="flex flex-col gap-2 text-sm">
                <span>{activeLocale === "he" ? "תווית החלפת שפה" : "Language switch label"}</span>
                <input
                  value={draft.navigation.languageSwitchLabel}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.navigation.languageSwitchLabel = event.target.value;
                      return prev;
                    })
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </AdminCard>

          <AdminCard title={activeLocale === "he" ? "דף הבית" : "Homepage"}>
            <div className="grid gap-4">
              <div className="grid gap-2 text-sm">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">Eyebrow</span>
                  <input
                    value={draft.home.eyebrow}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.home.eyebrow = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Heading"}</span>
                  <input
                    value={draft.home.heading}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.home.heading = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת משנה" : "Subheading"}</span>
                  <input
                    value={draft.home.subheading}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.home.subheading = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? "תיאור" : "Description"}</span>
                  <textarea
                    value={draft.home.description}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.home.description = event.target.value;
                        return prev;
                      })
                    }
                    className="min-h-[80px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <span className="text-sm font-semibold text-primary-200">Hero media</span>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-xs text-slate-400">URL</span>
                  <input
                    value={draft.home.media.src}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.home.media.src = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-xs text-slate-400">Alt</span>
                  <input
                    value={draft.home.media.alt}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.home.media.alt = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <span className="text-sm font-semibold text-primary-200">
                  {activeLocale === "he" ? "קריאות לפעולה" : "Calls to action"}
                </span>
                <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {activeLocale === "he" ? "CTA ראשי" : "Primary CTA"}
                  </span>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "טקסט" : "Label"}</span>
                    <input
                      value={draft.home.primaryCta.label}
                      onChange={(event) => updatePrimaryCta({ label: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "קישור" : "Path"}</span>
                    <input
                      value={draft.home.primaryCta.path}
                      onChange={(event) => updatePrimaryCta({ path: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                </div>
                <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {activeLocale === "he" ? "CTA משני" : "Secondary CTA"}
                  </span>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "טקסט" : "Label"}</span>
                    <input
                      value={draft.home.secondaryCta.label}
                      onChange={(event) => updateSecondaryCta({ label: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "קישור" : "Path"}</span>
                    <input
                      value={draft.home.secondaryCta.path}
                      onChange={(event) => updateSecondaryCta({ path: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>
              <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <span className="text-sm font-semibold text-primary-200">Gallery</span>
                <div className="grid gap-3">
                  {draft.home.gallery.map((image, index) => (
                    <div key={`${image.src}-${index}`} className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{activeLocale === "he" ? `תמונה ${index + 1}` : `Image ${index + 1}`}</span>
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="text-red-300 transition-colors hover:text-red-200"
                          type="button"
                        >
                          {activeLocale === "he" ? "הסרה" : "Remove"}
                        </button>
                      </div>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400">URL</span>
                        <input
                          value={image.src}
                          onChange={(event) => updateGallery(index, { src: event.target.value })}
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400">Alt</span>
                        <input
                          value={image.alt}
                          onChange={(event) => updateGallery(index, { alt: event.target.value })}
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="w-fit rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-accent-400 hover:text-accent-200"
                >
                  {activeLocale === "he" ? "הוספת תמונה" : "Add image"}
                </button>
              </div>
            </div>
          </AdminCard>

          <AdminCard title={activeLocale === "he" ? "תוכניות אקדמיה" : "Academy programs"}>
            <div className="grid gap-4">
                  {draft.academy.programs.map((program, index) => (
                    <div key={program.key} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {activeLocale === "he" ? `תוכנית ${index + 1}` : `Program ${index + 1}`}
                      </span>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Title"}</span>
                    <input
                      value={program.title}
                      onChange={(event) => updateProgram(index, { title: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "תיאור" : "Description"}</span>
                    <textarea
                      value={program.description}
                      onChange={(event) => updateProgram(index, { description: event.target.value })}
                      className="min-h-[80px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "משך" : "Duration"}</span>
                    <input
                      value={program.duration}
                      onChange={(event) => updateProgram(index, { duration: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                  <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {activeLocale === "he" ? "תמונה" : "Image"}
                    </span>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400">URL</span>
                      <input
                        value={program.image.src}
                        onChange={(event) => updateProgram(index, { image: { ...program.image, src: event.target.value } })}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-slate-400">Alt</span>
                      <input
                        value={program.image.alt}
                        onChange={(event) => updateProgram(index, { image: { ...program.image, alt: event.target.value } })}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title={activeLocale === "he" ? "על הארגון" : "About"}>
            <div className="grid gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Title"}</span>
                <input
                  value={draft.about.title}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.about.title = event.target.value;
                      return prev;
                    })
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
              {draft.about.paragraphs.map((paragraph, index) => (
                <label key={`${index}`} className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? `פסקה ${index + 1}` : `Paragraph ${index + 1}`}</span>
                  <textarea
                    value={paragraph}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.about.paragraphs[index] = event.target.value;
                        return prev;
                      })
                    }
                    className="min-h-[70px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
              ))}
            </div>
          </AdminCard>

          <AdminCard title={activeLocale === "he" ? "חממה והשמה" : "Incubator & Placement"}>
            <div className="grid gap-4 text-sm">
              <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <span className="text-sm font-semibold text-primary-200">{activeLocale === "he" ? "חממה" : "Incubator"}</span>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Title"}</span>
                  <input
                    value={draft.incubator.title}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.incubator.title = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? "תיאור" : "Description"}</span>
                  <textarea
                    value={draft.incubator.description}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.incubator.description = event.target.value;
                        return prev;
                      })
                    }
                    className="min-h-[70px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                {draft.incubator.stages.map((stage, index) => (
                  <div key={`${index}`} className="grid gap-2 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {activeLocale === "he" ? `שלב ${index + 1}` : `Stage ${index + 1}`}
                    </span>
                    <input
                      value={stage.title}
                      onChange={(event) =>
                        updateDraft((prev) => {
                          prev.incubator.stages[index].title = event.target.value;
                          return prev;
                        })
                      }
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                    <textarea
                      value={stage.description}
                      onChange={(event) =>
                        updateDraft((prev) => {
                          prev.incubator.stages[index].description = event.target.value;
                          return prev;
                        })
                      }
                      className="min-h-[60px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <span className="text-sm font-semibold text-primary-200">{activeLocale === "he" ? "השמה" : "Placement"}</span>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Title"}</span>
                  <input
                    value={draft.placement.title}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.placement.title = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">{activeLocale === "he" ? "תיאור" : "Description"}</span>
                  <textarea
                    value={draft.placement.description}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.placement.description = event.target.value;
                        return prev;
                      })
                    }
                    className="min-h-[70px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </label>
                <div className="grid gap-2 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {activeLocale === "he" ? "למעסיקים" : "For employers"}
                  </span>
                  <input
                    value={draft.placement.employersTitle}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.placement.employersTitle = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                  {draft.placement.employers.map((item, index) => (
                    <textarea
                      key={`${index}`}
                      value={item}
                      onChange={(event) =>
                        updateDraft((prev) => {
                          prev.placement.employers[index] = event.target.value;
                          return prev;
                        })
                      }
                      className="min-h-[50px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  ))}
                </div>
                <div className="grid gap-2 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {activeLocale === "he" ? "למועמדים" : "For candidates"}
                  </span>
                  <input
                    value={draft.placement.candidatesTitle}
                    onChange={(event) =>
                      updateDraft((prev) => {
                        prev.placement.candidatesTitle = event.target.value;
                        return prev;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                  {draft.placement.candidates.map((item, index) => (
                    <textarea
                      key={`${index}`}
                      value={item}
                      onChange={(event) =>
                        updateDraft((prev) => {
                          prev.placement.candidates[index] = event.target.value;
                          return prev;
                        })
                      }
                      className="min-h-[50px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title={activeLocale === "he" ? "כרטיסי דף הבית" : "Homepage cards"}>
            <div className="grid gap-4">
              {draft.home.pillars.map((pillar, index) => (
                <div key={pillar.key} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {activeLocale === "he" ? `כרטיס ${index + 1}` : `Card ${index + 1}`}
                  </span>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Title"}</span>
                    <input
                      value={pillar.title}
                      onChange={(event) => updatePillar(index, { title: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "תיאור" : "Description"}</span>
                    <textarea
                      value={pillar.description}
                      onChange={(event) => updatePillar(index, { description: event.target.value })}
                      className="min-h-[70px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{activeLocale === "he" ? "נתיב" : "Path"}</span>
                    <input
                      value={pillar.path}
                      onChange={(event) => updatePillar(index, { path: event.target.value })}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title={activeLocale === "he" ? "צור קשר" : "Contact"}>
            <div className="grid gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">{activeLocale === "he" ? "כותרת" : "Title"}</span>
                <input
                  value={draft.contact.title}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.contact.title = event.target.value;
                      return prev;
                    })
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">{activeLocale === "he" ? "תיאור" : "Description"}</span>
                <textarea
                  value={draft.contact.description}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.contact.description = event.target.value;
                      return prev;
                    })
                  }
                  className="min-h-[70px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
              <div className="grid gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {activeLocale === "he" ? "שדות" : "Fields"}
                </span>
                {Object.entries(draft.contact.fields).map(([key, value]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400">{key}</span>
                    <input
                      value={value}
                      onChange={(event) =>
                        updateDraft((prev) => {
                          prev.contact.fields[key as keyof typeof prev.contact.fields] = event.target.value;
                          return prev;
                        })
                      }
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </label>
                ))}
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Success</span>
                <textarea
                  value={draft.contact.successMessage}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.contact.successMessage = event.target.value;
                      return prev;
                    })
                  }
                  className="min-h-[60px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Error</span>
                <textarea
                  value={draft.contact.errorMessage}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.contact.errorMessage = event.target.value;
                      return prev;
                    })
                  }
                  className="min-h-[60px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </AdminCard>

          <AdminCard title={activeLocale === "he" ? "פוטר" : "Footer"}>
            <div className="grid gap-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">{activeLocale === "he" ? "זכויות" : "Rights"}</span>
                <input
                  value={draft.footer.rights}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.footer.rights = event.target.value;
                      return prev;
                    })
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">{activeLocale === "he" ? "פרטי קשר" : "Contact"}</span>
                <input
                  value={draft.footer.contact}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.footer.contact = event.target.value;
                      return prev;
                    })
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </AdminCard>
        </section>
      </div>
    </div>
  );
}

function AdminCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
      <h2 className="text-lg font-semibold text-primary-100">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}
