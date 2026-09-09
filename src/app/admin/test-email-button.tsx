"use client";

import { useState } from "react";

export function TestEmailButton() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Nepavyko");
        return;
      }
      const conf = data.result?.confirmation?.id ?? "?";
      const ship = data.result?.shipped?.id ?? "?";
      setMsg(`OK — confirmation: ${conf}, shipped: ${ship}`);
    } catch {
      setMsg("Tinklo klaida");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={send}
        disabled={loading}
        className="rounded-full border border-border bg-warm-white px-4 py-2 text-sm font-semibold hover:bg-cream disabled:opacity-60"
      >
        {loading ? "Siunčiama…" : "Siųsti testinius laiškus"}
      </button>
      {msg ? <span className="text-xs text-muted">{msg}</span> : null}
    </div>
  );
}
