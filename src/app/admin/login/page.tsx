"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Nepavyko prisijungti");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tinklo klaida");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-warm-white p-6 shadow-sm"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Plušis
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Admin prisijungimas
        </h1>
        <label className="mt-6 block text-sm font-medium text-muted" htmlFor="pw">
          Slaptažodis
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus:border-accent"
          required
        />
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? "Jungiamasi…" : "Prisijungti"}
        </button>
      </form>
    </div>
  );
}
