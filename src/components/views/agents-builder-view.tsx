"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { AgentsBuilderPageContent } from "@/content/types";
import type { AppLocale } from "@/i18n/request";
import { Markdown } from "@/components/markdown";

const localeText: Record<
  AppLocale,
  {
    cta: string;
    steps: { define: string; integrate: string; behavior: string; review: string };
    fields: {
      agentName: string;
      description: string;
      industry: string;
      tone: string;
      goals: string;
      languages: string;
      successCriteria: string;
      channels: string;
    };
    integration: {
      title: string;
      empty: string;
      addIntegration: string;
      name: string;
      baseUrl: string;
      authType: string;
      description: string;
      operations: string;
      addOperation: string;
      method: string;
      path: string;
      remove: string;
    };
    behavior: {
      triggers: string;
      response: string;
      tools: string;
      guardrails: string;
    };
    review: {
      title: string;
      agentProfile: string;
      integrations: string;
      behaviors: string;
      emptyIntegrations: string;
      emptyBehaviors: string;
      submit: string;
      download: string;
    };
    navigation: { previous: string; next: string; finish: string };
  }
> = {
  he: {
    cta: "התחל לבנות סוכן מותאם", // CTA label
    steps: {
      define: "הגדרת פרופיל", // Step labels in Hebrew
      integrate: "חיבורי API",
      behavior: "התנהגות וזרימות",
      review: "סקירה וסיום",
    },
    fields: {
      agentName: "שם הסוכן",
      description: "תיאור קצר ומטרות",
      industry: "תחום פעילות",
      tone: "אופי ושפה",
      goals: "יעדים מרכזיים",
      languages: "שפות תמיכה",
      successCriteria: "מדדי הצלחה",
      channels: "ערוצי הפעלה",
    },
    integration: {
      title: "הגדרות חיבור והעשרה",
      empty: "עדיין לא נוספו חיבורי API. הוסיפו את מקורות המידע הרלוונטיים לסוכן שלכם.",
      addIntegration: "הוספת חיבור חדש",
      name: "שם המערכת או השירות",
      baseUrl: "כתובת בסיס / סביבת עבודה",
      authType: "סוג אימות",
      description: "הערות ותפקיד במערכת",
      operations: "פעולות זמינות",
      addOperation: "הוספת פעולה",
      method: "שיטה",
      path: "נתיב / משאב",
      remove: "הסרה",
    },
    behavior: {
      triggers: "אירועים מפעילים",
      response: "אסטרטגיית תגובה",
      tools: "כלים ומשימות",
      guardrails: "כללי זהב ומדיניות",
    },
    review: {
      title: "מסמך סוכן ראשוני",
      agentProfile: "תמצית פרופיל",
      integrations: "מקורות וחיבורים",
      behaviors: "זרימות ותגובות",
      emptyIntegrations: "לא הוגדרו חיבורים עדיין.",
      emptyBehaviors: "השלימו את שלב ההתנהגות כדי לראות את הסיכום.",
      submit: "שלחו בקשה לצוות ORTAM",
      download: "ייצוא מפרט סוכן",
    },
    navigation: {
      previous: "חזרה",
      next: "הבא",
      finish: "יצירת מפרט",
    },
  },
  en: {
    cta: "Start building your agent",
    steps: {
      define: "Profile",
      integrate: "API integrations",
      behavior: "Behaviors",
      review: "Review",
    },
    fields: {
      agentName: "Agent name",
      description: "Summary & objectives",
      industry: "Industry focus",
      tone: "Tone of voice",
      goals: "Key goals",
      languages: "Supported languages",
      successCriteria: "Success indicators",
      channels: "Execution channels",
    },
    integration: {
      title: "Integrations & enrichment",
      empty: "No integrations yet. Add the systems and APIs that should power this agent.",
      addIntegration: "Add integration",
      name: "System or service name",
      baseUrl: "Base URL / environment",
      authType: "Authentication type",
      description: "Notes & purpose",
      operations: "Available operations",
      addOperation: "Add operation",
      method: "Method",
      path: "Path / resource",
      remove: "Remove",
    },
    behavior: {
      triggers: "Triggering events",
      response: "Response strategy",
      tools: "Tools & tasks",
      guardrails: "Guardrails & policies",
    },
    review: {
      title: "Agent blueprint",
      agentProfile: "Profile summary",
      integrations: "Integrations",
      behaviors: "Behaviors & guardrails",
      emptyIntegrations: "No integrations defined yet.",
      emptyBehaviors: "Complete the behavior step to see the summary.",
      submit: "Send request to ORTAM team",
      download: "Export agent spec",
    },
    navigation: {
      previous: "Back",
      next: "Next",
      finish: "Generate spec",
    },
  },
};

