// Lightweight wrapper around gtag for tracking conversion events.
// Safe to call before gtag has loaded — events queue on dataLayer.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

// Share of quote requests expected to become a booked event. Google Ads reads
// `value` as what one lead is worth, so it gets quote x this rate, not the full
// quote. Provisional figure: replace with the restaurant's real booking rate.
export const QUOTE_CLOSE_RATE = 0.25;

// High-value conversions — these become "Conversion" events in Google Ads
export const trackQuoteSubmit = (params: { guestCount: number; menuTier: string; estimatedTotal: number }) =>
  trackEvent("quote_submit", {
    event_category: "lead",
    event_label: params.menuTier,
    value: Math.round(params.estimatedTotal * QUOTE_CLOSE_RATE),
    currency: "USD",
    quote_total: params.estimatedTotal,
    guest_count: params.guestCount,
  });

export const trackContactSubmit = (source: string) =>
  trackEvent("contact_submit", {
    event_category: "lead",
    event_label: source,
  });

export const trackEmailCapture = (source: string) =>
  trackEvent("email_capture", {
    event_category: "lead",
    event_label: source,
  });

export const trackPhoneClick = (location: string) =>
  trackEvent("phone_click", {
    event_category: "lead",
    event_label: location,
  });

export const trackTextClick = (location: string) =>
  trackEvent("text_click", {
    event_category: "lead",
    event_label: location,
  });

export const trackReservationClick = (location: string) =>
  trackEvent("reservation_click", {
    event_category: "engagement",
    event_label: location,
  });

export const trackCateringInquiry = (headcount: string) =>
  trackEvent("catering_inquiry", {
    event_category: "lead",
    event_label: headcount,
  });

export const trackEzCaterClick = (location: string) =>
  trackEvent("ezcater_click", {
    event_category: "engagement",
    event_label: location,
  });

// Event menus — how planners reach the menus and what they do with a tier
export const trackEventMenusClick = (source: string) =>
  trackEvent("event_menus_click", {
    event_category: "event_menus",
    event_label: source,
  });

export const trackTierLinkCopy = (tier: string) =>
  trackEvent("event_menu_link_copy", {
    event_category: "event_menus",
    event_label: tier,
  });

export const trackTierEstimate = (tier: string) =>
  trackEvent("event_menu_estimate", {
    event_category: "event_menus",
    event_label: tier,
  });

export const trackPlannerPdf = (source: string) =>
  trackEvent("event_menu_pdf", {
    event_category: "event_menus",
    event_label: source,
  });
