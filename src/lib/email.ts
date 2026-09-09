import { Resend } from "resend";
import { COMPANY } from "@/lib/company";

const FROM = `${COMPANY.brand} <${COMPANY.email}>`;
const ADMIN_NOTIFY = "alaniukasa@gmail.com";

const C = {
  cream: "#faf6f1",
  accent: "#d4785c",
  text: "#2c2420",
  muted: "#6b5e55",
  border: "#e8ddd3",
  warm: "#fffdfb",
};

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export type OrderEmailItem = {
  name: string;
  quantity: number;
  priceEur?: number;
  image?: string | null;
  slug?: string | null;
};

export type ShippingAddress = {
  name?: string | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  postal_code?: string | null;
  state?: string | null;
  country?: string | null;
};

function appBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "https://plusis.lt";
  const withProto = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProto.replace(/\/$/, "");
}

/** Absolute HTTPS URL for product thumbnail in emails (public Supabase Storage, never cid). */
export function absoluteProductImageUrl(image?: string | null): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  const path = image.startsWith("/") ? image : `/${image}`;
  const photoMatch = path.match(/^\/products\/photos\/(.+)$/i);
  if (photoMatch) {
    const base = (
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://uehmgghqonkegumhtiqz.supabase.co"
    ).replace(/\/$/, "");
    return `${base}/storage/v1/object/public/product-photos/${photoMatch[1]}`;
  }
  return `${appBaseUrl()}${path}`;
}

function formatEur(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function addWorkingDays(from: Date, days: number): Date {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) left -= 1;
  }
  return d;
}

