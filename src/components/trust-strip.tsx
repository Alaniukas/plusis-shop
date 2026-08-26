import { Heart, Moon, Sparkles, Truck } from "lucide-react";

const items = [
  { icon: Heart, label: "Mažina stresą ir nerimą" },
  { icon: Moon, label: "Padeda užmigti" },
  { icon: Sparkles, label: "Švelnus svoris — komfortas" },
  { icon: Truck, label: "Nemokamas pristatymas nuo 50 €" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-warm-white px-4 py-6 sm:py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-2.5 text-sm font-semibold text-muted sm:items-center">
            <item.icon className="h-4 w-4 text-accent" strokeWidth={2} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
