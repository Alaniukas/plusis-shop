export function EditorialSection() {
  const blocks = [
    {
      title: "Kodėl svoris nuramina?",
      body: "Lengvas, tolygus svoris sukuria jausmą, tarsi kas nors tave apkabintų. Po įtemptos dienos kūnas atsipalaiduoja, mintys sulėtėja, nerimas prislopsta.",
    },
    {
      title: "Rankos, kurios apgaubia",
      body: "Ilgos, minkštos rankos leidžia pliušiui apsikabinti tave — pečius, juosmenį ar tiesiog gulėti šalia. Tai ne žaislas lentynoje, o jaukumo kompanionas.",
    },
    {
      title: "Sau, vaikui ar dovanai",
      body: "Tinka ir vaikams, ir suaugusiems. Vakarui ant sofos, miegui, kelionei ar tiesiog momentui, kai reikia šilumos be žodžių.",
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--blush),_transparent_55%)]" />
      <div className="relative mx-auto max-w-2xl space-y-14 text-center">
        {blocks.map((block) => (
          <div key={block.title}>
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-[1.75rem]">
              {block.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{block.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
