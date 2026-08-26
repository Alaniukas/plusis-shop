export const BUNDLES = [
  {
    id: "sau-ir-vaikui",
    title: "Sau ir vaikui",
    subtitle: "Du plušiai — tau ir mažyliui.",
    discountLabel: "2 vnt. · −15%",
    minItems: 2,
    discountPercent: 15,
  },
  {
    id: "sau-ir-merginai",
    title: "Sau ir jai",
    subtitle: "Du plušiai — jauki dovana abiem.",
    discountLabel: "2 vnt. · −15%",
    minItems: 2,
    discountPercent: 15,
  },
  {
    id: "kolekcija",
    title: "Šeimai",
    subtitle: "Trys ar daugiau — didžiausia nuolaida.",
    discountLabel: "3+ vnt. · −20%",
    minItems: 3,
    discountPercent: 20,
  },
] as const;

export function getDiscountLabel(itemCount: number): string | null {
  if (itemCount >= 3) return "Nuolaida 3+";
  if (itemCount >= 2) return "Nuolaida 2";
  return null;
}
