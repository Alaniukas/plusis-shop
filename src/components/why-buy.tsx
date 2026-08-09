const benefits = [
  {
    title: "Mažina stresą",
    text: "Švelnus svoris padeda kūnui nurimti po įtemptos dienos.",
  },
  {
    title: "Sumažina nerimą",
    text: "Apkabinimas ir pastovus kontaktas — kai mintys sukasi ratu.",
  },
  {
    title: "Padeda užmigti",
    text: "Daugelis ima pliušį į lovą kaip raminančią rutiną prieš miegą.",
  },
  {
    title: "Jausmas, kad esi saugus",
    text: "Ilgos rankos apgaubia — tarsi tikras apkabinimas, kai jo reikia.",
  },
];

export function WhyBuy() {
  return (
    <section className="bg-warm-white px-4 py-14 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl tracking-tight md:text-3xl">
          Kodėl žmonės renkasi Plušį
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-muted">
          Ne žaislas lentynai — svoris, kuris nuramina.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="text-center sm:text-left">
              <p className="font-display text-lg font-semibold text-foreground">{b.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
