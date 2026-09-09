import { NextResponse } from "next/server";
import type { CartItem } from "@/types/product";
import { getStripe } from "@/lib/stripe";
import { calculateDiscount, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/pricing";
import { isDemoMode } from "@/lib/demo-mode";
import { appendDemoRecord } from "@/lib/demo-store";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };
    if (!items?.length) return NextResponse.json({ error: "Empty cart" }, { status: 400 });

    const subtotal = items.reduce((s, i) => s + i.priceEur * i.quantity, 0);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const discount = calculateDiscount(subtotal, itemCount);
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = afterDiscount + shipping;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    if (isDemoMode()) {
      appendDemoRecord("demo-orders.json", {
        id: `demo-${Date.now()}`,
        items,
        subtotal,
        discount,
        shipping,
        total,
        status: "paid_demo",
      });
      return NextResponse.json({ url: `${appUrl}/uzsakymas/sekme?demo=1`, demo: true });
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      for (const item of items) {
        const productId = item.productId;
        if (!productId) continue;
        const { data: row, error } = await supabase
          .from("products")
          .select("id, name, stock_count")
          .eq("id", productId)
          .maybeSingle();
        if (error) {
          console.error("stock check failed", error.message);
          return NextResponse.json({ error: "Nepavyko patikrinti atsargų" }, { status: 500 });
        }
        if (!row) continue;
        const stock = Number(row.stock_count ?? 0);
        if (stock < item.quantity) {
          const label = row.name || item.name || productId;
          return NextResponse.json(
            { error: `Nepakanka atsargų: ${label}` },
            { status: 400 },
          );
        }
      }
    }

    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur" as const,
        product_data: { name: item.name },
        unit_amount: Math.round(item.priceEur * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Pristatymas" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}/uzsakymas/sekme?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/krepselis`,
      shipping_address_collection: { allowed_countries: ["LT"] },
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      locale: "lt",
      metadata: { items: JSON.stringify(items) },
      payment_method_types: ["card", "revolut_pay"],
    };

    if (discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: "eur",
        duration: "once",
        name: itemCount >= 3 ? "Nuolaida 15%" : "Nuolaida 10%",
      });
      sessionParams.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("checkout error", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
