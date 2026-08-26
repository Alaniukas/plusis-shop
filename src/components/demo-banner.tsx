import { isDemoMode } from "@/lib/demo-mode";

export function DemoBanner() {
  if (!isDemoMode()) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-medium leading-snug text-amber-900 sm:px-4 sm:text-sm">
      <span className="sm:hidden">Demo režimas — užsakymai saugomi faile</span>
      <span className="hidden sm:inline">
        Demo režimas — veikia be .env. Užsakymai: data/demo-orders.json
      </span>
    </div>
  );
}
