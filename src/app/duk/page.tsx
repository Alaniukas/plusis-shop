import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FadeIn } from "@/components/fade-in";
import { COMPANY } from "@/lib/company";
import { formatEur } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, UNIT_PRICE } from "@/lib/pricing";

const faqs = [
  {
    q: "Kas yra svorinis pliušinis?",
    a: "Minkštas pliušinis žaislas su švelniu svoriu (~1 kg) ir ilgomis rankomis. Jis sukuria jausmą, tarsi kas nors tave apkabintų — padeda nurimti po ilgos dienos.",
  },
  {
    q: "Kam tinka?",
    a: "Vaikams nuo 3 m. ir suaugusiems. Vakaro poilsiui, miegui, skaitymui ar momentui, kai reikia jaukumo. Tai ne medicinos priemonė — komforto produktas.",
  },
  {
    q: "Kaip veikia nuolaidos?",
    a: "Du plušiai — −10%. Trys ar daugiau — −15%. Nuolaida pritaikoma automatiškai krepšelyje.",
  },
  {
    q: "Kiek kainuoja pristatymas?",
    a: `Pristatome Lietuvoje per 2–5 darbo dienas. Nemokamai nuo ${formatEur(FREE_SHIPPING_THRESHOLD)}. Mažesnėms sumoms — ${formatEur(SHIPPING_COST)}.`,
  },
  {
    q: "Kaip galima atsiskaityti?",
    a: "Kortele, Apple Pay, Google Pay ir Revolut Pay (kai matomi Stripe Checkout lange). Mokėjimas saugus per Stripe.",
  },
  {
    q: "Ar galima užsakyti kitokį dydį ar svorį?",
    a: `Taip — parašykite ${COMPANY.email}, sutarime asmeniškai.`,
  },
  {
    q: "Kokia kaina?",
    a: `Standartinė kaina ${formatEur(UNIT_PRICE)} už vieną. Bundle nuolaidos — krepšelyje.`,
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 pb-28 md:py-16 md:pb-16">
        <FadeIn>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Klausimai</h1>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-border bg-warm-white p-4 card-shadow sm:p-5"
              >
                <summary className="cursor-pointer list-none py-1 pr-6 font-extrabold leading-snug [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </FadeIn>
      </main>
      <SiteFooter />
    </>
  );
}