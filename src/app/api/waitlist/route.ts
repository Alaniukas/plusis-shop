import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isDemoMode } from "@/lib/demo-mode";
import { appendDemoRecord } from "@/lib/demo-store";
export async function POST(req: Request) {
  const { email, productId } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  if (isDemoMode()) {
    appendDemoRecord("demo-waitlist.json", { email, productId });
    return NextResponse.json({ ok: true, demo: true });
  }
  const supabase = getSupabaseAdmin();
  if (supabase) await supabase.from("waitlist").insert({ email, product_id: productId ?? null });
  return NextResponse.json({ ok: true });
}