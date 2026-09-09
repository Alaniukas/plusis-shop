import Link from "next/link";
import { BUNDLES } from "@/lib/bundles";

export function BundlePromo() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Kartu — švelnesnė kaina
        </h2>
        <p className="mt-2 text-center text-muted">
          Daugiau pliušių — mažesnė kaina. Nuolaida pritaikoma automatiškai krepšelyje.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className="flex flex-col rounded-2xl border border-border bg-warm-white p-6"
            >
              <span className="w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                {bundle.discountLabel}
              </span>
              <h3 className="mt-4 font-display text-xl tracking-tight">{bundle.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{bundle.subtitle}</p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                Pasirinkite {bundle.minItems}
                {bundle.minItems >= 3 ? "+" : ""} vnt. · −{bundle.discountPercent}%
              </p>
              <Link
                href={`/produktai?rinktis=${bundle.minItems}#katalogas`}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
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
