"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/produktai", label: "Katalogas" },
  { href: "/duk", label: "Klausimai" },
  { href: "/apie", label: "Apie" },
  { href: "/krepselis", label: "Krepšelis" },
];

export function MobileNav({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu = open && (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[200] bg-warm-white pt-[env(safe-area-inset-top)]"
      role="dialog"
      aria-modal="true"
      aria-label="Meniu"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-display text-xl text-foreground">Meniu</p>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-cream-dark"
          aria-label="Uždaryti meniu"
          onClick={() => setOpen(false)}
        >
          <X className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </div>
      <nav className="flex flex-col px-4 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="border-b border-border py-4 text-lg font-semibold text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        className={cn(
          "relative z-[201] inline-flex h-11 w-11 items-center justify-center rounded-full transition",
          light ? "text-white hover:bg-white/15" : "text-foreground hover:bg-cream-dark",
        )}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Uždaryti meniu" : "Atidaryti meniu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" strokeWidth={1.75} /> : <Menu className="h-6 w-6" strokeWidth={1.75} />}
      </button>
      {mounted ? createPortal(menu, document.body) : null}
    </div>
  );
}
