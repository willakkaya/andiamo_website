import { useEffect } from "react";
import pageMeta from "@/lib/pageMeta.json";

const BASE_URL = "https://www.andiamoinbanca.com";

type PageMetaEntry = { title: string; description: string; image?: string };
const META = pageMeta as Record<string, PageMetaEntry>;

function setAttr(selector: string, attr: string, value: string) {
  document.querySelector(selector)?.setAttribute(attr, value);
}

/**
 * Keeps title, description, OpenGraph, Twitter, and canonical tags in sync per
 * page at runtime. Reads from the same pageMeta.json that the build-time
 * prerender step uses (scripts/prerender.mjs), so the tags a real browser sees
 * always match the static tags baked in for social/link-preview crawlers.
 */
export function usePageMeta(route: keyof typeof pageMeta) {
  useEffect(() => {
    const meta = META[route];
    if (!meta) return;

    const url = `${BASE_URL}${route}`;

    document.title = meta.title;
    setAttr('meta[name="description"]', "content", meta.description);

    setAttr('meta[property="og:title"]', "content", meta.title);
    setAttr('meta[property="og:description"]', "content", meta.description);
    setAttr('meta[property="og:url"]', "content", url);

    setAttr('meta[name="twitter:title"]', "content", meta.title);
    setAttr('meta[name="twitter:description"]', "content", meta.description);

    if (meta.image) {
      const img = meta.image.startsWith("http")
        ? meta.image
        : `${BASE_URL}${meta.image}`;
      setAttr('meta[property="og:image"]', "content", img);
      setAttr('meta[name="twitter:image"]', "content", img);
    }

    setAttr('link[rel="canonical"]', "href", url);
  }, [route]);
}
