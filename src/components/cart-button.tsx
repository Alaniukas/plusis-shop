"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function CartButton({ light = false }: { light?: boolean }) {
  const count = useCartStore((s) => s.totalItems());
  return (
    <Link
      href="/krepselis"
      className={
        light
          ? "relative rounded-full p-2 text-white transition hover:bg-white/15"
          : "relative rounded-full p-2 text-muted transition hover:bg-cream-dark hover:text-foreground"
      }
      aria-label="Krepšelis"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-warm-white">
          {count}
        </span>
      )}
    </Link>
  );
}
