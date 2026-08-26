"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCartStore } from "@/lib/cart-store";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => {
    if (isDemo) clearCart();
  }, [isDemo, clearCart]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12 text-center md:py-20">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {isDemo ? "Demo užsakymas atliktas!" : "Ačiū už užsakymą!"}
        </h1>
        {isDemo && <p className="mt-4 text-muted">Išsaugota: data/demo-orders.json</p>}
        <Link
          href="/produktai"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-3 font-semibold text-warm-white transition hover:bg-accent-hover"
        >
          Grįžti į produktus
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
