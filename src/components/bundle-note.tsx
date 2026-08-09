"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

/** Trumpar — be skaičių pertekliaus */
export function BundleNote() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
        aria-expanded={open}
      >
        <HelpCircle className="h-4 w-4 text-accent" strokeWidth={1.75} />
        <span className="underline decoration-border underline-offset-4">Nuolaida keliems</span>
      </button>

      {open && (
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Perkant daugiau nei vieną — kaina mažesnė. Nuolaida pritaikoma pati krepšelyje.
        </p>
      )}
    </div>
  );
}
