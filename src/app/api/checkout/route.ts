import { NextResponse } from "next/server";
import type { CartItem } from "@/types/product";
import { getStripe } from "@/lib/stripe";
import { calculateDiscount, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/pricing";
import { isDemoMode } from "@/lib/demo-mode";
import { appendDemoRecord } from "@/lib/demo-store";
export async function POST(req: Request) {
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
    appendDemoRecord("demo-orders.json", { id: `demo-${Date.now()}`, items, subtotal, discount, shipping, total, status: "paid_demo" });
    return NextResponse.json({ url: `${appUrl}/uzsakymas/sekme?demo=1`, demo: true });
  }
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const lineItems = items.map((item) => ({ price_data: { currency: "eur", product_data: { name: item.name }, unit_amount: Math.round(item.priceEur * 100) }, quantity: item.quantity }));
  if (discount > 0) lineItems.push({ price_data: { currency: "eur", product_data: { name: "Nuolaida" }, unit_amount: -Math.round(discount * 100) }, quantity: 1 });
  if (shipping > 0) lineItems.push({ price_data: { currency: "eur", product_data: { name: "Pristatymas" }, unit_amount: Math.round(shipping * 100) }, quantity: 1 });
  const session = await stripe.checkout.sessions.create({ mode: "payment", line_items: lineItems, success_url: `${appUrl}/uzsakymas/sekme`, cancel_url: `${appUrl}/krepselis`, shipping_address_collection: { allowed_countries: ["LT"] }, locale: "lt", metadata: { items: JSON.stringify(items) } });
  return NextResponse.json({ url: session.url });
}