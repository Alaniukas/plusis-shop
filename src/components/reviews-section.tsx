"use client";

type Review = {
  name: string;
  city?: string;
  rating: number;
  text: string;
  avatar?: string;
  initials?: string;
};

const reviews: Review[] = [
  {
    name: "Greta M.",
    city: "Vilnius",
    rating: 5,
    text: "Bambuką pasiėmiau po ilgos savaitės. Svoris jaučiasi, bet ne slegia — miegojau ramiau jau pirmą naktį.",
    avatar: "/products/photos/lifestyle-woman.jpg",
  },
  {
    name: "Tomas",
    rating: 4,
    text: "galvojau bus vaikiškas daiktas bet ne. Mira tikrai nuramina kai vakare sėdžiu ant sofos. norėjau Lėtūno, bet išparduota :(",
    initials: "T",
  },
  {
    name: "Aistė K.",
    city: "Kaunas",
    rating: 5,
    text: "Dovanojau seseriai Ugnelį. Ji rašė, kad vakare mažiau „sukasi galva“. Pristatymas greitas, pakuotė graži.",
    initials: "AK",
  },
  {
    name: "Justina",
    rating: 4.5,
    text: "Labai mielas, kailiukas švelnus. Turiu nerimą ir kai apsikabinu - kažkaip lengviau. Ne eilinis pliušinis.",
    avatar: "/products/photos/lifestyle-koala.jpg",
  },
  {
    name: "Rokas P.",
    city: "Klaipėda",
    rating: 5,
    text: "Pirkau žmonai. Ji juokėsi, o dabar kas vakarą su juo. Kokybė gera, svoris rankose tikras.",
    initials: "RP",
  },
  {
    name: "Monika",
    rating: 4,
    text: "patiko!! tik galvojau bus didesnis šiek tiek, bet apkabinimui užtenka. dabar laukiu Brūno eilėj",
    initials: "M",
  },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} iš 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <span key={i} className={filled ? "text-accent" : "text-border/80"}>
            ★
          </span>
        );
      })}
      <span className="ml-1.5 text-xs font-medium text-muted">
        {rating.toFixed(1).replace(".", ",")}
      </span>
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="flex w-[min(78vw,300px)] shrink-0 snap-start flex-col border-t border-border pt-6 md:w-[340px]">
      <Stars rating={r.rating} />
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/85">„{r.text}“</p>
      <div className="mt-6 flex items-center gap-3">
        {r.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-xs font-bold text-muted">
            {r.initials ?? r.name[0]}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold">{r.name}</p>
          {r.city && <p className="text-xs text-muted">{r.city}</p>}
        </div>
      </div>
    </article>
  );
}

/** Infinite slow horizontal scroll — stilistiškai tas pats, juda pats */
export function ReviewsSection() {
  const loop = [...reviews, ...reviews];

  return (
    <section className="overflow-x-clip bg-warm-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Atsiliepimai
        </p>
        <h2 className="mt-2 text-center font-display text-2xl tracking-tight md:text-3xl">
          Ramūs vakarai, tikri balsai
        </h2>
      </div>

      <div className="relative mt-10 w-full min-w-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-warm-white to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-warm-white to-transparent md:w-24" />

        <div className="flex w-full min-w-0 overflow-hidden">
          <div className="flex w-max max-w-none animate-reviews-scroll gap-10 px-4 hover:[animation-play-state:paused]">
            {loop.map((r, i) => (
              <ReviewCard key={`${r.name}-${i}`} r={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
