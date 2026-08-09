"use client";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { calculateDiscount, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, UNIT_PRICE } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";
import { getDiscountLabel } from "@/lib/bundles";
import { formatEur } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.totalItems());
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
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Krepšelis</h1>
        {itemCount === 1 && (
          <p className="mt-4 rounded-xl border border-accent-soft bg-accent-soft/60 p-4 text-sm text-foreground">
            Pridėkite dar vieną — gausite <strong>−15%</strong>. Trys ir daugiau — <strong>−20%</strong>.
          </p>
        )}
        {items.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-muted">Krepšelis tuščias — laikas rasti savo plušį.</p>
            <Link
              href="/produktai"
              className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 font-bold text-warm-white transition hover:bg-accent-hover"
            >
              Į parduotuvę
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-border bg-warm-white p-4 card-shadow"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold">{item.name}</p>
                  <p className="text-muted">{formatEur(UNIT_PRICE)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="rounded-full border border-border px-3 py-1 hover:bg-cream-dark"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="rounded-full border border-border px-3 py-1 hover:bg-cream-dark"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-muted hover:text-foreground"
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
                className="mt-4 w-full rounded-full bg-accent py-3 font-bold text-warm-white transition hover:bg-accent-hover"
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
