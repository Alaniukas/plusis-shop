import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "plusis_admin";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return pw;
}

export function signAdminToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + MAX_AGE_MS;
  const payload = `admin:${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const expStr = payload.split(":")[1];
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export function checkAdminPassword(password: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  };
}

export function requireAdminFromRequest(req: Request): boolean {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)plusis_admin=([^;]+)/);
  return verifyAdminToken(match ? decodeURIComponent(match[1]) : null);
}
