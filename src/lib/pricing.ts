/** Kainos ir pristatymas — single source of truth (be "use client") */
export const UNIT_PRICE = 38.99;
export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 3.99;

export function calculateDiscount(subtotal: number, itemCount: number) {
  if (itemCount >= 3) return subtotal * 0.2;
  if (itemCount >= 2) return subtotal * 0.15;
  return 0;
}

