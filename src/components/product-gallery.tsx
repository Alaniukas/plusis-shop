"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
  soldOut,
}: {
  images: string[];
  name: string;
  soldOut?: boolean;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-cream">
        <Image
          src={main}
          alt={name}
          width={800}
          height={800}
          className="aspect-square w-full object-contain bg-cream p-3"
          priority
        />
        {soldOut && (
          <span className="absolute left-4 top-4 rounded-full bg-stone-900/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Išparduota
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream ring-offset-2 transition sm:h-auto sm:w-auto sm:aspect-auto ${
                i === active ? "ring-2 ring-accent" : "opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                width={160}
                height={160}
                className="aspect-square h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
