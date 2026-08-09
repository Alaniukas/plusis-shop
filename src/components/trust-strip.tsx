import { Heart, Moon, Sparkles, Truck } from "lucide-react";

const items = [
  { icon: Heart, label: "Mažina stresą ir nerimą" },
  { icon: Moon, label: "Padeda užmigti" },
  { icon: Sparkles, label: "Švelnus svoris — komfortas" },
  { icon: Truck, label: "Nemokamas pristatymas nuo 50 €" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-warm-white px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-sm font-semibold text-muted">
            <item.icon className="h-4 w-4 text-accent" strokeWidth={2} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
