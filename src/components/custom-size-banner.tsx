import { Mail } from "lucide-react";
import { COMPANY } from "@/lib/company";

export function CustomSizeBanner({ compact }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "rounded-xl border border-border bg-cream-dark p-4 text-sm text-muted"
          : "rounded-2xl border border-border bg-gradient-to-br from-blush/60 to-cream-dark p-5 md:p-8"
      }
    >
      <div className="flex gap-3 sm:gap-4">
        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
        <div>
          <p className="font-extrabold text-foreground">Norite kitokio svorio ar dydžio?</p>
          <p className="mt-1 text-muted">
            Standartinis plušis tinka daugumai. Jei norite šiek tiek sunkesnio ar didesnio —
            parašykite, sutarime asmeniškai.
          </p>
          <a
            href={`mailto:${COMPANY.email}?subject=Plušis — individualus užsakymas`}
            className="mt-2 inline-flex font-bold text-accent underline-offset-2 hover:underline"
          >
            {COMPANY.email}
          </a>
        </div>
      </div>
    </div>
  );
}
