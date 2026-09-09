declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window["fbq"];
  }
}

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "";

export function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem("plusis-cookie-consent");
    if (!raw) return false;
    const c = JSON.parse(raw) as { analytics?: boolean };
    return Boolean(c.analytics);
  } catch {
    return false;
  }
}

/** Loads fbevents.js + fbq('init') once. Call only after analytics consent. */
export function loadMetaPixel(pixelId = META_PIXEL_ID) {
  if (typeof window === "undefined" || !pixelId) return;
  if (window.fbq) {
    window.fbq("init", pixelId);
    return;
  }

  const n: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else (n.queue = n.queue || []).push(args);
  } as NonNullable<Window["fbq"]>;
  if (!window._fbq) window._fbq = n;
  window.fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  const s = document.getElementsByTagName("script")[0];
  s?.parentNode?.insertBefore(t, s);

  window.fbq!("init", pixelId);
}

export function trackMeta(
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;
  if (!hasAnalyticsConsent()) return;
  if (!window.fbq) loadMetaPixel();
  if (!window.fbq) return;
  if (options?.eventID) {
    window.fbq("track", event, params ?? {}, { eventID: options.eventID });
  } else {
    window.fbq("track", event, params ?? {});
  }
}
