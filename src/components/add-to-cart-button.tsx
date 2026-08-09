"use client";
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
  return (
    <button
      type="button"
      onClick={() =>
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceEur: product.priceEur,
          image: product.images[0],
        })
      }
      className={cn(
        "rounded-full bg-accent font-semibold text-warm-white transition hover:bg-accent-hover",
        size === "sm" ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-base",
        fullWidth && "w-full",
      )}
    >
      Į krepšelį
    </button>
  );
}
