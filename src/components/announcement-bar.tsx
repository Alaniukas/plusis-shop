import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { formatEur } from "@/lib/utils";

export function AnnouncementBar() {
  return (
    <div className="bg-peach px-4 py-2.5 text-center text-sm font-semibold text-stone-800">
      Nemokamas pristatymas nuo {formatEur(FREE_SHIPPING_THRESHOLD)} · Du plušiai −15% · Trys ir daugiau −20%
    </div>
  );
}
