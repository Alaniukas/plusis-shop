"use client";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { calculateDiscount, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, UNIT_PRICE } from "@/lib/pricing";
import { cartCount, cartSubtotal, useCartStore } from "@/lib/cart-store";
import { getDiscountLabel } from "@/lib/bundles";
import { formatEur } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => cartSubtotal(s.items));
  const itemCount = useCartStore((s) => cartCount(s.items));
  const discount = calculateDiscount(subtotal, itemCount);
  const discountLabel = getDiscountLabel(itemCount);
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0 ? 0 : SHIPPING_COST;
  const total = afterDiscount + shipping;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Nepavyko pradėti apmokėjimo. Bandykite dar kartą.");
    } catch {
      setError("Nepavyko pradėti apmokėjimo. Patikrinkite internetą ir bandykite dar kartą.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 pb-36 md:py-14 md:pb-14">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Krepšelis</h1>
        {itemCount === 1 && (
          <p className="mt-4 rounded-xl border border-accent-soft bg-accent-soft/60 p-4 text-sm text-foreground">
            Pridėkite dar vieną — gausite <strong>−10%</strong>. Trys ir daugiau —{" "}
            <strong>−15%</strong>.
          </p>
        )}
        {items.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-pretty text-muted">Krepšelis tuščias — laikas rasti savo plušį.</p>
            <Link
              href="/produktai"
              className="mt-4 inline-flex min-h-12 items-center rounded-full bg-accent px-6 py-3 font-bold text-warm-white transition hover:bg-accent-hover"
            >
              Į parduotuvę
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 rounded-2xl border border-border bg-warm-white p-3 card-shadow sm:gap-4 sm:p-4"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream sm:h-20 sm:w-20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold leading-snug">{item.name}</p>
                  <p className="text-muted">{formatEur(UNIT_PRICE)}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-lg hover:bg-cream-dark"
                      aria-label="Mažinti kiekį"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-lg hover:bg-cream-dark"
                      aria-label="Didinti kiekį"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="min-h-11 px-2 text-sm text-muted hover:text-foreground"
                    >
                      Pašalinti
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-2 rounded-2xl border border-border bg-warm-white p-5 text-sm text-muted card-shadow sm:p-6">
              <div className="flex justify-between">
                <span>Suma</span>
                <span>{formatEur(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>{discountLabel}</span>
                  <span>−{formatEur(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pristatymas</span>
                <span>{shipping === 0 ? "Nemokamas" : formatEur(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold text-foreground">
                <span>Viso</span>
                <span>{formatEur(total)}</span>
              </div>
              {error && <p className="pt-2 text-sm text-red-600">{error}</p>}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={busy}
                className="mt-4 hidden min-h-12 w-full rounded-full bg-accent py-3 font-bold text-warm-white transition hover:bg-accent-hover disabled:opacity-60 md:inline-flex md:items-center md:justify-center"
              >
                {busy ? "Jungiamasi…" : "Apmokėti"}
              </button>
            </div>
          </div>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-warm-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Viso</p>
              <p className="truncate text-base font-extrabold text-foreground">{formatEur(total)}</p>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={busy}
              className="min-h-12 shrink-0 rounded-full bg-accent px-6 py-3 font-bold text-warm-white disabled:opacity-60"
            >
              {busy ? "…" : "Apmokėti"}
            </button>
          </div>
          {error && <p className="mx-auto mt-2 max-w-4xl text-xs text-red-600">{error}</p>}
        </div>
      )}

      <SiteFooter />
    </>
  );
}