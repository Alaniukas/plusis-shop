import { LegalLayout } from "@/components/legal-layout";
import { COMPANY } from "@/lib/company";

export default function ReturnsPage() {
  return (
    <LegalLayout title="Grąžinimo politika">
      <p>{COMPANY.brand} prekes galite grąžinti pagal Lietuvos Respublikos vartotojų teisių apsaugos įstatymą.</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Grąžinimo terminas</h2>
      <p>Per <strong>14 kalendorinių dienų</strong> nuo prekės gavimo dienos, jei prekė nenaudota, originalioje pakuotėje, be pažeidimų.</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Kaip grąžinti</h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Parašykite mums: <a href={`mailto:${COMPANY.email}`} className="text-accent underline">{COMPANY.email}</a> su užsakymo numeriu.</li>
        <li>Gausite grąžinimo instrukcijas ir adresą.</li>
        <li>Saugiai supakuokite pliušinį žaislą.</li>
        <li>Grąžinimo išlaidas, jei nėra defekto, dažniausiai apmoka pirkėjas.</li>
      </ol>
      <h2 className="text-xl font-bold text-foreground mt-6">Pinigų grąžinimas</h2>
      <p>Gavus ir patikrinus prekę, pinigai grąžinami per 14 dienų į tą patį mokėjimo būdą.</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Defektinės prekės</h2>
      <p>Jei prekė brokuota — susisiekite per 48 val. Nuotraukos ir aprašymas. Pakeisim arba grąžinsime visą sumą, įskaitant pristatymą.</p>
      <h2 className="text-xl font-bold text-foreground mt-6">Individualūs užsakymai</h2>
      <p>Prekės pagamintos pagal individualius svorio/dydžio reikalavimus (užsakytos per {COMPANY.email}) gali būti negrąžinamos, jei tai buvo aiškiai nurodyta užsakymo metu.</p>
      <p className="mt-6">{COMPANY.name}</p>
    </LegalLayout>
  );
}