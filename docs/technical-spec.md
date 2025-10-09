# איפיון טכני – אתר תדמית ORTAM AI

## גרסה ושפות
- גרסה: 1.0
- שפת ברירת מחדל: עברית (RTL)
- שפה נוספת: אנגלית (LTR)

## 1. תקציר מנהלים ומטרות
- אתר תדמית מודרני המציג שלושה קווי פעילות עיקריים:
  1. חממה טכנולוגית (AI Incubator/Accelerator)
  2. מרכז הדרכה והכשרות (AI Academy / Training Hub)
  3. מרכז השמה ואפרנטיסשיפ (Placement & Apprenticeship)
- מטרות: מיתוג, המרת מתעניינים ללידים, גיוס שיתופי פעולה (אקדמיה, עיריות, ארגונים), ותיאום פגישות.
- דרישות כלליות: פאנל אדמין מלא לניהול תכנים, תמונות, טפסים ומדדים; תשתית SEO, מהירות ונגישות ברמת AA לפחות.

## 2. ארכיטקטורה מומלצת
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, תמיכה מלאה ב־RTL וב־i18n באמצעות `next-intl`.
- **Backend**: שימוש ב־Next.js API Routes; אפשרות עתידית ל־NestJS לשירותים נפרדים.
- **Database**: PostgreSQL דרך Prisma ORM.
- **אחסון מדיה**: AWS S3 או Cloudflare R2 באמצעות UploadThing/S3 SDK; תמונות סטטיות ב־`/public`.
- **אימות וזהויות**: NextAuth (דוא"ל/סיסמה + אופציה ל־OAuth), RBAC בסיסי.
- **פריסה**: Vercel (Frontend + API) עם Neon/Render ל־Postgres או Docker על שרת פרטי.
- **אינטגרציות**: Google Analytics v4 או Plausible, Google Tag Manager, ספק אימיילים (Resend/Mailgun/SES).
- **בינלאומיות**: עברית כברירת מחדל, אנגלית כגרסה עתידית; כל הטקסטים מנוהלים ב־CMS.

## 3. מיתוג ושפה עיצובית
- **צבעים מובילים**:
  - `--c-primary: #06B6D4`
  - `--c-bg: #111827`
  - `--c-accent: #F472B6`
- **פלטה משלימה**: primary והנגזרות (50–900), accent (50–900), גוונים ניטרליים בין `#0B1220` ל־`#9CA3AF`.
- **טיפוגרפיה**: כותרות – Heebo/Rubik; טקסטים – Assistant/Inter; משקלים 300–800; תמיכה מלאה ב־RTL.
- **קומפוננטים מרכזיים**: Hero, Navbar, Footer, Card, Badge, Accordion, Tabs, CTA Banner, Testimonial, LogoCloud, Steps, Timeline.
- **אייקונים**: lucide-react.
- **Grid**: 12 עמודות, ריווח 8/16/24/40px.
- **Motion**: Framer Motion עדין (fade/slide-in) עם תמיכה ב־prefers-reduced-motion.
- **נגישות**: ניגודיות AA+, מצבי פוקוס, HTML סמנטי, ARIA, תמיכה מלאה במקלדת.

## 4. מבנה תוכן וסייטמאפ
- `/` – דף בית (Landing)
- `/incubator` – חממה טכנולוגית
- `/academy` – מרכז הדרכה והכשרות
- `/placement` – מרכז השמה ואפרנטיסשיפ
- `/about` – אודות והחזון
- `/case-studies` – מקרי בוחן (דינמי)
- `/blog` – בלוג/חדשות (דינמי)
- `/partners` – שותפים ועיריות
- `/contact` – צור קשר / קביעת שיחה
- `/privacy`, `/terms` – עמודים משפטיים
- `/admin` – מערכת ניהול מאובטחת

> כל עמוד נשלט CMSית כ־Page + Sections מודולריים.

## 5. דף בית (Landing)
- **Hero**: כותרת ערך "הגשר בין העולם הישן לעולם של AI", CTA ראשי "תאמו שיחה", CTA משני "קבלו Deck".
- **Three Pillars**: שלושה כרטיסים עם קישורים לשלושת הדפים המרכזיים.
- **Value Propositions**: 6–8 נקודות מפתח (יעילות, חיסכון, הכשרות מותאמות, אינטגרציה לארגונים, מודלים כלכליים גמישים, פיילוט לקוח ראשון).
- **Process / How it Works**: תרשים 3–5 שלבים לכל רגל.
- **Logo Cloud**: שותפים (אוניברסיטאות, עיריות וכו').
- **Case Studies Highlights**: 2–3 כרטיסים נבחרים.
- **Testimonials**: ציטוטי לקוחות/שותפים.
- **Lead Magnet**: טופס לקבלת מסמך "מודלים עסקיים מול מכללות" / "AI Adoption Checklist".
- **Footer**: קישורים, פרטיות/תנאים, אייקונים חברתיים, פרטי קשר.

## 6. דפי רגליים
### 6.1 חממה טכנולוגית – `/incubator`
- Hero קצר ו־USP.
- What we build: מוצרים, סוכני AI, POCs, אינטגרציות (n8n/Make).
- For Whom: עיריות, מכללות, ארגונים.
- Process: Discovery → MVP/POC → Pilot → Scale.
- Economic Models: ריטיינר+שימוש, Success Fees, NTE Cap, Exit/Scale.
- Case Studies דינמי, FAQ, CTA לפגישת התאמה.

### 6.2 מרכז הדרכה – `/academy`
- Hero + הצעת ערך להכשרות מותאמות.
- Programs: כרטיסי מסלולים (Prompt Engineering, Agents, Marketing AI, Financial Literacy+AI, HR+AI, מורים ותלמידים וכו').
- Syllabi/Learning Outcomes: מבנה שיעורים קצר לכל תוכנית.
- For Organizations: מודלי הטמעה, ערב-הורה-ילד, ספרייה דיגיטלית לתושבים.
- Instructors: צוות ומרצים.
- FAQ + CTA.

### 6.3 מרכז השמה ואפרנטיסשיפ – `/placement`
- Hero + מסר הכשרה→יישום→פריסה.
- How it Works: איתור מועמדים, הכשרה, חניכה, הטמעה בצוותי לקוח.
- For Employers: יתרונות, SLA, מודלים, בקרה.
- For Candidates: מסלולים, דרישות, תהליך קבלה.
- KPIs: מדדים ומעקב.
- CTA כפול: מעסיקים / מועמדים.

> כל הדפים תומכים במודולים חוזרים: Hero, Highlights, Steps, CTA, Testimonials, Logos, FAQ, RichText.

## 7. מערכת אדמין (CMS/Backoffice)
- אפליקציית React ב־`/admin` עם NextAuth ותפקידי RBAC (Admin, Editor, Author, Viewer).
- **יכולות**:
  - Pages & Sections: CRUD לבלוקים מודולריים (Hero, Text, Image, Gallery, Video, Steps, Timeline, CTA, Logos, Testimonials, FAQ, CardsGrid).
  - Collections: Blog Posts, Case Studies, Programs, Partners, Testimonials, Media, Team.
  - Media Library: העלאה, חיפוש, תיוג, יצירת נגזרות WebP/AVIF.
  - Forms: ניהול טפסים (Contact, Lead Magnet, Employer/Candidate Intake) וחיבור למייל/CRM.
  - SEO: ניהול כותרות, תיאורים, OG, JSON-LD.
  - Localization: עריכת תרגומים לכל שדה (he/en).
  - Analytics: שילוב GA/Pixel והצגת KPIs.
  - RBAC: הרשאות מודולריות ולוג פעילות.
- **UI אדמין**: Dashboard, Pages, Collections, Media, Forms, Translations, SEO, Settings, Users & Roles, Audit Log.

## 8. מודלי נתונים (DB Schema)
- `User(id, name, email, password_hash?, role, createdAt)`
- `Role(id, name)` – Admin | Editor | Author | Viewer
- `Page(id, slug, title, locale, status, createdAt, updatedAt)`
- `Section(id, pageId, type, order, jsonPayload)`
- `Post(id, slug, title, excerpt, body, coverImageId, locale, status, publishedAt)`
- `CaseStudy(id, slug, title, summary, body, tags[], logoId, gallery[], locale, publishedAt)`
- `Program(id, slug, title, audience, duration, outlineJSON, locale, price?, status)`
- `Partner(id, name, logoId, url?, description, locale)`
- `Testimonial(id, author, title?, quote, avatarId?, org?, locale)`
- `Media(id, key, url, width, height, mime, alt, title, createdAt, uploadedBy)`
- `FormSubmission(id, formType, payloadJSON, sourcePage, createdAt)`
- `FAQ(id, question, answer, locale, category?)`
- `Translation(id, ns, key, value, locale)`
- `Setting(id, key, valueJSON)`
- `Section.jsonPayload` מחזיק מבני בלוקים גמישים המאומתים בסכמה.

## 9. API – נקודות קצה לדוגמה
- **Public**:
  - `GET /api/pages/:slug?locale=he|en`
  - `GET /api/posts?limit&offset&locale`
  - `GET /api/case-studies?tag&limit&locale`
  - `POST /api/forms/contact` (כולל rate-limit + captcha)
- **Admin** (JWT/Cookie + RBAC):
  - `POST /api/admin/pages`, `PATCH /api/admin/pages/:id`, `DELETE ...`
  - `POST /api/admin/sections`, `PATCH /api/admin/sections/:id`
  - `POST /api/admin/media/upload` (Signed URL ל־S3)
  - `GET /api/admin/analytics/overview`

## 10. מערכת קבצים ואחסון
- מבנה Repo: `/app`, `/components`, `/lib`, `/styles`, `/public`, `/prisma`, `/scripts`.
- מדיה ב־S3/R2, שמות סלאגיים, תיקיות לפי טיפוס/תאריך, מטא־דאטה ב־DB.
- CI/CD: בדיקות, Lint, TypeCheck, Preview Deploy לכל PR.

## 11. פרפורמנס ו־SEO
- תמונות: Next/Image, פורמטים WebP/AVIF, Lazy Loading, הגדרות Sizes מתאימות.
- קוד: Tree-shaking, code-splitting, RSC, ISR/SSG.
- SEO: כותרות/תיאורים ייחודיים, סכמות JSON-LD (Organization, Article, Course), מפת אתר, robots.txt.
- יעדי Lighthouse: 90+.

## 12. נגישות ו־RTL
- HTML סמנטי, aria, ניגודיות AA+, tabindex מותאם.
- תמיכה מלאה ב־RTL (`dir="rtl"` לעברית, `dir="ltr"` לאנגלית).
- תאימות מקלדת: focus states ברורים, skip-links, ללא מלכודות פוקוס.

## 13. טפסים והמרות
- Contact: שם, אימייל, טלפון, נושא, הודעה.
- Lead Magnet: אימייל + הסכמה (GDPR) ושליחת PDF אוטומטית.
- Employers/Candidates: טפסים ייעודיים ב־`/placement` (תפקיד, ניסיון, חברה, קישור).
- ולידציה: Zod + rate-limit + hCaptcha/Cloudflare Turnstile.
- אוטומציה: שליחת אימייל + webhook ל־CRM עתידי.

## 14. תוכן התחלה (Copy Skeleton)
- סלוגן-על: "ORTAM AI – המרכז לפיתוח AI".
- מסר ליבה: "אנחנו הגשר בין העולם הישן לעולם מבוסס AI – חממה, הכשרות והשמה במקום אחד."
- מיקרו-קופי CTA: "תיאום שיחה", "קבלו את ה-Deck", "דברו איתנו".

## 15. אבטחה ופרטיות
- HTTPS בלבד, Secure cookies, CSRF באדמין, rate-limit לטפסים.
- הצפנת סיסמאות (Argon2/Bcrypt), JWT קצר-חיים + Refresh.
- RBAC לכל פעולה.
- עמידה בתקנות פרטיות (Privacy/Terms), שמירת לוגים.

## 16. אנליטיקה ומדידה
- GA4/Plausible, אירועי CTA, Scroll Depth, Lead Submits.
- Dashboard אדמין להצגת המרות, פתיחות טפסים ומקורות תנועה (UTM).

## 17. תכולות פיתוח (Sprints)
1. **Sprint 1 – יסודות**: Next.js+TS, Tailwind, טוקנים, Layout RTL, i18n, דפי בסיס וקומפוננטים כלליים.
2. **Sprint 2 – CMS פנימי**: Prisma+Postgres, מודלי Page/Section/Media, אדמין Auth+RBAC, CRUD ל־Pages/Sections.
3. **Sprint 3 – אוספים דינמיים**: Blog, Case Studies, Programs, Partners, Testimonials; Media Library והעלאה ל־S3.
4. **Sprint 4 – טפסים ואוטומציה**: טפסים (Contact/Lead Magnet/Employers/Candidates), אימיילים, SEO בסיסי, Sitemap, OG.
5. **Sprint 5 – שיפורי UI/אנימציות**: Framer Motion, נגישות, מצבי לייט/דרק (אופציונלי).
6. **Sprint 6 – הפקה והשקה**: פריסה ל־Vercel/DB, ניטור, מסמכי הפעלה, הדרכת אדמין.

## 18. קווים מנחים לתוכן
- **חממה**: בעיה/הזדמנות, דוגמאות פתרונות (סוכני AI, אוטומציות), תהליך בשלבים, מודלים כלכליים, מקרי בוחן, CTA לפיילוט.
- **הדרכה**: מסלולים מרכזיים, מטרות למידה, קהלי יעד (ארגונים/מורים/נוער), פורמטים (סדנה/קורס/Bootcamp), צוות מרצים, CTA להצעת מחיר.
- **השמה**: תהליך חניכה, יתרונות למעסיקים, מסלולי מועמדים, KPIs, סיפורי הצלחה, CTA למעסיק/מועמד.

## 19. בדיקות וקבלת תוצר
- בדיקות פונקציונליות (CRUD, טפסים, RBAC, העלאות).
- בדיקות Lighthouse, נגישות, רספונסיביות (320–1440+).
- בדיקות תוכן RTL/EN, SEO (microdata).
- מסירת מסמכי DevOps, secrets, יצוא DB schema, מדריך אדמין PDF.

## 20. הרחבות עתידיות
- אינטגרציית CRM (HubSpot/Pipedrive), תזמון פגישות (Calendly), תשלומים (Stripe) לקורסים, חנות דיגיטלית, אזור לקוחות/סטודנטים.

## 21. Style Tokens (CSS Variables)
```css
:root {
  --c-primary: #06B6D4;
  --c-bg: #111827;
  --c-accent: #F472B6;
  --c-text: #E5E7EB;
  --c-muted: #9CA3AF;
  --radius: 16px;
}
```

## 22. מבנה סקשן גנרי לדוגמה
```json
{
  "type": "hero",
  "heading": "אנחנו הגשר לעולם ה-AI",
  "subheading": "חממה • הכשרות • השמה",
  "ctaPrimary": {"label": "תאמו שיחה", "href": "/contact"},
  "image": {"mediaId": 123, "alt": "צוות ORTAM AI"}
}
```

## 23. הערות מימוש
- פיצול קומפוננטים קטנים + Storybook (אופציונלי) לתיעוד UI.
- הגדרת Zod schemas לכל סוג Section וולידציה כפולה (אדמין + שרת).
- Rate-limit (LruCache/Upstash) לכל POST ציבורי.
- תיעוד README לשכבות (`app`, `lib`, `prisma`, `components`, `admin`).

## 24. קטלוג קומפוננטים ובלוקים
- **Navigation**: Navbar עליון עם תמיכה ב־RTL/LTR, מצב דביק, תפריט המבורגר במובייל, CTA ראשי.
- **Hero Variants**: גרסאות עם תמונה, וידאו או רקע גיאומטרי; תמיכה ב־split layout (תמונה+טקסט) וב־full-bleed.
- **Cards Grid**: קומפוננט עם וריאנטים (3/4 עמודות, אייקון/תמונה, CTA פנימי/חיצוני).
- **Highlights/Stats**: מציג מדדים (מספרים, אחוזים) עם אנימציית ספרה עולה.
- **Steps / Timeline**: תיאור תהליך ליניארי או כרונולוגי עם תמיכה במספרי שלב ואייקונים.
- **Testimonials Carousel**: גלילה אוטומטית/ידנית, תמיכה בציטוטים מרובי שפות, מצב compact לדסקטופ/מובייל.
- **Logo Cloud**: רשת לוגואים עם Grayscale hover, תמיכה ב־lazy-loading.
- **FAQ Accordion**: אקורדיון עם keyboard navigation מלא.
- **CTA Banner**: אזור קריאה לפעולה עם רקע מודגש, שני כפתורים ואופציית תיבה לקליטת אימייל.
- **Form Sections**: טפסים עם שדות דינמיים המוגדרים דרך ה־CMS (סוג השדה, ולידציה, place-holder).
- **Rich Text / MDX**: הצגה של תוכן עשיר (רשימות, Headings, ציטוטים) עם תמיכה במרכוז RTL.

## 25. סכמות JSON ל־Sections (דוגמאות מורחבות)
- **Hero**:
  ```json
  {
    "type": "hero",
    "layout": "split",
    "heading": "string",
    "subheading": "string",
    "badges": [{"label": "string", "variant": "primary|outline"}],
    "ctas": [
      {"label": "string", "href": "string", "style": "primary|secondary"}
    ],
    "media": {"mediaId": "number", "ratio": "16:9|1:1", "priority": false}
  }
  ```
- **Steps**:
  ```json
  {
    "type": "steps",
    "title": "string",
    "intro": "string",
    "steps": [
      {
        "order": 1,
        "title": "string",
        "description": "string",
        "icon": "string",
        "link": {"label": "string", "href": "string"}
      }
    ]
  }
  ```
- **Testimonials**:
  ```json
  {
    "type": "testimonials",
    "title": "string",
    "items": [
      {
        "testimonialId": "number",
        "quote": "string",
        "author": "string",
        "role": "string?",
        "avatarId": "number?"
      }
    ]
  }
  ```

## 26. DevOps, סביבות ותצורה
- **סביבות**: `development` (מקומי), `staging` (Vercel Preview + DB נפרד), `production` (Vercel Production + DB מנוהל).
- **ניהול Secrets**: שימוש ב־Vercel Environment Variables, הצפנה ב־1Password/HashiCorp Vault עבור צוות.
- **CI/CD**: GitHub Actions/Turborepo pipelines – lint, type-check, בדיקות יחידה, בדיקות e2e (Playwright) לפני deploy.
- **Monitoring**: שילוב Logtail/Datadog ל־Logs, Sentry ל־Front/Back, Health checks יומיים.
- **Backups**: Snapshot יומי ל־Postgres (Neon/Render), גיבוי שבועי ל־S3 bucket.
- **Infrastructure as Code (אופציונלי)**: Terraform להגדרת משאבים (S3, DNS, Secrets) – שלב עתידי.

## 27. ניהול תכנים ו־Workflow
- **Workflows**: מצב טיוטה → סקירה (Editor) → אישור (Admin) → פרסום.
- **Versioning**: שמירת היסטוריה ל־Pages/Sections עם אפשרות Rollback (Prisma soft-delete + טבלת Audit).
- **Media Governance**: תגיות (Tagging) לפי קטגוריה, תאריכים, זכויות שימוש; בדיקות גודל וקצב דחיסה אוטומטי.
- **Translation Flow**: יצירת Page באנגלית כנגזרת של העברית; תצוגת diff לשדות שעודכנו; אינטגרציה עתידית ל־Phrase/Locize.
- **Content Calendar**: Dashboard המציג פוסטים מתוכננים, סטטוס עדכונים ותזכורות לפרסום.

## 28. בדיקות ואוטומציה מורחבות
- **בדיקות יחידה**: שימוש ב־Vitest/Testing Library לקומפוננטים ו־Zod schemas.
- **בדיקות אינטגרציה**: בדיקת API Routes באמצעות Supertest/Next Test Client עם DB זמני.
- **בדיקות E2E**: Playwright עם תרחישים עיקריים (ביקור Landing, שליחת טופס, ניהול תוכן אדמין).
- **Lighthouse CI**: ריצה אוטומטית ב־PR ו־Production, שמירת דוחות בהיסטוריה.
- **Accessibility Audit**: axe-core/Pa11y כחלק מ־CI; בדיקות ידניות עם NVDA/VoiceOver.
- **Performance Budget**: הגדרת תקציב (First Load < 200KB JS, Largest Contentful Paint < 2.5s ב־3G מהיר).

## 29. ניהול סיכונים ומדדי הצלחה
- **סיכונים מרכזיים**: דיליי בהשגת תכנים, מגבלות משאבים ב־Admin, ביצועים ב־RTL, תלות בענן (S3/Neon).
- **צעדי מנע**: תוכנית תוכן מוקדמת, בדיקות ביצועים בשלבים מוקדמים, fallback לאחסון לוקלי, DRP (Disaster Recovery Plan).
- **KPIs**: Conversion Rate לטפסים (>4%), זמן טעינת LCP < 2.5 שניות, שביעות רצון אדמין (NPS 8+), מספר שיתופי פעולה חדשים לרבעון.
- **אנליטיקה מתקדמת**: מדידת פיצ'רים (Feature Flags), ניתוח משפכים (Funnels), A/B Testing ל־CTA.

## 30. נספחים וכלי עבודה
- **Stack מומלץ לצוות**: Jira/Linear לניהול משימות, Notion לתיעוד, Figma לעיצוב ו־Design Tokens export, Slack/Teams לתקשורת.
- **כלי עיצוב**: ספריית Figma עם רכיבים תואמים ל־shadcn/ui, Light/Dark themes, RTL mirroring.
- **תיעוד מפתחים**: Wiki לתהליך התקנה, סטנדרטים של קוד (ESLint, Prettier), naming conventions ל־Prisma ול־API.
- **Guides למרקטינג**: חיבור ל־HubSpot/CRM עתידי, מערך ניוזלטר (Resend), תבניות מיילים.

---
המסמך המעודכן מספק שכבת עומק נוספת לאיפיון, כולל פירוט קומפוננטים, תצורות DevOps, זרימות ניהול תוכן, בדיקות וסיכונים – להבטחת יישום קונסיסטנטי ומוכן לצמיחה של ORTAM AI.
