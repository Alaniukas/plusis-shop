import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  columns = 3,
}: {
  products: Product[];
  columns?: 3 | 4 | 2;
}) {
  const single = products.length === 1;

  return (
    <div
      className={cn(
        "grid gap-5",
        single
          ? "mx-auto max-w-sm justify-items-center"
          : cn("sm:grid-cols-2", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"),
      )}
    >
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
