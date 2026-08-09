import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatEur } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { WaitlistButton } from "./waitlist-button";

export function ProductCard({ product }: { product: Product }) {
  const href = `/produktai/${product.slug}`;
  const soldOut =
    product.status === "sold_out" || product.status === "coming_soon" || product.stockCount <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-warm-white card-shadow transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream">
          <Image
            src={product.images[0]}
            alt={`${product.name} — ${product.animalLabel}`}
            width={600}
            height={600}
            className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
          />
          {soldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-stone-900/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Išparduota
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          {product.animalLabel}
        </p>
        <Link href={href}>
          <h3 className="mt-1 font-display text-xl tracking-tight transition group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted">{product.persona}</p>
        <p className="mt-4 text-base font-semibold tabular-nums">{formatEur(product.priceEur)}</p>
        <div className="mt-4 w-full">
          {soldOut ? (
            <WaitlistButton product={product} size="sm" fullWidth />
          ) : (
            <AddToCartButton product={product} size="sm" fullWidth />
          )}
        </div>
      </div>
    </article>
  );
}
