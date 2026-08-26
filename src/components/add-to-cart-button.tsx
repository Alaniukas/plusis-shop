"use client";
import { useState, type MouseEvent } from "react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  size = "md",
  fullWidth,
}: {
  product: Product;
  size?: "sm" | "md";
  fullWidth?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceEur: product.priceEur,
      image: product.images[0],
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative z-10 min-h-11 rounded-full font-semibold transition",
        added
          ? "bg-stone-800 text-white"
          : "bg-accent text-warm-white hover:bg-accent-hover",
        size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-base",
        fullWidth && "w-full",
      )}
    >
      {added ? "Pridėta" : "Į krepšelį"}
    </button>
  );
}
