"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cartCount, useCartStore } from "@/lib/cart-store";

function BundleGoalInner() {
  const params = useSearchParams();
  const raw = Number(params.get("rinktis"));
  const target = raw >= 3 ? 3 : raw === 2 ? 2 : 0;
  const count = useCartStore((s) => cartCount(s.items));

  if (!target) return null;

  const percent = target >= 3 ? 15 : 10;
  const remaining = Math.max(0, target - count);
  const done = remaining === 0;

  return (
    <div className="mb-8 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-4 text-center sm:px-6">
      <p className="font-display text-lg tracking-tight text-foreground">
        {done
          ? `Nuolaida −${percent}% jau krepšelyje`
          : `Rinkitės ${target} vnt. — gausite −${percent}%`}
      </p>
      <p className="mt-1 text-sm text-muted">
        Krepšelyje {count} iš {target}
        {!done && ` · liko ${remaining}`}
      </p>
      {done && (
        <Link
          href="/krepselis"
          className="mt-3 inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Peržiūrėti krepšelį
        </Link>
      )}
    </div>
  );
}

export function BundleGoal() {
  return (
    <Suspense fallback={null}>
      <BundleGoalInner />
    </Suspense>
  );
}
