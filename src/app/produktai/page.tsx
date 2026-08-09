import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductGrid } from "@/components/product-grid";
import { BundlePromo } from "@/components/bundle-promo";
import { CustomSizeBanner } from "@/components/custom-size-banner";
import { WhyBuy } from "@/components/why-buy";
import { FadeIn } from "@/components/fade-in";
import { getActiveProducts, getSoldOutProducts } from "@/lib/catalog";
import { formatEur } from "@/lib/utils";
import { UNIT_PRICE } from "@/lib/pricing";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Katalogas — svoriniai pliušiniai",
  description: `Bambukas, Mira, Ugnelis — svoriniai ilgorankiai pliušiniai nuo ${UNIT_PRICE.toFixed(2).replace(".", ",")} €. ${COMPANY.brand}, Lietuva.`,
  alternates: { canonical: "/produktai" },
  openGraph: {
    title: `Katalogas | ${COMPANY.brand}`,
    description: "Švelnus svoris, kuris nuramina. Trys draugai sandėlyje.",
    images: ["/products/photos/product-panda-1.jpg"],
  },
};

export default function ProductsPage() {
  const list = getActiveProducts();
  const soldOut = getSoldOutProducts();

  return (
    <>
      <SiteHeader />
      <main>
        <div className="bg-warm-white px-4 py-12 text-center md:py-14">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {COMPANY.brand}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Katalogas
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted md:text-lg">
              Švelnus svoris, kuris nuramina. Nuo {formatEur(UNIT_PRICE)}.
            </p>
          </FadeIn>
        </div>
        <FadeIn>
          <WhyBuy />
        </FadeIn>
        <FadeIn>
          <BundlePromo />
        </FadeIn>
        <div className="mx-auto max-w-6xl px-4 pb-8">
          <FadeIn>
            <CustomSizeBanner />
          </FadeIn>
        </div>
        <section id="katalogas" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-10">
          <FadeIn>
            <ProductGrid products={list} columns={3} />
          </FadeIn>
        </section>
        {soldOut.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-16 text-center">
            <FadeIn>
              <h2 className="font-display text-xl tracking-tight md:text-2xl">Išparduota</h2>
              <p className="mt-2 text-sm text-muted">
                Palikite el. paštą — parašysime, kai vėl turėsime.
              </p>
              <div className="mt-8">
                <ProductGrid products={soldOut} columns={3} />
              </div>
            </FadeIn>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
