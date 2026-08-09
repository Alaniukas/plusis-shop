export type ProductFamily = "panda" | "koala" | "red-panda" | "sloth";
export type ProductStatus = "active" | "coming_soon" | "sold_out";

export interface Product {
  id: string;
  slug: string;
  /** Character name shown as title, e.g. Bambukas */
  name: string;
  /** Animal type label, e.g. Panda */
  animalLabel: string;
  family: ProductFamily;
  persona: string;
  description: string;
  /** Longer emotional story for PDP */
  story: string;
  priceEur: number;
  weightKg: number;
  lengthCm: number;
  weightZones: string;
  material: string;
  ageFrom: number;
  care: string;
  colorLabel: string;
  colorHex: string;
  images: string[];
  stockCount: number;
  status: ProductStatus;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceEur: number;
  image: string;
  quantity: number;
}
