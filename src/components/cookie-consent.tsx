"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = {
  necessary: true;
  analytics: boolean;
};

const STORAGE_KEY = "plusis-cookie-consent";

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadClarity(id: string) {
  if (typeof window === "undefined" || window.clarity) return;
  window.clarity = function (...args: unknown[]) {
    (window.clarity!.q = window.clarity!.q || []).push(args);
  };
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${id}`;
  document.head.appendChild(s);
}

function loadGtag(id: string) {
  if (typeof window === "undefined" || document.getElementById("ga-gtag")) return;
  const s = document.createElement("script");
  s.id = "ga-gtag";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setVisible(true);
        return;
      }
      applyConsent(JSON.parse(raw) as Consent);
    } catch {
      setVisible(true);
    }
  }, []);

  function applyConsent(c: Consent) {
    if (!c.analytics) return;
    const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;
    const ga = process.env.NEXT_PUBLIC_GA_ID;
    if (clarity) loadClarity(clarity);
    if (ga) loadGtag(ga);
  }

  function save(analytics: boolean) {
    const c: Consent = { necessary: true, analytics };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    applyConsent(c);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-6">
      <div className="pointer-events-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-warm-white p-4 shadow-lg sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <div className="flex-1 text-sm leading-relaxed text-muted">
          <p className="font-semibold text-foreground">Mes naudojame slapukus</p>
          <p className="mt-1">
            Kad veiktų krepšelis ir svetainė. Jei sutiksite — padėsime geriau suprasti, kas jums
            patinka, ir tobulinti Plušį.{" "}
            <Link href="/privatumo-politika" className="underline underline-offset-2 hover:text-foreground">
              Daugiau privatumo politikoje
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => save(false)}
            className="min-h-11 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-cream"
          >
            Tik būtini
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            className="min-h-11 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Sutinku
          </button>
        </div>
      </div>
    </div>
  );
}
