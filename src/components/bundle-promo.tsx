import Link from "next/link";
import { BUNDLES } from "@/lib/bundles";
import { cn } from "@/lib/utils";

export function BundlePromo() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Kartu — švelniau kainai
        </h2>
        <p className="mt-2 text-center text-muted">
          Daugiau pliušių — mažesnė kaina. Nuolaida pati krepšelyje.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BUNDLES.map((bundle, i) => (
            <div
              key={bundle.id}
              className="flex flex-col rounded-2xl border border-border bg-warm-white p-6"
            >
              <span className="w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                {bundle.discountLabel}
              </span>
              <h3 className="mt-4 font-display text-xl tracking-tight">{bundle.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{bundle.subtitle}</p>
              <Link
                href="/#katalogas"
                className={cn(
                  "mt-6 inline-flex justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  i === 0
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "border border-border hover:bg-cream",
                )}
              >
                Rinktis
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
