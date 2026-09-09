import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatEur } from "@/lib/utils";

export function AnnouncementBar() {
  return (
    <div className="bg-peach px-3 py-2 text-center text-xs font-semibold leading-snug text-stone-800 sm:px-4 sm:py-2.5 sm:text-sm">
      <span className="sm:hidden">
        Nemokamas pristatymas nuo {formatEur(FREE_SHIPPING_THRESHOLD)} · 2 vnt. −10%
      </span>
      <span className="hidden sm:inline">
        Nemokamas pristatymas nuo {formatEur(FREE_SHIPPING_THRESHOLD)} · Du plušiai −10% · Trys ir
        daugiau −15%
      </span>
    </div>
  );
}
