import he from "../../content/site.he.json";
import en from "../../content/site.en.json";
import type { LocaleSiteContent, SiteContent } from "./types";

const defaultContent: LocaleSiteContent = {
  he: he as SiteContent,
  en: en as SiteContent,
};

export default defaultContent;
