"use client";

import { useState, type FormEvent } from "react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function WaitlistButton({
  product,
  size = "sm",
  fullWidth,
}: {
  product: Product;
  size?: "sm" | "md";
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), productId: product.id }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className="rounded-full bg-cream px-4 py-2.5 text-center text-sm font-semibold text-foreground">
        Ačiū — parašysime, kai vėl bus
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "min-h-11 rounded-full border border-foreground/20 bg-warm-white font-semibold text-foreground transition hover:border-accent hover:text-accent",
          size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-base",
          fullWidth && "w-full",
        )}
      >
        Pranešti el. paštu
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jusu@email.lt"
        className="min-h-11 w-full rounded-full border border-border bg-warm-white px-4 py-2.5 text-base outline-none ring-accent focus:ring-2 sm:text-sm"
        autoFocus
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "min-h-11 rounded-full bg-accent font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60",
          size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-base",
        )}
      >
        {status === "loading" ? "Siunčiama…" : "Laukti eilėje"}
      </button>
      {status === "error" && (
        <p className="text-center text-xs text-red-600">Nepavyko — bandykite dar kartą</p>
      )}
    </form>
  );
}
