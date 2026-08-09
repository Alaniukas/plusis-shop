import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEur(amount: number) {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(value);
}
