export const BUNDLES = [
  {
    id: "sau-ir-vaikui",
    title: "Sau ir vaikui",
    subtitle: "Du plušiai — tau ir mažyliui.",
    discountLabel: "Du — švelniau",
    minItems: 2,
  },
  {
    id: "sau-ir-merginai",
    title: "Sau ir jai",
    subtitle: "Du plušiai — jauki dovana abiem.",
    discountLabel: "Du — švelniau",
    minItems: 2,
  },
  {
    id: "kolekcija",
    title: "Šeimai",
    subtitle: "Trys ar daugiau — didžiausia nuolaida.",
    discountLabel: "Trys+ — dar geriau",
    minItems: 3,
  },
] as const;

export function getDiscountLabel(itemCount: number): string | null {
  if (itemCount >= 3) return "Nuolaida 3+";
  if (itemCount >= 2) return "Nuolaida 2";
  return null;
}
