import type { SiteContent } from "./types";

const heroAnimationUrl =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWRlNjQycDk5OG81MGo5NWp2dWF3cWFoc3Z3dWNpMzUwMG5tbnFjYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlOvJ7yaacpuSas/giphy.gif";

const galleryPlaceholders = {
  he: [
    { url: "https://placehold.co/600x400/111827/06B6D4?text=%D7%97%D7%9E%D7%9E%D7%94", alt: "מצגת השראה בחממה" },
    {
      url: "https://placehold.co/600x400/111827/F472B6?text=%D7%90%D7%A7%D7%93%D7%9E%D7%99%D7%94",
      alt: "כיתה פעילה בתוכנית האקדמיה",
    },
    {
      url: "https://placehold.co/600x400/111827/E5E7EB?text=%D7%94%D7%A9%D7%9E%D7%94",
      alt: "מנטורים ומועמדים במרכז ההשמה",
    },
  ],
  en: [
    { url: "https://placehold.co/600x400/111827/06B6D4?text=Incubator", alt: "Innovation workshop in the incubator" },
    {
      url: "https://placehold.co/600x400/111827/F472B6?text=Academy",
      alt: "Academy cohort collaborating",
    },
    {
      url: "https://placehold.co/600x400/111827/E5E7EB?text=Placement",
      alt: "Placement mentors with apprentices",
    },
  ],
} as const;

const svgDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const promptProgramIcon = svgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="gradPrompt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#F472B6" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="24" fill="#0F172A" />
    <path d="M40 35h40v18L62 80H40z" fill="url(#gradPrompt)" />
    <circle cx="54" cy="58" r="6" fill="#0F172A" />
    <text x="60" y="102" font-family="Heebo,Arial" font-size="20" text-anchor="middle" fill="#E5E7EB">Prompt</text>
  </svg>
`);

const agentsProgramIcon = svgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="gradAgents" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F472B6" />
        <stop offset="100%" stop-color="#06B6D4" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="24" fill="#0F172A" />
    <g fill="none" stroke="url(#gradAgents)" stroke-width="6" stroke-linecap="round">
      <path d="M35 60h50" />
      <path d="M45 44l30 32" />
      <path d="M75 44l-30 32" />
    </g>
    <circle cx="35" cy="60" r="9" fill="#0F172A" stroke="#F472B6" stroke-width="4" />
    <circle cx="85" cy="60" r="9" fill="#0F172A" stroke="#06B6D4" stroke-width="4" />
    <text x="60" y="104" font-family="Heebo,Arial" font-size="18" text-anchor="middle" fill="#E5E7EB">Agents</text>
  </svg>
`);

const hrProgramIcon = svgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="gradHR" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#0EA5E9" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="24" fill="#0F172A" />
    <rect x="28" y="32" width="64" height="56" rx="16" fill="url(#gradHR)" />
    <circle cx="60" cy="54" r="12" fill="#E0F2FE" />
    <path d="M40 90c2-14 14-22 20-22s18 8 20 22" stroke="#0F172A" stroke-width="6" stroke-linecap="round" fill="none" />
    <text x="60" y="108" font-family="Heebo,Arial" font-size="18" text-anchor="middle" fill="#E5E7EB">HR</text>
  </svg>
`);

const educatorsProgramIcon = svgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="gradEdu" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F472B6" />
        <stop offset="100%" stop-color="#FB7185" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="24" fill="#0F172A" />
    <path d="M28 52l32-20 32 20-32 20z" fill="url(#gradEdu)" />
    <path d="M60 72v20" stroke="#FDE68A" stroke-width="6" stroke-linecap="round" />
    <circle cx="60" cy="96" r="8" fill="#FDE68A" />
    <text x="60" y="112" font-family="Heebo,Arial" font-size="18" text-anchor="middle" fill="#E5E7EB">Edu</text>
  </svg>
`);

