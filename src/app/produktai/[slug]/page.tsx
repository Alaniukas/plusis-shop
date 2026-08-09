import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/lib/catalog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WaitlistButton } from "@/components/waitlist-button";
import { BundleNote } from "@/components/bundle-note";
import { ProductGallery } from "@/components/product-gallery";
import { CustomSizeBanner } from "@/components/custom-size-banner";
import { FadeIn } from "@/components/fade-in";
import { formatEur } from "@/lib/utils";
import { UNIT_PRICE } from "@/lib/pricing";
import { COMPANY } from "@/lib/company";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.name} — svorinis ${product.animalLabel.toLowerCase()}`;
  const description = product.description;
  const image = product.images[0];
  return {
    title,
    description,
    keywords: [
      product.name,
      product.animalLabel,
      "svorinis pliušinis",
      "ilgorankis",
      "pliušinis žaislas",
      "Lietuva",
      COMPANY.brand,
    ],
    openGraph: {
      title: `${product.name} | ${COMPANY.brand}`,
      description,
      images: [{ url: image }],
      locale: "lt_LT",
      type: "website",
    },
    alternates: { canonical: `/produktai/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const soldOut =
    product.status === "sold_out" || product.status === "coming_soon" || product.stockCount <= 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.animalLabel}`,
    description: product.story,
    image: product.images,
    brand: { "@type": "Brand", name: COMPANY.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: UNIT_PRICE,
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://plusis.lt"}/produktai/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} name={product.name} soldOut={soldOut} />

            <div className="flex flex-col justify-center space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {product.animalLabel}
                </p>
                <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted">{product.description}</p>
              </div>

              <p className="text-3xl font-semibold tracking-tight">{formatEur(UNIT_PRICE)}</p>

              {!soldOut && <BundleNote />}

              {soldOut ? (
                <div className="max-w-md space-y-3">
                  <p className="text-sm text-muted">
                    Šiuo metu nėra sandėlyje. Palikite el. paštą — parašysime, kai grįš.
                  </p>
                  <WaitlistButton product={product} size="md" fullWidth />
                </div>
              ) : (
                <div className="max-w-sm">
                  <AddToCartButton product={product} />
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h2 className="font-display text-lg tracking-tight">Jo istorija</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{product.story}</p>
              </div>

              <ul className="space-y-2 text-sm text-muted">
                <li>Ilgis apie {product.lengthCm} cm</li>
                <li>Svoris paskirstytas rankose ir kūne — jaučiasi kaip apkabinimas</li>
                <li>Priežiūra: skalbkite rankomis</li>
              </ul>

              <CustomSizeBanner compact />
            </div>
          </div>
        </FadeIn>
      </main>
      <SiteFooter />
    </>
  );
}
