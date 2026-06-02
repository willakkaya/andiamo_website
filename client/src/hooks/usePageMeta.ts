import { useEffect } from "react";

const BASE_URL = "https://www.andiamoinbanca.com";

type PageMeta = {
  title: string;
  description: string;
  /** Absolute URL for the social share image. Falls back to the site default. */
  image?: string;
};

function setAttr(selector: string, attr: string, value: string) {
  document.querySelector(selector)?.setAttribute(attr, value);
}

/**
 * Keeps title, description, OpenGraph, Twitter, and canonical tags in sync per
 * page. Needed because this is a client-rendered SPA — without this, shared
 * links fall back to the static homepage tags in index.html.
 */
export function usePageMeta({ title, description, image }: PageMeta) {
  useEffect(() => {
    const url = `${BASE_URL}${window.location.pathname}`;

    document.title = title;
    setAttr('meta[name="description"]', "content", description);

    setAttr('meta[property="og:title"]', "content", title);
    setAttr('meta[property="og:description"]', "content", description);
    setAttr('meta[property="og:url"]', "content", url);

    setAttr('meta[name="twitter:title"]', "content", title);
    setAttr('meta[name="twitter:description"]', "content", description);

    if (image) {
      setAttr('meta[property="og:image"]', "content", image);
      setAttr('meta[name="twitter:image"]', "content", image);
    }

    setAttr('link[rel="canonical"]', "href", url);
  }, [title, description, image]);
}
