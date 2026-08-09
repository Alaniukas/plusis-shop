import { LegalLayout } from "@/components/legal-layout";
import { COMPANY } from "@/lib/company";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privatumo politika">
      <p>Ši privatumo politika aprašo, kaip {COMPANY.name} ({COMPANY.brand} el. parduotuvė) tvarko jūsų asmens duomenis.</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Duomenų valdytojas</h2>
      <p>
        {COMPANY.name}. El. paštas: {COMPANY.email}.
      </p>
      <h2 className="text-xl font-bold text-foreground mt-6">Kokius duomenis renkame</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Užsakymo metu: vardas, el. paštas, telefono numeris, pristatymo adresas.</li>
        <li>Mokėjimo duomenys tvarkomi Stripe — mes nesaugome pilnų kortelės duomenų.</li>
        <li>Priminti man forma: el. paštas ir pasirinktas produktas.</li>
        <li>Techniniai duomenys: IP adresas, naršyklės tipas (analitika, saugumas).</li>
      </ul>
      <h2 className="text-xl font-bold text-foreground mt-6">Duomenų naudojimo tikslai</h2>
      <p>Užsakymų vykdymas, pristatymas, klientų aptarnavimas, teisinių reikalavimų laikymasis, svetainės saugumas ir tobulinimas.</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Duomenų saugojimas</h2>
      <p>Duomenys saugomi tiek, kiek reikia užsakymų vykdymui ir teisės aktų reikalavimams (paprastai iki 10 metų finansinių dokumentų atveju).</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Jūsų teisės</h2>
      <p>Turite teisę susipažinti su duomenimis, reikalauti ištaisymo, ištrynimo, apriboti tvarkymą, nesutikti. Kreipkitės: {COMPANY.email}.</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Slapukai</h2>
      <p>
        Naudojame būtinus slapukus (krepšelis <code>plusis-cart</code>, sesija, sutikimo pasirinkimas{" "}
        <code>plusis-cookie-consent</code>).
      </p>
      <p className="mt-2">
        Analitiniai slapukai (Microsoft Clarity heatmap / elgsenos analizė, Google Analytics — jei
        įjungta) įkeliami tik gavus jūsų sutikimą per slapukų juostą. Be sutikimo jie neveikia.
      </p>
      <p className="mt-2">Sutikimą galite pakeisti ištrynę svetainės duomenis naršyklėje ir perkrovę puslapį.</p>
      <p className="text-sm text-muted mt-8">Atnaujinta: 2026 m.</p>
    </LegalLayout>
  );
}