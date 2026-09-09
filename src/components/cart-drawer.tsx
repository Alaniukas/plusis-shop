"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  cartCount,
  cartSubtotal,
  useCartStore,
} from "@/lib/cart-store";
import {
  calculateDiscount,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  UNIT_PRICE,
} from "@/lib/pricing";
import { getDiscountLabel } from "@/lib/bundles";
import { formatEur } from "@/lib/utils";
import { trackMeta } from "@/lib/meta-pixel";

export function CartDrawer() {
  const open = useCartStore((s) => s.drawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemCount = cartCount(items);
  const subtotal = cartSubtotal(items);
  const discount = calculateDiscount(subtotal, itemCount);
  const discountLabel = getDiscountLabel(itemCount);
  const afterDiscount = subtotal - discount;
  const shipping =
    afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0 ? 0 : SHIPPING_COST;
  const total = afterDiscount + shipping;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeDrawer]);

  async function handleCheckout() {
    setBusy(true);
    setError(null);
    try {
      trackMeta("InitiateCheckout", {
        num_items: itemCount,
        value: total,
        currency: "EUR",
        content_ids: items.map((i) => i.productId),
        contents: items.map((i) => ({
          id: i.productId,
          quantity: i.quantity,
          item_price: i.priceEur,
        })),
      });
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
      setError(data.error || "Nepavyko pradėti apmokėjimo.");
    } catch {
      setError("Nepavyko pradėti apmokėjimo. Bandykite dar kartą.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const title = itemCount > 0 ? `Krepšelis (${itemCount})` : "Krepšelis";

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Krepšelis">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"
        aria-label="Uždaryti"
        onClick={closeDrawer}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-warm-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <h2 className="font-display text-xl tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream"
            aria-label="Uždaryti"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {items.length === 0 ? (
            <p className="py-10 text-center text-muted">Krepšelis tuščias.</p>
          ) : (
            <div className="space-y-3">
              {itemCount === 1 && (
                <p className="rounded-xl border border-accent-soft bg-accent-soft/60 p-3 text-sm">
                  Pridėkite dar vieną — gausite <strong>−10%</strong>. Trys ir daugiau —{" "}
                  <strong>−15%</strong>.
                </p>
              )}
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 rounded-2xl border border-border bg-warm-white p-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{item.name}</p>
                    <p className="text-sm text-muted">{formatEur(UNIT_PRICE)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg"
                        aria-label="Mažinti kiekį"
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg"
                        aria-label="Didinti kiekį"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="min-h-10 px-2 text-sm text-muted"
                      >
                        Pašalinti
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="sticky bottom-0 border-t border-border bg-warm-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
            <div className="space-y-1.5 text-sm text-muted">
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
              <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold text-foreground">
                <span>Viso</span>
                <span>{formatEur(total)}</span>
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={busy}
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-accent font-bold text-warm-white disabled:opacity-60"
            >
              {busy ? "Jungiamasi…" : "Apmokėti"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
