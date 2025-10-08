"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { defaultContent } from "@/content/default-content";
import type { AppLocale } from "@/i18n/request";
import type {
  GalleryImage,
  LocaleSiteContent,
  LocaleSiteContentHomePillar,
  LocaleSiteContentProgram,
} from "@/content/types";
import { deepClone, useSiteContent } from "@/components/content-provider";

const localeLabels: Record<AppLocale, string> = {
  he: "עברית",
  en: "English",
};

const sectionOrder = [
  "navigation",
  "home",
  "academy",
  "about",
  "incubatorPlacement",
  "contact",
  "footer",
] as const;

type SectionKey = (typeof sectionOrder)[number];

const sectionLabels: Record<SectionKey, Record<AppLocale, string>> = {
  navigation: { he: "ניווט", en: "Navigation" },
  home: { he: "דף הבית", en: "Homepage" },
  academy: { he: "האקדמיה", en: "Academy" },
  about: { he: "אודות", en: "About" },
  incubatorPlacement: { he: "חממה והשמה", en: "Incubator & Placement" },
  contact: { he: "צור קשר", en: "Contact" },
  footer: { he: "פוטר", en: "Footer" },
};

export default function AdminPage() {
  const { contentMap, setLocaleContent, reset, ready } = useSiteContent();
  const [activeLocale, setActiveLocale] = useState<AppLocale>("he");
  const [activeSection, setActiveSection] = useState<SectionKey>("navigation");
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

  function updatePillar(index: number, value: Partial<LocaleSiteContentHomePillar>) {
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

  function updateProgram(index: number, value: Partial<LocaleSiteContentProgram>) {
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

  function renderNavigationSection() {
    return (
      <SectionContainer>
        <Field label={activeLocale === "he" ? "שם המותג" : "Brand label"}>
          <Input
            value={draft.navigation.brand}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.navigation.brand = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Divider label={activeLocale === "he" ? "קישורים" : "Links"} />
        <div className="grid gap-4">
          {draft.navigation.links.map((link, index) => (
            <div key={link.key} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <Field label={activeLocale === "he" ? "כותרת" : "Label"}>
                <Input
                  value={link.label}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.navigation.links[index].label = event.target.value;
                      return prev;
                    })
                  }
                />
              </Field>
              <Field label={activeLocale === "he" ? "נתיב" : "Path"}>
                <Input
                  value={link.path}
                  onChange={(event) =>
                    updateDraft((prev) => {
                      prev.navigation.links[index].path = event.target.value;
                      return prev;
                    })
                  }
                />
              </Field>
            </div>
          ))}
        </div>
        <Field label={activeLocale === "he" ? "תווית החלפת שפה" : "Language switch label"}>
          <Input
            value={draft.navigation.languageSwitchLabel}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.navigation.languageSwitchLabel = event.target.value;
                return prev;
              })
            }
          />
        </Field>
      </SectionContainer>
    );
  }

  function renderHomeSection() {
    return (
      <SectionContainer>
        <Divider label={activeLocale === "he" ? "הרואו" : "Hero"} />
        <Field label="Eyebrow">
          <Input
            value={draft.home.eyebrow}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.home.eyebrow = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "כותרת" : "Heading"}>
          <Input
            value={draft.home.heading}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.home.heading = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "כותרת משנה" : "Subheading"}>
          <Input
            value={draft.home.subheading}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.home.subheading = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "תיאור" : "Description"}>
          <Textarea
            value={draft.home.description}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.home.description = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "תמונת רקע (URL)" : "Hero media URL"}>
          <Input
            value={draft.home.media.src}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.home.media.src = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "טקסט אלטרנטיבי" : "Alt text"}>
          <Input
            value={draft.home.media.alt}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.home.media.alt = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Divider label={activeLocale === "he" ? "קריאות לפעולה" : "Calls to action"} />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <SectionTitle>{activeLocale === "he" ? "CTA ראשי" : "Primary CTA"}</SectionTitle>
            <Field label={activeLocale === "he" ? "טקסט" : "Label"}>
              <Input
                value={draft.home.primaryCta.label}
                onChange={(event) => updatePrimaryCta({ label: event.target.value })}
              />
            </Field>
            <Field label={activeLocale === "he" ? "קישור" : "Path"}>
              <Input
                value={draft.home.primaryCta.path}
                onChange={(event) => updatePrimaryCta({ path: event.target.value })}
              />
            </Field>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <SectionTitle>{activeLocale === "he" ? "CTA משני" : "Secondary CTA"}</SectionTitle>
            <Field label={activeLocale === "he" ? "טקסט" : "Label"}>
              <Input
                value={draft.home.secondaryCta.label}
                onChange={(event) => updateSecondaryCta({ label: event.target.value })}
              />
            </Field>
            <Field label={activeLocale === "he" ? "קישור" : "Path"}>
              <Input
                value={draft.home.secondaryCta.path}
                onChange={(event) => updateSecondaryCta({ path: event.target.value })}
              />
            </Field>
          </div>
        </div>
        <Divider label={activeLocale === "he" ? "שלושת הרגליים" : "Three pillars"} />
        <div className="grid gap-4">
          {draft.home.pillars.map((pillar, index) => (
            <div key={pillar.key} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <SectionTitle>
                {activeLocale === "he" ? `כרטיס ${index + 1}` : `Pillar ${index + 1}`}
              </SectionTitle>
              <Field label={activeLocale === "he" ? "כותרת" : "Title"}>
                <Input
                  value={pillar.title}
                  onChange={(event) => updatePillar(index, { title: event.target.value })}
                />
              </Field>
              <Field label={activeLocale === "he" ? "תיאור" : "Description"}>
                <Textarea
                  value={pillar.description}
                  onChange={(event) => updatePillar(index, { description: event.target.value })}
                />
              </Field>
              <Field label={activeLocale === "he" ? "קישור" : "Path"}>
                <Input
                  value={pillar.path}
                  onChange={(event) => updatePillar(index, { path: event.target.value })}
                />
              </Field>
            </div>
          ))}
        </div>
        <Divider label={activeLocale === "he" ? "גלריה" : "Gallery"} />
        <div className="grid gap-4">
          {draft.home.gallery.map((image, index) => (
            <div key={`${image.src}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <SectionTitle>
                {activeLocale === "he" ? `תמונה ${index + 1}` : `Image ${index + 1}`}
              </SectionTitle>
              <Field label="URL">
                <Input value={image.src} onChange={(event) => updateGallery(index, { src: event.target.value })} />
              </Field>
              <Field label={activeLocale === "he" ? "טקסט חלופי" : "Alt text"}>
                <Input value={image.alt} onChange={(event) => updateGallery(index, { alt: event.target.value })} />
              </Field>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="text-xs text-red-300 transition-colors hover:text-red-200"
                >
                  {activeLocale === "he" ? "הסרה" : "Remove"}
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addGalleryImage}
            className="w-fit rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-accent-400 hover:text-accent-200"
          >
            {activeLocale === "he" ? "הוספת תמונה" : "Add image"}
          </button>
        </div>
      </SectionContainer>
    );
  }

  function renderAcademySection() {
    return (
      <SectionContainer>
        <Divider label={activeLocale === "he" ? "תוכניות" : "Programs"} />
        <div className="grid gap-4">
          {draft.academy.programs.map((program, index) => (
            <div key={program.key} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <SectionTitle>
                {activeLocale === "he" ? `תוכנית ${index + 1}` : `Program ${index + 1}`}
              </SectionTitle>
              <Field label={activeLocale === "he" ? "כותרת" : "Title"}>
                <Input
                  value={program.title}
                  onChange={(event) => updateProgram(index, { title: event.target.value })}
                />
              </Field>
              <Field label={activeLocale === "he" ? "תיאור" : "Description"}>
                <Textarea
                  value={program.description}
                  onChange={(event) => updateProgram(index, { description: event.target.value })}
                />
              </Field>
              <Field label={activeLocale === "he" ? "משך" : "Duration"}>
                <Input
                  value={program.duration}
                  onChange={(event) => updateProgram(index, { duration: event.target.value })}
                />
              </Field>
              <Field label="Image URL">
                <Input
                  value={program.image.src}
                  onChange={(event) => updateProgram(index, { image: { ...program.image, src: event.target.value } })}
                />
              </Field>
              <Field label={activeLocale === "he" ? "טקסט חלופי" : "Alt text"}>
                <Input
                  value={program.image.alt}
                  onChange={(event) => updateProgram(index, { image: { ...program.image, alt: event.target.value } })}
                />
              </Field>
            </div>
          ))}
        </div>
      </SectionContainer>
    );
  }

  function renderAboutSection() {
    return (
      <SectionContainer>
        <Field label={activeLocale === "he" ? "כותרת" : "Title"}>
          <Input
            value={draft.about.title}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.about.title = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Divider label={activeLocale === "he" ? "פסקאות" : "Paragraphs"} />
        <div className="grid gap-4">
          {draft.about.paragraphs.map((paragraph, index) => (
            <Field key={`${index}`} label={activeLocale === "he" ? `פסקה ${index + 1}` : `Paragraph ${index + 1}`}>
              <Textarea
                value={paragraph}
                onChange={(event) =>
                  updateDraft((prev) => {
                    prev.about.paragraphs[index] = event.target.value;
                    return prev;
                  })
                }
              />
            </Field>
          ))}
        </div>
      </SectionContainer>
    );
  }

  function renderIncubatorPlacementSection() {
    return (
      <SectionContainer>
        <Divider label={activeLocale === "he" ? "חממה" : "Incubator"} />
        <Field label={activeLocale === "he" ? "כותרת" : "Title"}>
          <Input
            value={draft.incubator.title}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.incubator.title = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "תיאור" : "Description"}>
          <Textarea
            value={draft.incubator.description}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.incubator.description = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Divider label={activeLocale === "he" ? "תהליך" : "Process"} />
        <Field label={activeLocale === "he" ? "כותרת" : "Title"}>
          <Input
            value={draft.incubator.process.title}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.incubator.process.title = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "שלבים" : "Steps"}>
          <Textarea
            value={draft.incubator.process.steps.join("\n")}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.incubator.process.steps = event.target.value.split("\n");
                return prev;
              })
            }
            hint={activeLocale === "he" ? "כל שלב בשורה נפרדת" : "One step per line"}
          />
        </Field>
        <Divider label={activeLocale === "he" ? "השמה" : "Placement"} />
        <Field label={activeLocale === "he" ? "כותרת" : "Title"}>
          <Input
            value={draft.placement.title}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.placement.title = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "תיאור" : "Description"}>
          <Textarea
            value={draft.placement.description}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.placement.description = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Divider label={activeLocale === "he" ? "יתרונות" : "Benefits"} />
        <Field label={activeLocale === "he" ? "מעסיקים" : "Employers"}>
          <Textarea
            value={draft.placement.employers.join("\n")}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.placement.employers = event.target.value.split("\n");
                return prev;
              })
            }
            hint={activeLocale === "he" ? "כל יתרון בשורה" : "One benefit per line"}
          />
        </Field>
        <Field label={activeLocale === "he" ? "מועמדים" : "Candidates"}>
          <Textarea
            value={draft.placement.candidates.join("\n")}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.placement.candidates = event.target.value.split("\n");
                return prev;
              })
            }
            hint={activeLocale === "he" ? "כל יתרון בשורה" : "One benefit per line"}
          />
        </Field>
      </SectionContainer>
    );
  }

  function renderContactSection() {
    return (
      <SectionContainer>
        <Field label={activeLocale === "he" ? "כותרת" : "Title"}>
          <Input
            value={draft.contact.title}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.contact.title = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "תיאור" : "Description"}>
          <Textarea
            value={draft.contact.description}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.contact.description = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Divider label={activeLocale === "he" ? "שדות טופס" : "Form fields"} />
        <div className="grid gap-4">
          {Object.entries(draft.contact.fields).map(([key, value]) => (
            <Field key={key} label={key}>
              <Input
                value={value}
                onChange={(event) =>
                  updateDraft((prev) => {
                    prev.contact.fields[key as keyof typeof prev.contact.fields] = event.target.value;
                    return prev;
                  })
                }
              />
            </Field>
          ))}
        </div>
        <Divider label={activeLocale === "he" ? "הודעות" : "Messages"} />
        <Field label={activeLocale === "he" ? "הודעת הצלחה" : "Success message"}>
          <Textarea
            value={draft.contact.successMessage}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.contact.successMessage = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "הודעת שגיאה" : "Error message"}>
          <Textarea
            value={draft.contact.errorMessage}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.contact.errorMessage = event.target.value;
                return prev;
              })
            }
          />
        </Field>
      </SectionContainer>
    );
  }

  function renderFooterSection() {
    return (
      <SectionContainer>
        <Field label={activeLocale === "he" ? "זכויות" : "Rights"}>
          <Input
            value={draft.footer.rights}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.footer.rights = event.target.value;
                return prev;
              })
            }
          />
        </Field>
        <Field label={activeLocale === "he" ? "פרטי קשר" : "Contact"}>
          <Input
            value={draft.footer.contact}
            onChange={(event) =>
              updateDraft((prev) => {
                prev.footer.contact = event.target.value;
                return prev;
              })
            }
          />
        </Field>
      </SectionContainer>
    );
  }

  function renderSectionContent() {
    switch (activeSection) {
      case "navigation":
        return renderNavigationSection();
      case "home":
        return renderHomeSection();
      case "academy":
        return renderAcademySection();
      case "about":
        return renderAboutSection();
      case "incubatorPlacement":
        return renderIncubatorPlacementSection();
      case "contact":
        return renderContactSection();
      case "footer":
        return renderFooterSection();
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 py-16">
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
              onChange={(event) => {
                setActiveLocale(event.target.value as AppLocale);
                setActiveSection("navigation");
              }}
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

        <nav className="sticky top-0 z-10 flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 backdrop-blur">
          {sectionOrder.map((sectionKey) => (
            <button
              key={sectionKey}
              onClick={() => setActiveSection(sectionKey)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                activeSection === sectionKey
                  ? "bg-primary-500 text-slate-950 shadow-lg shadow-primary-500/30"
                  : "border border-slate-700 bg-transparent text-slate-200 hover:border-primary-400 hover:text-primary-200"
              }`}
            >
              {sectionLabels[sectionKey][activeLocale]}
            </button>
          ))}
        </nav>

        <section className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          {renderSectionContent()}
        </section>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
};

function Field({ label, children, hint }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-200">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
        props.className ?? ""
      }`}
    />
  );
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[80px] rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
        props.className ?? ""
      }`}
    />
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary-200">
      <span className="h-px flex-1 bg-primary-500/40" aria-hidden />
      <span>{label}</span>
      <span className="h-px flex-1 bg-primary-500/40" aria-hidden />
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-primary-200">{children}</h3>;
}

function SectionContainer({ children }: { children: ReactNode }) {
  return <div className="grid gap-5">{children}</div>;
}
