import Link from "next/link";
import { COMPANY } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-warm-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-sm text-muted md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-xl font-extrabold text-foreground">{COMPANY.brand}</p>
          <p className="mt-3 max-w-sm leading-relaxed">
            Svoriniai pliušiniai su švelniu svoriu — apkabina, nuramina ir padeda
            atsipalaiduoti po ilgos dienos.
          </p>
          <p className="mt-4">
            Klausimai?{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              {COMPANY.email}
            </a>
          </p>
        </div>
        <div>
          <p className="font-extrabold text-foreground">Parduotuvė</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/produktai" className="hover:text-foreground">
                Katalogas
              </Link>
            </li>
            <li>
              <Link href="/duk" className="hover:text-foreground">
                Klausimai
              </Link>
            </li>
            <li>
              <Link href="/apie" className="hover:text-foreground">
                Apie mus
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold text-foreground">Informacija</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/pirkimo-taisykles" className="hover:text-foreground">
                Pirkimo taisyklės
              </Link>
            </li>
            <li>
              <Link href="/privatumo-politika" className="hover:text-foreground">
                Privatumo politika
              </Link>
            </li>
            <li>
              <Link href="/grazinimas" className="hover:text-foreground">
                Grąžinimas
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-xs text-muted">
        <div className="mx-auto max-w-6xl">
          <p>
            {COMPANY.name}
            <span className="mx-2 text-border">·</span>
            {COMPANY.email}
          </p>
          <p className="mt-3">
            © {new Date().getFullYear()} {COMPANY.brand}. Visos teisės saugomos.
          </p>
        </div>
      </div>
    </footer>
  );
}
