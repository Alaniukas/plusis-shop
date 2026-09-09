import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const recent = new Map<string, number>();
const RATE_MS = 2000;

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const now = Date.now();
    const last = recent.get(ip) ?? 0;
    if (now - last < RATE_MS) {
      return NextResponse.json({ ok: true, throttled: true });
    }
    recent.set(ip, now);
    if (recent.size > 5000) {
      for (const [k, t] of recent) {
        if (now - t > 60_000) recent.delete(k);
      }
    }

    const body = (await req.json()) as {
      path?: string;
      referrer?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    };

    const path = (body.path ?? "").slice(0, 500);
    if (!path || !path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const country =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      null;
    const ua = (req.headers.get("user-agent") ?? "").slice(0, 500);

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ ok: true, skipped: true });

    const { error } = await supabase.from("page_views").insert({
      path,
      referrer: (body.referrer ?? "").slice(0, 1000) || null,
      utm_source: (body.utm_source ?? "").slice(0, 200) || null,
      utm_medium: (body.utm_medium ?? "").slice(0, 200) || null,
      utm_campaign: (body.utm_campaign ?? "").slice(0, 200) || null,
      country,
      ua,
    });

    if (error) {
      console.error("page_views insert", error.message);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("analytics view", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