type ApiOperation = {
  id: number;
  method: string;
  path: string;
  description: string;
};

type ApiIntegration = {
  id: number;
  name: string;
  baseUrl: string;
  authType: string;
  description: string;
  operations: ApiOperation[];
};

type AgentsBuilderViewProps = {
  locale: AppLocale;
  content: AgentsBuilderPageContent;
};

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function AgentsBuilderView({ locale, content }: AgentsBuilderViewProps) {
  const text = localeText[locale];
  const [currentStep, setCurrentStep] = useState(0);
  const [integrationCounter, setIntegrationCounter] = useState(1);
  const [operationCounter, setOperationCounter] = useState(1);
  const [agentProfile, setAgentProfile] = useState({
    name: "",
    description: "",
    industry: "",
    tone: "",
    goals: "",
    languages: "",
    successCriteria: "",
    channels: "",
  });
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [behaviorDesign, setBehaviorDesign] = useState({
    triggers: "",
    response: "",
    tools: "",
    guardrails: "",
  });

  const steps = useMemo(
    () => [text.steps.define, text.steps.integrate, text.steps.behavior, text.steps.review],
    [text.steps]
  );

  function goToStep(stepIndex: number) {
    setCurrentStep(Math.min(Math.max(stepIndex, 0), steps.length - 1));
  }

  function updateAgentProfile(field: keyof typeof agentProfile, value: string) {
    setAgentProfile((prev) => ({ ...prev, [field]: value }));
  }

  function createIntegration(): ApiIntegration {
    const id = integrationCounter;
    setIntegrationCounter((prev) => prev + 1);
    return {
      id,
      name: "",
      baseUrl: "",
      authType: "",
      description: "",
      operations: [],
    };
  }

  function addIntegration() {
    setIntegrations((prev) => [...prev, createIntegration()]);
  }

  function updateIntegration(index: number, field: keyof ApiIntegration, value: string) {
    setIntegrations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeIntegration(index: number) {
    setIntegrations((prev) => prev.filter((_, idx) => idx !== index));
  }

  function addOperation(integrationIndex: number) {
    const id = operationCounter;
    setOperationCounter((prev) => prev + 1);
    const operation: ApiOperation = { id, method: "GET", path: "", description: "" };
    setIntegrations((prev) => {
      const next = [...prev];
      const target = next[integrationIndex];
      next[integrationIndex] = { ...target, operations: [...target.operations, operation] };
      return next;
    });
  }

  function updateOperation(
    integrationIndex: number,
    operationIndex: number,
    field: keyof ApiOperation,
    value: string
  ) {
    setIntegrations((prev) => {
      const next = [...prev];
      const target = next[integrationIndex];
      const operations = [...target.operations];
      operations[operationIndex] = { ...operations[operationIndex], [field]: value };
      next[integrationIndex] = { ...target, operations };
      return next;
    });
  }

  function removeOperation(integrationIndex: number, operationIndex: number) {
    setIntegrations((prev) => {
      const next = [...prev];
      const target = next[integrationIndex];
      const operations = target.operations.filter((_, idx) => idx !== operationIndex);
      next[integrationIndex] = { ...target, operations };
      return next;
    });
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={text.fields.agentName}
                value={agentProfile.name}
                onChange={(value) => updateAgentProfile("name", value)}
              />
              <Field
                label={text.fields.industry}
                value={agentProfile.industry}
                onChange={(value) => updateAgentProfile("industry", value)}
              />
            </div>
            <Field
              label={text.fields.description}
              as="textarea"
              rows={3}
              value={agentProfile.description}
              onChange={(value) => updateAgentProfile("description", value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={text.fields.goals}
                value={agentProfile.goals}
                onChange={(value) => updateAgentProfile("goals", value)}
                helper={locale === "he" ? "הפרידו בין היעדים בפסיק" : "Separate goals with commas"}
              />
              <Field
                label={text.fields.languages}
                value={agentProfile.languages}
                onChange={(value) => updateAgentProfile("languages", value)}
                helper={locale === "he" ? "למשל: עברית, אנגלית" : "e.g. Hebrew, English"}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={text.fields.tone}
                value={agentProfile.tone}
                onChange={(value) => updateAgentProfile("tone", value)}
              />
              <Field
                label={text.fields.channels}
                value={agentProfile.channels}
                onChange={(value) => updateAgentProfile("channels", value)}
                helper={locale === "he" ? "לדוגמה: ווטסאפ, אתר, CRM" : "For example: WhatsApp, web, CRM"}
              />
            </div>
            <Field
              label={text.fields.successCriteria}
              value={agentProfile.successCriteria}
              onChange={(value) => updateAgentProfile("successCriteria", value)}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <p className="text-sm text-slate-300">{text.integration.title}</p>
            {integrations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
                {text.integration.empty}
              </div>
            )}
            <div className="space-y-5">
              {integrations.map((integration, integrationIndex) => (
                <div
                  key={integration.id}
                  className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg shadow-slate-950/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-base font-semibold text-primary-200">
                      {integration.name || `${text.integration.name} #${integrationIndex + 1}`}
                    </h4>
                    <button
                      type="button"
                      className="text-xs font-medium text-rose-300 transition-colors hover:text-rose-200"
                      onClick={() => removeIntegration(integrationIndex)}
                    >
                      {text.integration.remove}
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label={text.integration.name}
                      value={integration.name}
                      onChange={(value) => updateIntegration(integrationIndex, "name", value)}
                    />
                    <Field
                      label={text.integration.baseUrl}
                      value={integration.baseUrl}
                      onChange={(value) => updateIntegration(integrationIndex, "baseUrl", value)}
                    />
                  </div>
                  <Field
                    label={text.integration.authType}
                    value={integration.authType}
                    onChange={(value) => updateIntegration(integrationIndex, "authType", value)}
                  />
                  <Field
                    label={text.integration.description}
                    value={integration.description}
                    onChange={(value) => updateIntegration(integrationIndex, "description", value)}
                    as="textarea"
                    rows={2}
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">{text.integration.operations}</span>
                      <button
                        type="button"
                        className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                        onClick={() => addOperation(integrationIndex)}
                      >
                        {text.integration.addOperation}
                      </button>
                    </div>
                    {integration.operations.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-800 p-4 text-xs text-slate-400">
                        {locale === "he"
                          ? "הגדירו פעולות מרכזיות שהסוכן יוכל לבצע מול ה-API."
                          : "Describe the core operations that the agent will call."}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {integration.operations.map((operation, operationIndex) => (
                          <div key={operation.id} className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
                            <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
                              <div>
                                <label className="text-xs font-medium text-slate-300">{text.integration.method}</label>
                                <select
                                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:border-primary-300 focus:outline-none"
                                  value={operation.method}
                                  onChange={(event) =>
                                    updateOperation(integrationIndex, operationIndex, "method", event.target.value)
                                  }
                                >
                                  {httpMethods.map((method) => (
                                    <option key={method} value={method}>
                                      {method}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Field
                                  label={text.integration.path}
                                  value={operation.path}
                                  onChange={(value) =>
                                    updateOperation(integrationIndex, operationIndex, "path", value)
                                  }
                                />
                              </div>
                            </div>
                            <Field
                              label={text.integration.description}
                              as="textarea"
                              rows={2}
                              value={operation.description}
                              onChange={(value) =>
                                updateOperation(integrationIndex, operationIndex, "description", value)
                              }
                            />
                            <div className="flex justify-end">
                              <button
                                type="button"
                                className="text-xs font-medium text-rose-300 transition-colors hover:text-rose-200"
                                onClick={() => removeOperation(integrationIndex, operationIndex)}
                              >
                                {text.integration.remove}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-full rounded-2xl border border-dashed border-primary-400/60 bg-primary-500/10 px-4 py-3 text-sm font-semibold text-primary-100 transition hover:border-primary-300 hover:bg-primary-500/20"
              onClick={addIntegration}
            >
              {text.integration.addIntegration}
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Field
              label={text.behavior.triggers}
              as="textarea"
              rows={2}
              value={behaviorDesign.triggers}
              onChange={(value) => setBehaviorDesign((prev) => ({ ...prev, triggers: value }))}
              helper={
                locale === "he"
                  ? "תארו מצבים או פניות שמפעילות את הסוכן"
                  : "Describe the events or prompts that should activate the agent"
              }
            />
            <Field
              label={text.behavior.response}
              as="textarea"
              rows={3}
              value={behaviorDesign.response}
              onChange={(value) => setBehaviorDesign((prev) => ({ ...prev, response: value }))}
              helper={
                locale === "he"
                  ? "איזה ערך או תוצאה על הסוכן לספק בכל תרחיש"
                  : "What outcome should the agent deliver for each scenario"
              }
            />
            <Field
              label={text.behavior.tools}
              as="textarea"
              rows={3}
              value={behaviorDesign.tools}
              onChange={(value) => setBehaviorDesign((prev) => ({ ...prev, tools: value }))}
              helper={
                locale === "he"
                  ? "ציינו פקודות, קריאות API או אוטומציות פנימיות"
                  : "List commands, API calls or internal automations"
              }
            />
            <Field
              label={text.behavior.guardrails}
              as="textarea"
              rows={3}
              value={behaviorDesign.guardrails}
              onChange={(value) => setBehaviorDesign((prev) => ({ ...prev, guardrails: value }))}
              helper={
                locale === "he"
                  ? "מדיניות, מגבלות ותנאים שמחייבים את הסוכן"
                  : "Policies, limitations and mandatory rules"
              }
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{text.review.agentProfile}</h3>
              <div className="mt-3 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                {renderSummaryLine(text.fields.agentName, agentProfile.name)}
                {renderSummaryLine(text.fields.description, agentProfile.description)}
                {renderSummaryLine(text.fields.industry, agentProfile.industry)}
                {renderSummaryLine(text.fields.goals, agentProfile.goals)}
                {renderSummaryLine(text.fields.languages, agentProfile.languages)}
                {renderSummaryLine(text.fields.tone, agentProfile.tone)}
                {renderSummaryLine(text.fields.channels, agentProfile.channels)}
                {renderSummaryLine(text.fields.successCriteria, agentProfile.successCriteria)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{text.review.integrations}</h3>
              {integrations.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-400">
                  {text.review.emptyIntegrations}
                </p>
              ) : (
                <div className="mt-3 space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                      <h4 className="text-base font-semibold text-primary-200">{integration.name || "—"}</h4>
                      <div className="mt-2 grid gap-2 text-xs text-slate-300 md:grid-cols-2">
                        {renderSummaryLine(text.integration.baseUrl, integration.baseUrl, true)}
                        {renderSummaryLine(text.integration.authType, integration.authType, true)}
                      </div>
                      {integration.description && (
                        <p className="mt-2 text-sm text-slate-300">{integration.description}</p>
                      )}
                      {integration.operations.length > 0 && (
                        <ul className="mt-3 space-y-2 text-xs text-slate-300">
                          {integration.operations.map((operation) => (
                            <li
                              key={operation.id}
                              className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-3"
                            >
                              <span className="font-semibold text-primary-200">{operation.method}</span>{" "}
                              <span className="font-mono text-slate-100">{operation.path || "—"}</span>
                              {operation.description && (
                                <p className="mt-1 text-[0.7rem] leading-relaxed text-slate-300">
                                  {operation.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{text.review.behaviors}</h3>
              {behaviorDesign.triggers || behaviorDesign.response || behaviorDesign.tools || behaviorDesign.guardrails ? (
                <div className="mt-3 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                  {renderSummaryLine(text.behavior.triggers, behaviorDesign.triggers)}
                  {renderSummaryLine(text.behavior.response, behaviorDesign.response)}
                  {renderSummaryLine(text.behavior.tools, behaviorDesign.tools)}
                  {renderSummaryLine(text.behavior.guardrails, behaviorDesign.guardrails)}
                </div>
              ) : (
                <p className="mt-3 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-400">
                  {text.review.emptyBehaviors}
                </p>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                className="rounded-full bg-primary-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary-500/40 transition hover:bg-primary-400"
              >
                {text.review.submit}
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-accent-400 hover:text-accent-100"
              >
                {text.review.download}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="container-page space-y-16 py-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-center">
        <div className="space-y-6 text-center lg:text-start">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{content.title}</h1>
          {content.subtitle && <p className="text-base text-slate-200 lg:text-lg">{content.subtitle}</p>}
          <Markdown content={content.body} className="mx-auto max-w-none text-sm lg:text-base" />
          <div className="flex justify-center lg:justify-start">
            <button
              type="button"
              className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary-500/40 transition hover:bg-primary-400"
              onClick={() => goToStep(0)}
            >
              {text.cta}
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl shadow-primary-500/20">
          <div className="space-y-4 text-start">
            <h3 className="text-xl font-semibold text-primary-200">
              {locale === "he" ? "מה תקבלו במערכת" : "What you get"}
            </h3>
            {content.benefits && content.benefits.length > 0 && (
              <ul className="space-y-3 text-sm text-slate-200">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
                    <p className="font-semibold text-primary-100">{benefit.title}</p>
                    <p className="mt-1 text-xs text-slate-300">{benefit.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="text-2xl font-semibold text-primary-100">
            {locale === "he" ? "סטודיו לבניית סוכנים" : "Agent creation studio"}
          </h2>
          <p className="text-sm text-slate-300">
            {locale === "he"
              ? "עברו בין השלבים, מלאו את הפרטים החשובים וקבלו מפרט סוכן מסודר הכולל חיבורי API ונהלי עבודה."
              : "Move through the guided steps to describe your agent, connect APIs and produce a structured playbook."}
          </p>
          {content.workflowSteps && content.workflowSteps.length > 0 && (
            <ol className="space-y-4 text-sm text-slate-200">
              {content.workflowSteps.map((step, index) => (
                <li key={index} className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-sm font-semibold text-primary-100">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-primary-100">{step.title}</p>
                      <p className="text-xs text-slate-300">{step.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-inner shadow-slate-950/40">
          <div className="flex flex-wrap gap-2">
            {steps.map((stepLabel, index) => (
              <button
                key={stepLabel}
                type="button"
                className={clsx(
                  "rounded-full border px-4 py-1 text-xs font-semibold transition",
                  index === currentStep
                    ? "border-primary-500 bg-primary-500 text-slate-950 shadow"
                    : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-primary-300 hover:text-primary-100"
                )}
                onClick={() => goToStep(index)}
              >
                {index + 1}. {stepLabel}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-6">
            {renderStepContent()}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-accent-400 hover:text-accent-100 disabled:opacity-40"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
              >
                {text.navigation.previous}
              </button>
              <button
                type="button"
                className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-primary-500/40 transition hover:bg-primary-400"
                onClick={() => goToStep(currentStep + 1)}
              >
                {currentStep === steps.length - 1 ? text.navigation.finish : text.navigation.next}
              </button>
            </div>
          </div>
        </div>
      </section>

      {content.integrationOptions && content.integrationOptions.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary-100">
            {locale === "he" ? "חיבורי API פופולריים" : "Popular API integrations"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.integrationOptions.map((integration, index) => (
              <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 shadow-sm">
                <p className="text-sm font-semibold text-primary-200">{integration.name}</p>
                {integration.category && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-accent-200">{integration.category}</p>
                )}
                <p className="mt-2 text-xs text-slate-300">{integration.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.faqs && content.faqs.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary-100">
            {locale === "he" ? "שאלות נפוצות" : "Frequently asked questions"}
          </h2>
          <div className="space-y-4">
            {content.faqs.map((faq, index) => (
              <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="text-lg font-semibold text-slate-100">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  as?: "input" | "textarea";
  rows?: number;
  helper?: string;
};

function Field({ label, value, onChange, as = "input", rows, helper }: FieldProps) {
  const shared =
    "mt-1 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-primary-300 focus:outline-none";
  return (
    <label className="block text-sm font-medium text-slate-200">
      {label}
      {as === "textarea" ? (
        <textarea
          className={shared}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input className={shared} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </label>
  );
}

function renderSummaryLine(label: string, value: string, compact?: boolean) {
  if (!value) {
    return null;
  }
  return (
    <p className={clsx("text-slate-300", compact ? "text-xs" : "text-sm")}>
      <span className="font-semibold text-slate-100">{label}:</span> {value}
    </p>
  );
}
