import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  type OrderEmailItem,
  type ShippingAddress,
} from "@/lib/email";

type CartMetaItem = OrderEmailItem & { productId?: string };

function parseCartItems(raw: unknown): CartMetaItem[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((it: { name?: string; quantity?: number; priceEur?: number; image?: string; slug?: string; productId?: string }) => ({
      name: String(it.name ?? "Prekė"),
      quantity: Number(it.quantity ?? 1) || 1,
      priceEur: typeof it.priceEur === "number" ? it.priceEur : undefined,
      image: typeof it.image === "string" ? it.image : undefined,
      slug: typeof it.slug === "string" ? it.slug : undefined,
      productId: typeof it.productId === "string" ? it.productId : undefined,
    }));
  } catch {
    return [];
  }
}

type Addr = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  postal_code?: string | null;
  state?: string | null;
  country?: string | null;
};

function shippingFromSession(session: Record<string, unknown>): ShippingAddress | null {
  const collected = session.collected_information as
    | { shipping_details?: { name?: string | null; address?: Addr | null } | null }
    | null
    | undefined;
  const legacy = session.shipping_details as
    | { name?: string | null; address?: Addr | null }
    | null
    | undefined;
  const customer = session.customer_details as
    | { name?: string | null; address?: Addr | null; email?: string | null; phone?: string | null }
    | null
    | undefined;

  const ship = collected?.shipping_details ?? legacy;
  if (ship?.address) {
    return {
      name: ship.name ?? customer?.name ?? null,
      line1: ship.address.line1,
      line2: ship.address.line2,
      city: ship.address.city,
      postal_code: ship.address.postal_code,
      state: ship.address.state,
      country: ship.address.country,
    };
  }
  const addr = customer?.address;
  if (addr) {
    return {
      name: customer?.name ?? null,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      postal_code: addr.postal_code,
      state: addr.state,
      country: addr.country,
    };
  }
  return null;
}

async function decrementStock(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  items: CartMetaItem[],
) {
  for (const item of items) {
    const id = item.productId;
    if (!id) continue;
    const qty = Math.max(1, Number(item.quantity) || 1);

    const { data: row, error: selErr } = await supabase
      .from("products")
      .select("id, stock_count, status")
      .eq("id", id)
      .maybeSingle();

    if (selErr) {
      console.error("stock select failed", id, selErr.message);
      continue;
    }
    if (!row) continue;

    const current = Number(row.stock_count ?? 0);
    const next = Math.max(current - qty, 0);
    const patch: { stock_count: number; status?: string } = { stock_count: next };
    if (next === 0) patch.status = "sold_out";

    const { error: updErr } = await supabase.from("products").update(patch).eq("id", id);
    if (updErr) console.error("stock update failed", id, updErr.message);
  }
}

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "No webhook" }, { status: 400 });
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as unknown as Record<string, unknown> & {
      id: string;
      amount_total?: number | null;
      customer_email?: string | null;
      customer_details?: {
        email?: string | null;
        phone?: string | null;
        name?: string | null;
      } | null;
      metadata?: { items?: string } | null;
    };

    const email = session.customer_details?.email ?? session.customer_email ?? undefined;
    const phone = session.customer_details?.phone ?? null;
    const shippingAddress = shippingFromSession(session);
    const customerName = shippingAddress?.name ?? session.customer_details?.name ?? null;
    const totalEur = (session.amount_total ?? 0) / 100;
    const itemsRaw = session.metadata?.items;
    const cartItems = parseCartItems(itemsRaw);
    const items = cartItems.map(({ productId: _pid, ...rest }) => rest);

    let itemsJson: unknown = cartItems;
    try {
      if (itemsRaw) {
        itemsJson = typeof itemsRaw === "string" ? JSON.parse(itemsRaw) : itemsRaw;
      }
    } catch {
      itemsJson = cartItems;
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from("orders").upsert(
        {
          stripe_session_id: session.id,
          email: email ?? null,
          customer_name: customerName,
          phone,
          shipping_address: shippingAddress,
          total_eur: totalEur,
          items_json: itemsJson,
          status: "paid",
        },
        { onConflict: "stripe_session_id" },
      );
      if (error) console.error("order upsert failed", error.message);

      try {
        await decrementStock(supabase, cartItems);
      } catch (err) {
        console.error("stock decrement failed", err);
      }
    }

    if (email) {
      try {
        await sendOrderConfirmationEmail({
          to: email,
          orderId: session.id,
          totalEur,
          items,
          shippingAddress,
          phone,
          customerName,
        });
      } catch (err) {
        console.error("Resend order email failed", err);
      }

      try {
        await sendAdminOrderNotification({
          buyerEmail: email,
          orderId: session.id,
          totalEur,
          items,
          shippingAddress,
          phone,
          customerName,
        });
      } catch (err) {
        console.error("Resend admin notify failed", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
