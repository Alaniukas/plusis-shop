/** Kainos ir pristatymas — single source of truth (be "use client") */
export const UNIT_PRICE = 38.99;
export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 3.99;

/** 2 vnt. → 10%, 3+ → 15% (max) */
export function calculateDiscount(subtotal: number, itemCount: number) {
  if (itemCount >= 3) return subtotal * 0.15;
  if (itemCount >= 2) return subtotal * 0.1;
  return 0;
}
