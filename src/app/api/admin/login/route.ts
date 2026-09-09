import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  checkAdminPassword,
  signAdminToken,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string };
    if (!password || !checkAdminPassword(password)) {
      return NextResponse.json({ error: "Neteisingas slaptažodis" }, { status: 401 });
    }
    const token = signAdminToken();
    if (!token) {
      return NextResponse.json({ error: "ADMIN_PASSWORD nenustatytas" }, { status: 500 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Klaida" }, { status: 500 });
  }
}
