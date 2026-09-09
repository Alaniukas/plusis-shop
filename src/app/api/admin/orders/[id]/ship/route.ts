import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendOrderShippedEmail, type OrderEmailItem, type ShippingAddress } from "@/lib/email";

function parseItems(raw: unknown): OrderEmailItem[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((it: { name?: string; quantity?: number; priceEur?: number; image?: string; slug?: string }) => ({
      name: String(it.name ?? "Prekė"),
      quantity: Number(it.quantity ?? 1) || 1,
      priceEur: typeof it.priceEur === "number" ? it.priceEur : undefined,
      image: typeof it.image === "string" ? it.image : undefined,
      slug: typeof it.slug === "string" ? it.slug : undefined,
    }));
  } catch {
    return [];
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  let trackingNumber: string | null = null;
  let carrier: string | null = null;
  let trackingUrl: string | null = null;
  try {
    const body = (await req.json()) as {
      trackingNumber?: string;
      tracking_number?: string;
      carrier?: string;
      trackingUrl?: string;
      tracking_url?: string;
    };
    trackingNumber = (body.trackingNumber ?? body.tracking_number)?.trim() || null;
    carrier = body.carrier?.trim() || null;
    trackingUrl = (body.trackingUrl ?? body.tracking_url)?.trim() || null;
  } catch {
    /* optional body */
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "No DB" }, { status: 500 });

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, email, customer_name, shipped_at, stripe_session_id, status, items_json, shipping_address")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Užsakymas nerastas" }, { status: 404 });
  }

  const shippedAt = new Date().toISOString();
  const { error: updErr } = await supabase
    .from("orders")
    .update({
      shipped_at: shippedAt,
      status: "shipped",
      tracking_number: trackingNumber,
      carrier,
      tracking_url: trackingUrl,
    })
    .eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  if (order.email) {
    try {
      const items = parseItems(order.items_json);
      const shippingAddress = (order.shipping_address ?? null) as ShippingAddress | null;
      await sendOrderShippedEmail({
        to: order.email,
        orderId: order.stripe_session_id ?? order.id,
        customerName: order.customer_name,
        trackingNumber,
        carrier,
        trackingUrl,
        shippingAddress,
        ...(items.length ? { items } : {}),
      });
    } catch (err) {
      console.error("shipped email failed", err);
      return NextResponse.json(
        { ok: true, emailError: true, shipped_at: shippedAt },
        { status: 200 },
      );
    }
  }

  return NextResponse.json({ ok: true, shipped_at: shippedAt });
}
