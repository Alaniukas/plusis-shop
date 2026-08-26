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
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-16">
        <FadeIn>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Klausimai</h1>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-border bg-warm-white p-4 card-shadow sm:p-5"
              >
                <summary className="cursor-pointer py-1 pr-6 font-extrabold leading-snug">{f.q}</summary>
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
