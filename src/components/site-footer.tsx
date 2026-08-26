import Link from "next/link";
import { COMPANY } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-warm-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted sm:grid-cols-2 sm:gap-10 sm:py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-xl font-extrabold text-foreground">{COMPANY.brand}</p>
          <p className="mt-3 max-w-sm text-pretty leading-relaxed">
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
          <ul className="mt-4 space-y-1">
            <li>
              <Link href="/produktai" className="inline-flex min-h-11 items-center hover:text-foreground">
                Katalogas
              </Link>
            </li>
            <li>
              <Link href="/duk" className="inline-flex min-h-11 items-center hover:text-foreground">
                Klausimai
              </Link>
            </li>
            <li>
              <Link href="/apie" className="inline-flex min-h-11 items-center hover:text-foreground">
                Apie mus
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold text-foreground">Informacija</p>
          <ul className="mt-4 space-y-1">
            <li>
              <Link href="/pirkimo-taisykles" className="inline-flex min-h-11 items-center hover:text-foreground">
                Pirkimo taisyklės
              </Link>
            </li>
            <li>
              <Link href="/privatumo-politika" className="inline-flex min-h-11 items-center hover:text-foreground">
                Privatumo politika
              </Link>
            </li>
            <li>
              <Link href="/grazinimas" className="inline-flex min-h-11 items-center hover:text-foreground">
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
