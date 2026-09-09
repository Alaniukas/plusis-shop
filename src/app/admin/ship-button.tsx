"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CARRIERS = ["Omniva", "LP Express", "DPD", "Venipak", "Other"] as const;

export function ShipButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState<string>("Omniva");
  const [trackingUrl, setTrackingUrl] = useState("");

  async function markShipped(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setMsg("Įveskite sekimo numerį");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          carrier,
          trackingUrl: trackingUrl.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMsg(data.error ?? "Klaida");
        return;
      }
      setMsg("Išsiųsta");
      setOpen(false);
      router.refresh();
    } catch {
      setMsg("Tinklo klaida");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover"
        >
          Išsiųsta — siųsti laišką
        </button>
        {msg ? <span className="text-[11px] text-muted">{msg}</span> : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={markShipped}
      className="w-[220px] space-y-2 rounded-xl border border-border bg-cream p-2.5 text-left shadow-sm"
    >
      <label className="block text-[11px] font-semibold text-muted">
        Vežėjas
        <select
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-warm-white px-2 py-1.5 text-xs"
        >
          {CARRIERS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[11px] font-semibold text-muted">
        Sekimo nr.
        <input
          required
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-warm-white px-2 py-1.5 text-xs"
          placeholder="PVZ123..."
        />
      </label>
      <label className="block text-[11px] font-semibold text-muted">
        Sekimo URL (nebūtina)
        <input
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-warm-white px-2 py-1.5 text-xs"
          placeholder="https://..."
        />
      </label>
      <div className="flex gap-1.5 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-accent px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? "…" : "Siųsti"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-border px-2 py-1.5 text-[11px] font-semibold"
        >
          Atšaukti
        </button>
      </div>
      {msg ? <p className="text-[11px] text-muted">{msg}</p> : null}
    </form>
  );
}
