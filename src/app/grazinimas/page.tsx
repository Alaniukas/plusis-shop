import { LegalLayout } from "@/components/legal-layout";
import { COMPANY } from "@/lib/company";

export default function ReturnsPage() {
  return (
    <LegalLayout title="Grąžinimo politika">
      <p>
        {COMPANY.brand} prekes galite grąžinti pagal Lietuvos Respublikos vartotojų teisių apsaugos
        įstatymą.
      </p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Grąžinimo terminas</h2>
      <p>
        Per <strong>14 kalendorinių dienų</strong> nuo prekės gavimo dienos, jei prekė nenaudota,
        originalioje pakuotėje, be pažeidimų.
      </p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Kaip grąžinti</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Parašykite mums:{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-accent underline">
            {COMPANY.email}
          </a>{" "}
          su užsakymo numeriu.
        </li>
        <li>Gausite grąžinimo instrukcijas ir adresą.</li>
        <li>Saugiai supakuokite pliušinį.</li>
        <li>Jei nėra defekto, grąžinimo siuntimo išlaidas dažniausiai apmoka pirkėjas.</li>
      </ol>
      <h2 className="mt-6 text-xl font-bold text-foreground">Pinigų grąžinimas</h2>
      <p>
        Gavus ir patikrinus prekę, pinigai grąžinami per 14 dienų į tą patį mokėjimo būdą.
      </p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Defektinės prekės</h2>
      <p>
        Jei prekė brokuota — susisiekite kuo greičiau (pageidautina per 48 val.) ir atsiųskite
        nuotraukas su aprašymu. Pakeisime prekę arba grąžinsime visą sumą, įskaitant pristatymą.
      </p>
      <h2 className="mt-6 text-xl font-bold text-foreground">Individualūs užsakymai</h2>
      <p>
        Prekės, pagamintos pagal individualius svorio ar dydžio reikalavimus (užsakytos per{" "}
        {COMPANY.email}), gali būti negrąžinamos, jei tai buvo aiškiai nurodyta užsakymo metu.
      </p>
      <p className="mt-6">{COMPANY.name}</p>
    </LegalLayout>
  );
}