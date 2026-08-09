import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FadeIn } from "@/components/fade-in";

const faqs = [
  {
    q: "Kas yra svorinis pliušinis?",
    a: "Minkštas pliušinis su švelniu svoriu. Jis sukuria jausmą, tarsi kas nors tave apkabintų — padeda nurimti po ilgos dienos ir sumažinti nerimą.",
  },
  {
    q: "Kam tinka?",
    a: "Vaikams ir suaugusiems. Vakaro poilsiui, miegui, skaitymui ar tiesiog momentui, kai reikia jaukumo.",
  },
  {
    q: "Kaip veikia nuolaidos?",
    a: "Du plušiai — −15%. Trys ar daugiau — −20%. Nuolaida pritaikoma automatiškai krepšelyje.",
  },
  {
    q: "Ar galima užsakyti kitokį dydį ar svorį?",
    a: "Taip — parašykite mums el. paštu, sutarime asmeniškai.",
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <FadeIn>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Klausimai</h1>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-border bg-warm-white p-5 card-shadow"
              >
                <summary className="cursor-pointer font-extrabold">{f.q}</summary>
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
