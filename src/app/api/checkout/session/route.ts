import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

/** Returns paid Checkout Session totals for Meta Purchase (client pixel). */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("session_id");
  if (!id || !id.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json({ error: "Not paid" }, { status: 402 });
    }
    return NextResponse.json({
      sessionId: session.id,
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "eur").toUpperCase(),
      email: session.customer_details?.email ?? null,
    });
  } catch (err) {
    console.error("session lookup", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
