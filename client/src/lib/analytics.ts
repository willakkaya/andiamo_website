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

// High-value conversions — these become "Conversion" events in Google Ads
export const trackQuoteSubmit = (params: { guestCount: number; menuTier: string; estimatedTotal: number }) =>
  trackEvent("quote_submit", {
    event_category: "lead",
    event_label: params.menuTier,
    value: params.estimatedTotal,
    currency: "USD",
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
