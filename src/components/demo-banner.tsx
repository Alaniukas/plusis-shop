import { isDemoMode } from "@/lib/demo-mode";

export function DemoBanner() {
  if (!isDemoMode()) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm font-medium text-amber-900">
      Demo režimas — veikia be .env. Užsakymai: data/demo-orders.json
    </div>
  );
}
