import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { loadProductsFromDb } from "@/lib/catalog";
import { ShipButton } from "./ship-button";
import { TestEmailButton } from "./test-email-button";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function formatEur(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function formatLt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("lt-LT", {
    timeZone: "Europe/Vilnius",
    dateStyle: "short",
    timeStyle: "short",
  });
}

type ViewRow = {
  path: string | null;
  referrer: string | null;
  utm_source: string | null;
  created_at: string;
};

type OrderRow = {
  id: string;
  email: string | null;
  customer_name: string | null;
  phone: string | null;
  total_eur: number | string | null;
  items_json: unknown;
  status: string | null;
  shipping_address: Record<string, string | null> | null;
  shipped_at: string | null;
  created_at: string;
  stripe_session_id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  tracking_url: string | null;
};

function countBy(rows: ViewRow[], key: (r: ViewRow) => string | null | undefined, limit = 8) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = (key(r) || "(tuščia)").slice(0, 120);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function itemsLabel(items: unknown): string {
  try {
    const arr = typeof items === "string" ? JSON.parse(items) : items;
    if (!Array.isArray(arr)) return "—";
    return arr
      .map((i: { name?: string; quantity?: number }) => `${i.name ?? "?"} × ${i.quantity ?? 1}`)
      .join(", ");
  } catch {
    return "—";
  }
}

function addrLabel(addr: OrderRow["shipping_address"]) {
  if (!addr) return "—";
  return [addr.name, addr.line1, [addr.postal_code, addr.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

export default async function AdminDashboardPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  const supabase = getSupabaseAdmin();
  const products = await loadProductsFromDb();

  let views7: ViewRow[] = [];
  let views30: ViewRow[] = [];
  let orders: OrderRow[] = [];

  if (supabase) {
    const [v7, v30, ord] = await Promise.all([
      supabase
        .from("page_views")
        .select("path, referrer, utm_source, created_at")
        .gte("created_at", daysAgoIso(7)),
      supabase
        .from("page_views")
        .select("path, referrer, utm_source, created_at")
        .gte("created_at", daysAgoIso(30)),
      supabase
        .from("orders")
        .select(
          "id, email, customer_name, phone, total_eur, items_json, status, shipping_address, shipped_at, created_at, stripe_session_id, tracking_number, carrier, tracking_url",
        )
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    views7 = (v7.data as ViewRow[]) ?? [];
    views30 = (v30.data as ViewRow[]) ?? [];
    orders = (ord.data as OrderRow[]) ?? [];
  }

  const paid = orders.filter((o) => o.status === "paid" || o.status === "shipped");
  const shipped = orders.filter((o) => o.shipped_at || o.status === "shipped");
  const revenue = paid.reduce((s, o) => s + Number(o.total_eur ?? 0), 0);

  const topPaths = countBy(views30, (r) => r.path);
  const topRefs = countBy(views30, (r) => {
    if (!r.referrer) return "(tiesiogiai)";
    try {
      return new URL(r.referrer).hostname;
    } catch {
      return r.referrer.slice(0, 80);
    }
  });
  const topUtm = countBy(views30, (r) => r.utm_source);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Plušis / Admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            Skydelis
          </h1>
        </div>
        <LogoutButton />
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Peržiūros (7 d.)", value: String(views7.length) },
          { label: "Peržiūros (30 d.)", value: String(views30.length) },
          { label: "Užsakymai (apmokėti)", value: String(paid.length) },
          { label: "Pajamos", value: formatEur(revenue) },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-warm-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-muted">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{c.value}</p>
          </div>
        ))}
      </section>

      <p className="mt-3 text-sm text-muted">
        Išsiųsta: <strong>{shipped.length}</strong>
        {!supabase ? " · Supabase neprijungtas" : null}
      </p>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <StatList title="Top keliai (30 d.)" rows={topPaths} />
        <StatList title="Top referrer (30 d.)" rows={topRefs} />
        <StatList title="utm_source (30 d.)" rows={topUtm} />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl tracking-tight">Užsakymai</h2>
          <TestEmailButton />
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border bg-warm-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-cream text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Data</th>
                <th className="px-3 py-2.5 font-semibold">El. paštas</th>
                <th className="px-3 py-2.5 font-semibold">Prekės</th>
                <th className="px-3 py-2.5 font-semibold">Suma</th>
                <th className="px-3 py-2.5 font-semibold">Statusas</th>
                <th className="px-3 py-2.5 font-semibold">Pristatymas</th>
                <th className="px-3 py-2.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted">
                    Užsakymų dar nėra
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/70 align-top">
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">
                      {formatLt(o.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{o.email ?? "—"}</div>
                      <div className="text-xs text-muted">
                        {o.customer_name ?? ""}
                        {o.phone ? ` · ${o.phone}` : ""}
                      </div>
                    </td>
                    <td className="max-w-[220px] px-3 py-3 text-xs">{itemsLabel(o.items_json)}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold">
                      {formatEur(Number(o.total_eur ?? 0))}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">
                        {o.shipped_at ? "shipped" : o.status ?? "—"}
                      </span>
                      {o.shipped_at ? (
                        <div className="mt-1 text-muted">{formatLt(o.shipped_at)}</div>
                      ) : null}
                      {o.carrier || o.tracking_number ? (
                        <div className="mt-1 text-muted">
                          {[o.carrier, o.tracking_number].filter(Boolean).join(" · ")}
                        </div>
                      ) : null}
                    </td>
                    <td className="max-w-[180px] px-3 py-3 text-xs text-muted">
                      {addrLabel(o.shipping_address)}
                    </td>
                    <td className="px-3 py-3">
                      {!o.shipped_at ? <ShipButton orderId={o.id} /> : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl tracking-tight">Produktai</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-border bg-warm-white p-4 shadow-sm"
            >
              <p className="text-xs text-muted">{p.id}</p>
              <p className="mt-1 font-semibold">{p.name}</p>
              <p className="text-sm text-muted">{p.animalLabel}</p>
              <p className="mt-3 text-sm">
                Likutis: <strong>{p.stockCount}</strong>
              </p>
              <p className="mt-1 text-xs">
                Statusas:{" "}
                <span className="rounded-full bg-cream px-2 py-0.5 font-semibold">{p.status}</span>
              </p>
              <p className="mt-2 text-sm font-semibold text-accent">{formatEur(p.priceEur)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatList({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div className="rounded-2xl border border-border bg-warm-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 ? (
          <li className="text-sm text-muted">Nėra duomenų</li>
        ) : (
          rows.map(([k, n]) => (
            <li key={k} className="flex justify-between gap-3 text-sm">
              <span className="truncate text-muted" title={k}>
                {k}
              </span>
              <span className="shrink-0 font-semibold">{n}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
