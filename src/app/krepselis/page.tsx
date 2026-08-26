"use client";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { calculateDiscount, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, UNIT_PRICE } from "@/lib/pricing";
import { cartCount, cartSubtotal, useCartStore } from "@/lib/cart-store";
import { getDiscountLabel } from "@/lib/bundles";
import { formatEur } from "@/lib/utils";

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

  async function handleCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Nepavyko pradėti apmokėjimo");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 md:py-14">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Krepšelis</h1>
        {itemCount === 1 && (
          <p className="mt-4 rounded-xl border border-accent-soft bg-accent-soft/60 p-4 text-sm text-foreground">
            Pridėkite dar vieną — gausite <strong>−15%</strong>. Trys ir daugiau — <strong>−20%</strong>.
          </p>
        )}
        {items.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-pretty text-muted">Krepšelis tuščias — laikas rasti savo plušį.</p>
            <Link
              href="/produktai"
              className="mt-4 inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-3 font-bold text-warm-white transition hover:bg-accent-hover"
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
            <div className="space-y-2 rounded-2xl border border-border bg-warm-white p-6 text-sm text-muted card-shadow">
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
              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 min-h-12 w-full rounded-full bg-accent py-3 font-bold text-warm-white transition hover:bg-accent-hover"
              >
                Apmokėti
              </button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