export const defaultContent: SiteContent = {
  he: {
    navigation: {
      brand: "ORTAM AI",
      languageSwitchLabel: "English",
      links: [
        { key: "home", path: "", label: "בית" },
        { key: "about", path: "/about", label: "עלינו" },
        { key: "academy", path: "/academy", label: "אקדמיה" },
        { key: "incubator", path: "/incubator", label: "חממה" },
        { key: "placement", path: "/placement", label: "השמה" },
        { key: "contact", path: "/contact", label: "צור קשר" },
      ],
    },
    home: {
      eyebrow: "ORTAM AI",
      heading: "אנחנו הגשר בין העולם הישן לעולם מבוסס AI",
      subheading: "חממה טכנולוגית, מרכז הדרכה ומערך השמה תחת קורת גג אחת.",
      description:
        "אנחנו שותפי הצמיחה של עיריות, מוסדות חינוך וארגונים שרוצים ליישם AI במהירות, בביטחון ובהלימה לערכים שלהם.",
      primaryCta: { label: "תיאום שיחה", path: "/contact" },
      secondaryCta: { label: "גלו עוד", path: "/about" },
      media: {
        src: heroAnimationUrl,
        alt: "הדמיה אנימטיבית של סביבות AI מרובדות בצבעי ORTAM",
      },
      gallery: galleryPlaceholders.he.map((item) => ({ src: item.url, alt: item.alt })),
      pillars: [
        {
          key: "incubator",
          title: "חממה טכנולוגית",
          description: "בניית סוכני AI, אינטגרציות ופתרונות מותאמים לעיריות וארגונים.",
          path: "/incubator",
        },
        {
          key: "academy",
          title: "מרכז הדרכה",
          description: "מסלולי Upskilling לצוותי ניהול, שיווק, חינוך ומערכות מידע.",
          path: "/academy",
        },
        {
          key: "placement",
          title: "מרכז השמה",
          description: "מסלולי התמחות והטמעה של טאלנט AI בארגון שלכם.",
          path: "/placement",
        },
      ],
    },
    about: {
      title: "על ORTAM AI",
      paragraphs: [
        "ORTAM AI הוקמה כדי להנגיש חדשנות AI לכל רשות, מוסד וארגון בישראל.",
        "אנחנו משלבים טכנולוגיה, חינוך והכשרות בתוך מעטפת אחת שמייצרת תוצאות מדידות.",
        "הצוות שלנו מגיע מעולמות של עיריות חכמות, אקדמיה וסטארט-אפים ומוביל שינוי מעשי.",
      ],
    },
    academy: {
      title: "תוכניות הדגל של האקדמיה",
      description:
        "תוכניות מותאמות תפקידים שמביאות את הצוותים שלכם לרמת תפקוד AI-first תוך שבועות ספורים.",
      programs: [
        {
          key: "prompt-engineering",
          title: "Prompt Engineering למקדמי חדשנות",
          description: "סדנאות מעשיות לשימוש נכון במודלים גנרטיביים והגדרת פרוטוקולים בארגון.",
          duration: "4 מפגשים",
          image: {
            src: promptProgramIcon,
            alt: "איור של תוכנית Prompt Engineering",
          },
        },
        {
          key: "ai-agents",
          title: "בניית סוכני AI תפעוליים",
          description: "הכשרה לצוותים טכניים בבניית אוטומציות, אינטגרציות ו-SOP לניהול סוכנים.",
          duration: "6 מפגשים",
          image: {
            src: agentsProgramIcon,
            alt: "איור של סוכני AI בפעולה",
          },
        },
        {
          key: "hr-ai",
          title: "HR + AI לניהול ההון האנושי",
          description: "כלי מיון, הדרכה ותמיכה מבוססי AI עבור משאבי אנוש וצוותי למידה.",
          duration: "5 מפגשים",
          image: {
            src: hrProgramIcon,
            alt: "איור של צוות HR דיגיטלי",
          },
        },
        {
          key: "educators",
          title: "אוריינות AI למורים ותלמידים",
          description: "מודל הורה-מורה-תלמיד להטמעת AI בבתי ספר ובקהילות חינוך.",
          duration: "סמסטר אחד",
          image: {
            src: educatorsProgramIcon,
            alt: "איור של מרחב למידה חדשני",
          },
        },
      ],
    },
    incubator: {
      title: "מסלול החממה",
      description:
        "מניעים פרויקטים מבוססי AI מקונספט ועד סקייל בתוך חודשים – עם חונכות צמודה ומודלים עסקיים גמישים.",
      stages: [
        {
          title: "Discovery & התאמה",
          description: "מיפוי הצרכים, תשתיות הנתונים והגדרת KPIs.",
        },
        {
          title: "פיתוח MVP / POC",
          description: "בניית פתרון ראשוני, חיבור למערכות ומדידת ערך.",
        },
        {
          title: "Pilot מודרך",
          description: "הטמעת שימוש אמיתי עם צוותי המפתח והפקת מסקנות.",
        },
        {
          title: "Scale & Enablement",
          description: "התרחבות לכלל הארגון והעברת הידע פנימה.",
        },
      ],
    },
    placement: {
      title: "השמה ואפרנטיסשיפ",
      description:
        "מסלול דו-כיווני שמחבר בוגרי הכשרות לארגונים המחפשים מומחי AI מנוסים.",
      employersTitle: "למעסיקים",
      employers: [
        "איתור מועמדים שנבחנו בתרחישים אמיתיים",
        "חניכה ו-Onboarding מונחים בידי צוות ORTAM AI",
        "מדדי ביצוע ותוכניות שימור ברורות",
      ],
      candidatesTitle: "למועמדים",
      candidates: [
        "מסלולי התמחות במיזמי AI חיים",
        "Mentorship צמוד ובניית פורטפוליו",
        "אפשרויות השמה בעיריות, מכללות וארגונים מובילים",
      ],
    },
    contact: {
      title: "דברו איתנו",
      description: "נשמח ללמוד על האתגרים שלכם ולבנות פתרון מותאם.",
      fields: {
        name: "שם מלא",
        email: "אימייל",
        message: "איך נוכל לעזור?",
        submit: "שליחה",
      },
      successMessage: "הטופס נשלח בהצלחה! נחזור אליכם תוך 24 שעות.",
      errorMessage: "אירעה תקלה בשליחה. נסו שוב או פנו אלינו במייל team@ortam.ai.",
    },
    footer: {
      rights: `© ${new Date().getFullYear()} ORTAM AI. כל הזכויות שמורות.`,
      contact: "team@ortam.ai | ‎03-1234567",
    },
  },
  en: {
    navigation: {
      brand: "ORTAM AI",
      languageSwitchLabel: "עברית",
      links: [
        { key: "home", path: "", label: "Home" },
        { key: "about", path: "/about", label: "About" },
        { key: "academy", path: "/academy", label: "Academy" },
        { key: "incubator", path: "/incubator", label: "Incubator" },
        { key: "placement", path: "/placement", label: "Placement" },
        { key: "contact", path: "/contact", label: "Contact" },
      ],
    },
    home: {
      eyebrow: "ORTAM AI",
      heading: "We bridge legacy organizations into the AI era",
      subheading: "Incubator, Academy, and Placement services united under one platform.",
      description:
        "We partner with municipalities, colleges, and enterprises to deliver measurable AI adoption with accountable governance.",
      primaryCta: { label: "Book a call", path: "/contact" },
      secondaryCta: { label: "Explore more", path: "/about" },
      media: {
        src: heroAnimationUrl,
        alt: "Animated hero visual showing layered AI systems in ORTAM colors",
      },
      gallery: galleryPlaceholders.en.map((item) => ({ src: item.url, alt: item.alt })),
      pillars: [
        {
          key: "incubator",
          title: "Incubator",
          description: "AI agents, automations, and integrations built with your teams.",
          path: "/incubator",
        },
        {
          key: "academy",
          title: "Academy",
          description: "Role-based learning sprints with tangible playbooks.",
          path: "/academy",
        },
        {
          key: "placement",
          title: "Placement",
          description: "Apprenticeship programs that embed AI talent into your org.",
          path: "/placement",
        },
      ],
    },
    about: {
      title: "About ORTAM AI",
      paragraphs: [
        "ORTAM AI helps public sector and education leaders unlock the promise of responsible AI.",
        "We deliver an end-to-end playbook that combines incubation, enablement, and workforce development.",
        "Our cross-functional team brings experience from smart cities, academia, and startups to de-risk innovation.",
      ],
    },
    academy: {
      title: "Flagship Academy Programs",
      description:
        "Role-tailored curricula designed to create AI-first teams in a matter of weeks.",
      programs: [
        {
          key: "prompt-engineering",
          title: "Prompt Engineering for Innovation Leads",
          description: "Hands-on labs for governing generative AI and designing enterprise prompts.",
          duration: "4 sessions",
          image: {
            src: promptProgramIcon,
            alt: "Prompt engineering course illustration",
          },
        },
        {
          key: "ai-agents",
          title: "Operational AI Agents",
          description: "Train technical squads to deploy automations, integrations, and SOPs.",
          duration: "6 sessions",
          image: {
            src: agentsProgramIcon,
            alt: "AI agents course illustration",
          },
        },
        {
          key: "hr-ai",
          title: "HR + AI for People Teams",
          description: "Toolkits for recruitment, learning, and engagement augmented by AI.",
          duration: "5 sessions",
          image: {
            src: hrProgramIcon,
            alt: "HR and AI program illustration",
          },
        },
        {
          key: "educators",
          title: "AI Literacy for Educators",
          description: "Parent-teacher-student model for equitable AI adoption in schools.",
          duration: "One term",
          image: {
            src: educatorsProgramIcon,
            alt: "Educators AI literacy illustration",
          },
        },
      ],
    },
    incubator: {
      title: "Incubator Journey",
      description:
        "Accelerate AI initiatives from discovery to scale with co-creation, pilots, and sustainable ownership.",
      stages: [
        {
          title: "Discovery & Alignment",
          description: "Assess needs, data readiness, and define measurable KPIs.",
        },
        {
          title: "MVP / POC Build",
          description: "Deliver working prototypes, integrate systems, and validate impact.",
        },
        {
          title: "Guided Pilot",
          description: "Launch with real stakeholders, capture insights, and iterate.",
        },
        {
          title: "Scale & Enablement",
          description: "Transition to full operations with governance and training.",
        },
      ],
    },
    placement: {
      title: "Placement & Apprenticeship",
      description:
        "A dual-track model connecting academy graduates with employers building AI capabilities.",
      employersTitle: "For employers",
      employers: [
        "Pre-vetted talent aligned to your AI roadmap",
        "Onboarding and mentorship delivered by ORTAM AI coaches",
        "Performance dashboards and retention support",
      ],
      candidatesTitle: "For candidates",
      candidates: [
        "Hands-on apprenticeships inside live AI programs",
        "Personal mentorship and portfolio development",
        "Placements with municipalities, colleges, and enterprise partners",
      ],
    },
    contact: {
      title: "Let's connect",
      description: "Tell us about your priorities and we'll tailor the next step together.",
      fields: {
        name: "Full name",
        email: "Email",
        message: "How can we help?",
        submit: "Send",
      },
      successMessage: "Thanks for reaching out! We'll respond within one business day.",
      errorMessage: "Something went wrong. Please try again or email team@ortam.ai.",
    },
    footer: {
      rights: `© ${new Date().getFullYear()} ORTAM AI. All rights reserved.`,
      contact: "team@ortam.ai | +972-3-123-4567",
    },
  },
};
