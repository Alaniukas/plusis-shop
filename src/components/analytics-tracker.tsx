"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { hasAnalyticsConsent, trackMeta } from "@/lib/meta-pixel";

const STORAGE_KEY = "plusis-cookie-consent";

function trackInternal(path: string) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  const params = new URLSearchParams(window.location.search);
  const payload = {
    path,
    referrer: document.referrer || "",
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };

  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/view", blob);
      return;
    }
  } catch {
    /* fall through */
  }
  void fetch("/api/analytics/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

/** Page views: internal beacon + Meta Pixel (after cookie consent). */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const q = searchParams?.toString();
    const path = q ? `${pathname}?${q}` : pathname;
    trackInternal(path);
    trackMeta("PageView");
  }, [pathname, searchParams]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && hasAnalyticsConsent() && pathname) {
        trackInternal(pathname);
        trackMeta("PageView");
      }
    }
    function onConsent() {
      if (hasAnalyticsConsent() && pathname) {
        trackInternal(pathname);
        trackMeta("PageView");
      }
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("plusis-cookie-consent", onConsent as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("plusis-cookie-consent", onConsent as EventListener);
    };
  }, [pathname]);

  return null;
}
