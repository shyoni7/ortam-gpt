import { NextResponse } from "next/server";
import { siteContentSchema, localeSchema } from "@/content/schema";
import type { Locale, SiteContent } from "@/content/types";
import { setSiteContent, writeSiteContent } from "@/lib/content";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, number[]>();

function allowRequest(key: string) {
  const now = Date.now();
  const timestamps = rateLimitStore.get(key) ?? [];
  const filtered = timestamps.filter((ts) => now - ts < WINDOW_MS);
  if (filtered.length >= MAX_REQUESTS) {
    rateLimitStore.set(key, filtered);
    return false;
  }
  filtered.push(now);
  rateLimitStore.set(key, filtered);
  return true;
}

async function writeToGithub(locale: Locale, data: SiteContent) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !repo) {
    throw new Error("Missing GITHUB_TOKEN or GITHUB_REPO environment variables");
  }
  const path = `content/site.${locale}.json`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  const currentResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers,
    cache: "no-store",
  });
  if (!currentResponse.ok) {
    const body = await currentResponse.text();
    throw new Error(`Failed to load current content: ${currentResponse.status} ${body}`);
  }
  const current = (await currentResponse.json()) as { sha: string };
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const commitResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `chore(content): update site.${locale}.json via Admin UI`,
      content,
      sha: current.sha,
      branch,
    }),
  });
  if (!commitResponse.ok) {
    const body = await commitResponse.text();
    throw new Error(`Failed to commit content: ${commitResponse.status} ${body}`);
  }
  const result = (await commitResponse.json()) as { content?: { sha?: string } };
  return result.content?.sha ?? current.sha;
}

export async function POST(request: Request) {
  if (!allowRequest("admin-save")) {
    return NextResponse.json({ error: "יותר מדי בקשות. נסו שוב בעוד רגע." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "בקשה אינה חוקית" }, { status: 400 });
  }

  const localeParse = localeSchema.safeParse((payload as any)?.locale);
  if (!localeParse.success) {
    return NextResponse.json({ error: "שפה לא נתמכת" }, { status: 400 });
  }
  const locale = localeParse.data;

  const contentParse = siteContentSchema.safeParse((payload as any)?.data);
  if (!contentParse.success) {
    return NextResponse.json({ error: "נתוני תוכן אינם תקינים", details: contentParse.error.flatten() }, { status: 400 });
  }
  const validated = contentParse.data;

  try {
    let sha: string | undefined;
    if (process.env.NODE_ENV === "production") {
      sha = await writeToGithub(locale, validated);
      setSiteContent(locale, validated);
    } else {
      await writeSiteContent(locale, validated);
      sha = "local";
    }
    return NextResponse.json({ ok: true, sha });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "שמירה נכשלה" },
      { status: 500 }
    );
  }
}
