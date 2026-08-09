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
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl bg-cream ring-offset-2 transition ${
                i === active ? "ring-2 ring-accent" : "opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                width={160}
                height={160}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
