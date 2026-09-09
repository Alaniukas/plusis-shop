"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCartStore } from "@/lib/cart-store";
import { COMPANY } from "@/lib/company";
import { trackMeta } from "@/lib/meta-pixel";

const PURCHASE_KEY = "plusis-meta-purchase";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (isDemo || sessionId) clearCart();
  }, [isDemo, sessionId, clearCart]);

  useEffect(() => {
    if (!sessionId || isDemo) return;
    try {
      if (sessionStorage.getItem(`${PURCHASE_KEY}:${sessionId}`)) return;
    } catch {
      /* ignore */
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          value?: number;
          currency?: string;
          sessionId?: string;
        };
        if (typeof data.value !== "number") return;
        trackMeta(
          "Purchase",
          {
            value: data.value,
            currency: data.currency ?? "EUR",
          },
          { eventID: data.sessionId ?? sessionId },
        );
        try {
          sessionStorage.setItem(`${PURCHASE_KEY}:${sessionId}`, "1");
        } catch {
          /* ignore */
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, isDemo]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12 text-center md:py-20">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {isDemo ? "Testinis užsakymas atliktas" : "Ačiū už užsakymą!"}
        </h1>
        <p className="mt-4 text-pretty text-muted">
          {isDemo
            ? "Demo režimas — mokėjimas nebuvo nuskaičiuotas. Kai įjungsite Stripe, čia matysite tikrą patvirtinimą."
            : `Patvirtinimą ir detales greitai atsiųsime el. paštu. Klausimai? ${COMPANY.email}`}
        </p>
        <Link
          href="/produktai"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-warm-white transition hover:bg-accent-hover sm:w-auto"
        >
          Grįžti į katalogą
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
