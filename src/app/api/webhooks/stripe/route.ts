import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "No webhook" }, { status: 400 });
  const body = await req.text();
  let event;
  try { event = stripe.webhooks.constructEvent(body, sig, secret); } catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const supabase = getSupabaseAdmin();
    if (supabase && session.metadata?.items) {
      await supabase.from("orders").insert({ stripe_session_id: session.id, email: session.customer_details?.email, total_eur: (session.amount_total ?? 0) / 100, items_json: session.metadata.items, status: "paid" });
    }
  }
  return NextResponse.json({ received: true });
}