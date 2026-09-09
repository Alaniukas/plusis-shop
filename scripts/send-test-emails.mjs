/**
 * Test order + shipped emails from verified info@plusis.lt
 * Photos: CID inline (works with verified domain) from local public files.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

function loadEnvLocal() {
  const raw = readFileSync(resolve(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvLocal();

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error("RESEND_API_KEY missing");
  process.exit(1);
}

const { Resend } = require("resend");
const resend = new Resend(key);

const C = {
  cream: "#faf6f1",
  accent: "#d4785c",
  text: "#2c2420",
  muted: "#6b5e55",
  border: "#e8ddd3",
  warm: "#fffdfb",
};

const from = process.env.RESEND_FROM || "Plušis <info@plusis.lt>";
const to = process.env.RESEND_TEST_TO || "alaniukasa@gmail.com";
const photoDir = resolve(root, "public/products/photos");

const items = [
  { name: "Bambukas", file: "product-panda-1.jpg", cid: "bambukas", qty: 1, price: "38,99 €" },
  { name: "Mira", file: "product-koala-1.jpg", cid: "mira", qty: 1, price: "38,99 €" },
];

const attachments = items.map((it) => ({
  filename: it.file,
  content: readFileSync(resolve(photoDir, it.file)),
  contentId: it.cid,
  contentType: "image/jpeg",
}));

function shell(title, body) {
  return `<!DOCTYPE html><html lang="lt"><body style="margin:0;background:${C.cream};">
  <table width="100%" style="padding:28px 12px;background:${C.cream};"><tr><td align="center">
  <table width="100%" style="max-width:600px;background:${C.warm};border:1px solid ${C.border};border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(44,36,32,0.06);">
  <tr><td style="background:linear-gradient(135deg,${C.accent} 0%,#c0654a 100%);padding:22px 28px;color:#fff;">
    <p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font:700 12px system-ui;">Plušis</p>
    <p style="margin:8px 0 0;font:600 24px Georgia,serif;">${title}</p>
  </td></tr>
  <tr><td style="padding:28px;font:15px/1.55 system-ui;color:${C.text};">${body}</td></tr>
  <tr><td style="padding:18px 28px 26px;border-top:1px solid ${C.border};font:13px system-ui;color:${C.muted};">— Plušis / Lafela, MB · info@plusis.lt · plusis.lt</td></tr>
  </table></td></tr></table></body></html>`;
}

function itemRow(it) {
  return `<tr><td style="padding:14px 0;border-bottom:1px solid ${C.border};">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="104" valign="top">
        <img src="cid:${it.cid}" width="96" height="96" alt="${it.name}" style="border-radius:14px;object-fit:cover;border:1px solid ${C.border};display:block;background:${C.cream};"/>
      </td>
      <td style="padding-left:14px;" valign="middle">
        <p style="margin:0;font-weight:700;font-size:16px;">${it.name}</p>
        <p style="margin:6px 0 0;font-size:13px;color:${C.muted};">Kiekis: ${it.qty}</p>
      </td>
      <td style="text-align:right;font-weight:800;color:${C.accent};font-size:16px;" valign="middle">${it.price}</td>
    </tr></table>
  </td></tr>`;
}

const itemsBlock = `<p style="margin:18px 0 8px;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Tavo pliušiai</p>
<table width="100%">${items.map(itemRow).join("")}</table>`;

const addrBlock = `<p style="margin:16px 0 4px;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:.08em;">Pristatymo adresas</p>
<p style="margin:0;line-height:1.45;">Testas Testauskas<br/>Gedimino pr. 1<br/>01103 Vilnius<br/>Lietuva</p>`;

async function send(subject, title, body) {
  return resend.emails.send({
    from,
    to,
    subject,
    attachments,
    html: shell(title, body),
    text: subject + "\n\nŽiūrėk HTML versiją.",
  });
}

const confirmation = await send(
  "Užsakymas gautas — Plušis (TESTAS)",
  "Užsakymas gautas",
  `<p style="font-size:16px;margin:0 0 10px;">Labas, Testas!</p>
   <p style="margin:0 0 16px;color:${C.muted};">Ačiū — tavo <strong style="color:${C.text};">Plušis</strong> užsakymas gautas.</p>
   <p style="margin:0;font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:.08em;">Užsakymo nr.</p>
   <p style="margin:4px 0 0;font-weight:700;">test_cs_plusis_demo</p>
   ${itemsBlock}
   <table width="100%" style="margin-top:8px;"><tr>
     <td style="font-weight:700;font-size:16px;">Iš viso</td>
     <td style="text-align:right;font-weight:800;font-size:18px;color:${C.accent};">77,98 €</td>
   </tr></table>
   <div style="background:${C.cream};border:1px solid ${C.border};border-radius:14px;padding:16px 18px;margin-top:18px;">
     <p style="margin:0;font-size:12px;color:${C.muted};">Numatomas pristatymas</p>
     <p style="margin:6px 0 0;font-weight:700;">2–3 darbo dienos nuo užsakymo</p>
   </div>
   ${addrBlock}`,
);

const shipped = await send(
  "Tavo Plušis išsiųstas (TESTAS)",
  "Tavo Plušis išsiųstas",
  `<p style="font-size:16px;margin:0 0 10px;">Labas, Testas!</p>
   <p style="margin:0 0 16px;">Geros žinios — <strong>tavo Plušis išsiųstas</strong>.</p>
   <p style="margin:0;font-size:12px;color:${C.muted};">Užsakymo nr.</p>
   <p style="margin:4px 0 0;font-weight:700;">test_cs_plusis_demo</p>
   ${itemsBlock}
   ${addrBlock}
   <div style="background:${C.cream};border:1px solid ${C.border};border-radius:14px;padding:16px 18px;margin-top:16px;">
     <p style="margin:0;font-size:12px;color:${C.muted};">Vežėjas</p>
     <p style="margin:4px 0 12px;font-weight:700;font-size:16px;">Omniva</p>
     <p style="margin:0;font-size:12px;color:${C.muted};">Sekimo numeris</p>
     <p style="margin:4px 0 12px;font-weight:700;">JJD0000999999999999999</p>
     <a href="https://omniva.lt/privatus/siuntu_sekimas" style="display:inline-block;padding:11px 18px;border-radius:999px;background:${C.accent};color:#fff;font-weight:700;text-decoration:none;">Sekti siuntą</a>
   </div>`,
);

function summarize(res) {
  return {
    id: res?.data?.id ?? null,
    error: res?.error ? res.error.message || JSON.stringify(res.error) : null,
  };
}

console.log(
  JSON.stringify({
    from,
    to,
    confirmation: summarize(confirmation),
    shipped: summarize(shipped),
  }),
);
