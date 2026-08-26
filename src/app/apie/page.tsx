import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CustomSizeBanner } from "@/components/custom-size-banner";
import { FadeIn } from "@/components/fade-in";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: `Apie mus`,
  description: `Kodėl atsirado ${COMPANY.brand} — svoriniai pliušiniai tiems vakarams, kai reikia būti apkabintam.`,
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-20">
        <FadeIn>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {COMPANY.brand}
          </p>
          <h1 className="mt-3 font-display text-[1.75rem] leading-tight tracking-tight sm:text-3xl md:text-4xl">
            Kai norisi ne žodžių — o apkabinimo
          </h1>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-[17px]">
            <p>
              Kartais diena būna per ilga. Mintys nesustoja, o kūnas prašo tik vieno —
              būti šalia ko nors šilto, tylaus, sunkesnio. Be klausimų. Be skubos.
            </p>
            <p>
              Taip gimė {COMPANY.brand}: svoriniai pliušiniai su ilgomis rankomis, kurie
              apgaubia ir nuramina. Bambukas, Mira, Ugnelis — kiekvienas su savo charakteriu,
              bet visi apie tą patį jausmą: esi saugus.
            </p>
            <p>
              Mes netikime, kad ramybė turi būti sudėtinga. Kartais užtenka uždėti pliušį
              ant krūtinės, iškvėpti — ir leisti sau nieko nedaryti. Kaip koala. Kaip
              tinginys. Kaip žmogus, kuris pagaliau grįžo namo.
            </p>
            <p>
              {COMPANY.brand} — mažas lietuviškas prekės ženklas tiems vakarams, kai
              reikia būti apkabintam.
            </p>
          </div>

          <div className="mt-10">
            <CustomSizeBanner />
          </div>

          <p className="mt-12 text-sm text-muted">
            {COMPANY.name}
            <span className="mx-2 text-border">·</span>
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-accent underline-offset-2 hover:underline"
            >
              {COMPANY.email}
            </a>
          </p>
        </FadeIn>
      </main>
      <SiteFooter />
    </>
  );
}
