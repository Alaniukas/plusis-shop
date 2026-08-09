import { LegalLayout } from "@/components/legal-layout";
import { COMPANY } from "@/lib/company";
import { UNIT_PRICE } from "@/lib/pricing";
import { formatEur } from "@/lib/utils";

export default function TermsPage() {
  return (
    <LegalLayout title="Pirkimo taisyklės">
      <p>Šios taisyklės reglamentuoja prekių pirkimą {COMPANY.brand} el. parduotuvėje, kurią valdo {COMPANY.name}.</p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Pardavėjas</h2>
      <p>
        {COMPANY.name}. El. paštas: {COMPANY.email}.
      </p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Prekės ir kainos</h2>
      <p>
        Svoriniai pliušiniai žaislai. Standartinė kaina: {formatEur(UNIT_PRICE)}. Kainos nurodytos eurais su PVM.
        Perkant du — −15%, tris ar daugiau — −20% (automatiškai krepšelyje).
      </p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Užsakymo pateikimas</h2>
      <p>Pasirinkite prekes, užpildykite duomenis, apmokėkite. Užsakymas patvirtinamas el. paštu. Sutartis laikoma sudaryta nuo mokėjimo patvirtinimo.</p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Mokėjimas</h2>
      <p>Mokėjimai kortele per Stripe. Saugus SSL ryšys.</p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Pristatymas</h2>
      <p>Pristatome Lietuvoje. Terminas: 2–5 darbo dienos. Nemokamas pristatymas nuo 50 €. Kita suma — 3,99 €.</p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Individualūs užsakymai</h2>
      <p>Kitokio svorio ar dydžio plušiai — tik asmeniniu susitarimu el. paštu {COMPANY.email}.</p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Ginčai</h2>
      <p>Ginčai sprendžiami bendru sutarimu. Nepavykus — Valstybinė vartotojų teisių apsaugos tarnyba ar teismas pagal LR įstatymus.</p>
      <p className="mt-8 text-sm text-muted">Atnaujinta: 2026 m.</p>
    </LegalLayout>
  );
}