function formatLtDate(d: Date) {
  return d.toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAddress(addr?: ShippingAddress | null) {
  if (!addr) return null;
  const lines = [
    addr.name,
    addr.line1,
    addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(" "),
    addr.state,
    addr.country === "LT" ? "Lietuva" : addr.country,
  ].filter(Boolean);
  return lines.length ? lines.join("\n") : null;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="lt">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};color:${C.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:600px;background:${C.warm};border:1px solid ${C.border};border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(44,36,32,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,${C.accent} 0%,#c0654a 100%);padding:22px 28px;">
            <p style="margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.92);font-weight:700;">${COMPANY.brand}</p>
            <p style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.25;color:#fff;font-weight:600;">${escapeHtml(title)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.55;color:${C.text};">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px 26px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:13px;color:${C.muted};border-top:1px solid ${C.border};">
            <p style="margin:0;">Klausimai: <a href="mailto:${COMPANY.email}" style="color:${C.accent};text-decoration:none;">${COMPANY.email}</a></p>
            <p style="margin:8px 0 0;">— ${COMPANY.brand} / ${COMPANY.name}</p>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-family:system-ui,sans-serif;font-size:11px;color:${C.muted};">Šis laiškas apie tavo užsakymą Plušyje.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function itemsCardsHtml(items: OrderEmailItem[]) {
  return items
    .map((it) => {
      const img = absoluteProductImageUrl(it.image);
      const lineTotal =
        it.priceEur != null ? formatEur(it.priceEur * it.quantity) : "";
      const unit = it.priceEur != null ? formatEur(it.priceEur) : "";
      const thumb = img
        ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(it.name)}" width="72" height="72" style="display:block;width:72px;height:72px;object-fit:cover;border-radius:12px;border:1px solid ${C.border};background:${C.cream};"/>`
        : `<div style="width:72px;height:72px;border-radius:12px;background:${C.cream};border:1px solid ${C.border};"></div>`;
      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid ${C.border};vertical-align:top;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="84" style="vertical-align:top;">${thumb}</td>
              <td style="vertical-align:top;padding-left:12px;">
                <p style="margin:0;font-weight:700;font-size:15px;color:${C.text};">${escapeHtml(it.name)}</p>
                <p style="margin:4px 0 0;font-size:13px;color:${C.muted};">Kiekis: ${it.quantity}${unit ? ` · ${unit}` : ""}</p>
              </td>
              <td style="vertical-align:top;text-align:right;white-space:nowrap;font-weight:700;color:${C.accent};padding-left:8px;">${lineTotal}</td>
            </tr>
          </table>
        </td>
      </tr>`;
    })
    .join("");
}

export async function sendOrderConfirmationEmail(opts: {
  to: string;
  orderId: string;
  totalEur: number;
  items: OrderEmailItem[];
  shippingAddress?: ShippingAddress | null;
  phone?: string | null;
  customerName?: string | null;
  orderDate?: Date;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const };

  const orderDate = opts.orderDate ?? new Date();
  const fromD = addWorkingDays(orderDate, 2);
  const toD = addWorkingDays(orderDate, 3);
  const deliveryLabel = `${formatLtDate(fromD)} – ${formatLtDate(toD)}`;
  const addr = formatAddress(opts.shippingAddress);
  const total = formatEur(opts.totalEur);
  const greeting = opts.customerName ? `Labas, ${opts.customerName}!` : "Labas!";

  const subject = `Užsakymas gautas — ${COMPANY.brand}`;
  const itemsText = opts.items
    .map((i) => `- ${i.name} × ${i.quantity}${i.priceEur != null ? ` (${formatEur(i.priceEur)})` : ""}`)
    .join("\n");

  const text = [
    greeting,
    "",
    "Ačiū — tavo Plušis užsakymas gautas ir jau ruošiamas.",
    `Užsakymo nr.: ${opts.orderId}`,
    `Suma: ${total}`,
    "",
    "Prekės:",
    itemsText,
    "",
    `Numatomas pristatymas: ${deliveryLabel} (2–3 darbo dienos).`,
    addr ? `Pristatymo adresas:\n${addr}` : "",
    opts.phone ? `Tel.: ${opts.phone}` : "",
    "",
    `Klausimai: ${COMPANY.email}`,
    "",
    `— ${COMPANY.brand} / ${COMPANY.name}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  const bodyHtml = `
    <p style="margin:0 0 10px;font-size:16px;">${escapeHtml(greeting)}</p>
    <p style="margin:0 0 20px;color:${C.muted};">Ačiū — tavo <strong style="color:${C.text};">Plušis</strong> užsakymas gautas. Jau ruošiame, kad greitai būtų kelyje pas tave.</p>

    <table role="presentation" width="100%" style="margin:0 0 18px;background:${C.cream};border:1px solid ${C.border};border-radius:14px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="margin:0;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Užsakymo nr.</p>
          <p style="margin:4px 0 0;font-weight:700;word-break:break-all;">${escapeHtml(opts.orderId)}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Ką nupirkai</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      ${itemsCardsHtml(opts.items)}
      <tr>
        <td style="padding:14px 0 0;">
          <table role="presentation" width="100%">
            <tr>
              <td style="font-weight:700;font-size:16px;">Iš viso</td>
              <td style="text-align:right;font-weight:800;font-size:18px;color:${C.accent};">${total}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="background:${C.cream};border:1px solid ${C.border};border-radius:14px;padding:16px 18px;margin:18px 0;">
      <p style="margin:0;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Numatomas pristatymas</p>
      <p style="margin:6px 0 0;font-weight:700;font-size:16px;">${escapeHtml(deliveryLabel)}</p>
      <p style="margin:6px 0 0;font-size:13px;color:${C.muted};">2–3 darbo dienos nuo užsakymo datos</p>
    </div>

    ${
      addr
        ? `<p style="margin:0 0 4px;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Pristatymo adresas</p>
           <p style="margin:0 0 12px;white-space:pre-line;line-height:1.45;">${escapeHtml(addr)}</p>`
        : ""
    }
    ${
      opts.phone
        ? `<p style="margin:0;font-size:14px;color:${C.muted};">Tel.: ${escapeHtml(opts.phone)}</p>`
        : ""
    }
  `;

  const result = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject,
    text,
    html: shell("Užsakymas gautas", bodyHtml),
  });

  return { sent: true as const, id: result.data?.id ?? null, error: result.error };
}

export async function sendAdminOrderNotification(opts: {
  buyerEmail: string;
  orderId: string;
  totalEur: number;
  items: OrderEmailItem[];
  shippingAddress?: ShippingAddress | null;
  phone?: string | null;
  customerName?: string | null;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const };

  const addr = formatAddress(opts.shippingAddress);
  const total = formatEur(opts.totalEur);
  const itemsText = opts.items.map((i) => `- ${i.name} × ${i.quantity}`).join("\n");

  const subject = `[Plušis] Naujas užsakymas ${opts.orderId.slice(0, 18)}`;
  const text = [
    "Naujas apmokėtas užsakymas",
    `Pirkėjas: ${opts.customerName ?? "—"} <${opts.buyerEmail}>`,
    `Tel.: ${opts.phone ?? "—"}`,
    `Suma: ${total}`,
    `Užsakymo nr.: ${opts.orderId}`,
    "",
    "Prekės:",
    itemsText,
    "",
    addr ? `Adresas:\n${addr}` : "Adresas: —",
  ].join("\n");

  const bodyHtml = `
    <p style="margin:0 0 12px;"><strong>Naujas apmokėtas užsakymas</strong></p>
    <p style="margin:0 0 8px;">Pirkėjas: ${escapeHtml(opts.customerName ?? "—")} &lt;${escapeHtml(opts.buyerEmail)}&gt;</p>
    <p style="margin:0 0 8px;">Tel.: ${escapeHtml(opts.phone ?? "—")}</p>
    <p style="margin:0 0 8px;">Suma: <strong style="color:${C.accent};">${total}</strong></p>
    <p style="margin:0 0 16px;">Nr.: ${escapeHtml(opts.orderId)}</p>
    <table role="presentation" width="100%">${itemsCardsHtml(opts.items)}</table>
    ${
      addr
        ? `<p style="margin:16px 0 4px;color:${C.muted};font-size:13px;">Adresas</p>
           <p style="margin:0;white-space:pre-line;">${escapeHtml(addr)}</p>`
        : ""
    }
  `;

  const result = await resend.emails.send({
    from: FROM,
    to: ADMIN_NOTIFY,
    subject,
    text,
    html: shell("Naujas užsakymas", bodyHtml),
  });

  return { sent: true as const, id: result.data?.id ?? null, error: result.error };
}

export async function sendOrderShippedEmail(opts: {
  to: string;
  orderId: string;
  customerName?: string | null;
  trackingNumber?: string | null;
  carrier?: string | null;
  trackingUrl?: string | null;
  items?: OrderEmailItem[];
  shippingAddress?: ShippingAddress | null;
  /** @deprecated use trackingNumber / carrier / trackingUrl */
  trackingNote?: string | null;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const };

  const greeting = opts.customerName ? `Labas, ${opts.customerName}!` : "Labas!";
  const subject = `Tavo Plušis išsiųstas`;
  const trackingNumber = opts.trackingNumber?.trim() || null;
  const carrier = opts.carrier?.trim() || null;
  const trackingUrl = opts.trackingUrl?.trim() || null;
  const legacyNote = opts.trackingNote?.trim() || null;
  const items = opts.items ?? [];
  const shipAddr = formatAddress(opts.shippingAddress);
  const itemsText = items.length
    ? items
        .map((i) => `- ${i.name} × ${i.quantity}${i.priceEur != null ? ` (${formatEur(i.priceEur)})` : ""}`)
        .join("\n")
    : "";

  const text = [
    greeting,
    "",
    "Geros žinios — tavo Plušis užsakymas išsiųstas!",
    `Užsakymo nr.: ${opts.orderId}`,
    itemsText ? "Prekės:" : "",
    itemsText,
    carrier ? `Vežėjas: ${carrier}` : "",
    trackingNumber ? `Sekimo nr.: ${trackingNumber}` : "",
    trackingUrl ? `Sekimas: ${trackingUrl}` : legacyNote ? `Sekimas: ${legacyNote}` : "",
    !trackingNumber && !carrier && !trackingUrl && !legacyNote
      ? "Netrukus turėtų pasiekti tave (paprastai 1–2 d. d. po išsiuntimo)."
      : "",
    shipAddr ? `Pristatymo adresas:
${shipAddr}` : "",
    "",
    `Klausimai: ${COMPANY.email}`,
    "",
    `— ${COMPANY.brand} / ${COMPANY.name}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  const trackBlock =
    trackingNumber || carrier || trackingUrl || legacyNote
      ? `<div style="background:${C.cream};border:1px solid ${C.border};border-radius:14px;padding:16px 18px;margin:8px 0 0;">
          ${
            carrier
              ? `<p style="margin:0;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Vežėjas</p>
                 <p style="margin:4px 0 12px;font-weight:700;font-size:16px;">${escapeHtml(carrier)}</p>`
              : ""
          }
          ${
            trackingNumber
              ? `<p style="margin:0;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Sekimo numeris</p>
                 <p style="margin:4px 0 12px;font-weight:700;font-size:16px;letter-spacing:0.02em;">${escapeHtml(trackingNumber)}</p>`
              : ""
          }
          ${
            trackingUrl
              ? `<a href="${escapeHtml(trackingUrl)}" style="display:inline-block;margin-top:4px;padding:11px 18px;border-radius:999px;background:${C.accent};color:#fff;font-weight:700;font-size:14px;text-decoration:none;">Sekti siuntą</a>`
              : legacyNote
                ? `<p style="margin:0;font-size:14px;color:${C.muted};">${escapeHtml(legacyNote)}</p>`
                : ""
          }
        </div>`
      : `<p style="margin:0;color:${C.muted};font-size:14px;">Paprastai siunta pasiekia per 1–2 darbo dienas po išsiuntimo.</p>`;

  const itemsSection = items.length
    ? `
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Ką nupirkai</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      ${itemsCardsHtml(items)}
    </table>`
    : "";

  const bodyHtml = `
    <p style="margin:0 0 10px;font-size:16px;">${escapeHtml(greeting)}</p>
    <p style="margin:0 0 18px;">Geros žinios — <strong>tavo Plušis išsiųstas</strong>. Tikimės, kad greitai apkabins!</p>
    <p style="margin:0 0 4px;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Užsakymo nr.</p>
    <p style="margin:0 0 18px;font-weight:700;word-break:break-all;">${escapeHtml(opts.orderId)}</p>
    ${itemsSection}
    ${
      shipAddr
        ? `<p style="margin:0 0 4px;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;">Pristatymo adresas</p>
           <p style="margin:0 0 18px;white-space:pre-line;line-height:1.45;">${escapeHtml(shipAddr)}</p>`
        : ""
    }
    ${trackBlock}
  `;

  const result = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject,
    text,
    html: shell("Tavo Plušis išsiųstas", bodyHtml),
  });

  return { sent: true as const, id: result.data?.id ?? null, error: result.error };
}

/** Siunčia abu testinius šablonus (patvirtinimas su foto + išsiųsta su sekimu). */
export async function sendTestEmails(to = ADMIN_NOTIFY) {
  const sampleItems: OrderEmailItem[] = [
    {
      name: "Bambukas",
      quantity: 1,
      priceEur: 38.99,
      image: "/products/photos/product-panda-1.jpg",
      slug: "panda",
    },
    {
      name: "Mira",
      quantity: 1,
      priceEur: 38.99,
      image: "/products/photos/product-koala-1.jpg",
      slug: "koala",
    },
  ];
  const sampleAddr: ShippingAddress = {
    name: "Testas Testauskas",
    line1: "Gedimino pr. 1",
    city: "Vilnius",
    postal_code: "01103",
    country: "LT",
  };

  const confirmation = await sendOrderConfirmationEmail({
    to,
    orderId: "test_cs_plusis_demo",
    totalEur: 77.98,
    items: sampleItems,
    shippingAddress: sampleAddr,
    phone: "+37060000000",
    customerName: "Testas",
  });

  const shipped = await sendOrderShippedEmail({
    to,
    orderId: "test_cs_plusis_demo",
    customerName: "Testas",
    items: sampleItems,
    shippingAddress: sampleAddr,
    carrier: "Omniva",
    trackingNumber: "JJD0000999999999999999",
    trackingUrl: "https://omniva.lt/privatus/siuntu_sekimas",
  });

  return { confirmation, shipped };
}
