import Link from "next/link";
import Image from "next/image";
import { getActiveProducts, getSoldOutProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BundlePromo } from "@/components/bundle-promo";
import { CustomSizeBanner } from "@/components/custom-size-banner";
import { TrustStrip } from "@/components/trust-strip";
import { WhyBuy } from "@/components/why-buy";
import { ReviewsSection } from "@/components/reviews-section";
import { FadeIn } from "@/components/fade-in";
import { COMPANY } from "@/lib/company";
import { formatEur } from "@/lib/utils";
import { UNIT_PRICE } from "@/lib/pricing";

export default function HomePage() {
  const featured = getActiveProducts();
  const soldOut = getSoldOutProducts();

  return (
    <>
      <main>
        <section className="relative min-h-[88vh] w-full overflow-hidden md:min-h-[92vh]">
          <Image
            src="/products/photos/hero-collection.jpg"
            alt="Plušis — visa šeimynėlė"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-900/45 via-stone-900/20 to-stone-900/60" />

          <SiteHeader transparent />

          <div className="absolute inset-0 z-10 flex items-start justify-center pointer-events-none md:items-center">
            <div className="mx-auto w-full max-w-3xl px-4 pt-28 text-center pointer-events-auto md:pt-8">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/90 drop-shadow">
                {COMPANY.brand}
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white drop-shadow-md md:text-6xl md:leading-tight">
                Kai reikia būti apkabintam
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/90 drop-shadow md:text-lg">
                Švelnus svoris, kuris nuramina — komfortas, kai diena buvo per sunki. Nuo{" "}
                {formatEur(UNIT_PRICE)}.
              </p>
              <a
                href="#katalogas"
                className="mt-9 inline-flex rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-accent-hover"
              >
                Žiūrėti katalogą
              </a>
            </div>
          </div>
        </section>

        <FadeIn>
          <TrustStrip />
        </FadeIn>

        <FadeIn>
          <WhyBuy />
        </FadeIn>

        <section id="katalogas" className="scroll-mt-24 bg-cream-dark px-4 py-16 md:py-20">
          <FadeIn>
            <div className="mx-auto max-w-6xl">
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">Katalogas</h2>
              <p className="mt-2 text-muted">Bambukas, Mira, Ugnelis — viena kaina.</p>
              <div className="mt-10">
                <ProductGrid products={featured} columns={3} />
              </div>

              {soldOut.length > 0 && (
                <div className="mt-16 text-center">
                  <h3 className="font-display text-xl tracking-tight md:text-2xl">Išparduota</h3>
                  <p className="mt-2 text-sm text-muted">
                    Palikite el. paštą — parašysime, kai vėl turėsime.
                  </p>
                  <div className="mt-8">
                    <ProductGrid products={soldOut} columns={3} />
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </section>

        <FadeIn>
          <ReviewsSection />
        </FadeIn>

        <FadeIn>
          <BundlePromo />
        </FadeIn>

        <FadeIn>
          <section className="mx-auto max-w-6xl px-4 py-8 pb-16">
            <CustomSizeBanner />
          </section>
        </FadeIn>
      </main>
      <SiteFooter />
    </>
  );
}
