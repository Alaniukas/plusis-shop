import type { Product, ProductFamily } from "@/types/product";
import { UNIT_PRICE } from "@/lib/pricing";

const BASE = {
  weightKg: 1,
  lengthCm: 60,
  weightZones: "Rankose ir kūne",
  material: "Minkštas pliušas",
  ageFrom: 3,
  care: "Skalbkite rankomis",
  priceEur: UNIT_PRICE,
};

/** Katalogas — landing foto pirma */
export const products: Product[] = [
  {
    id: "panda-1",
    slug: "panda",
    name: "Bambukas",
    animalLabel: "Panda",
    family: "panda",
    persona: "Kai diena buvo per ilga — jis tiesiog apkabina.",
    description:
      "Bambukas — lėtas, tylus pandukas. Jo svoris ant krūtinės primena, kad galima nieko nedaryti.",
    story:
      "Bambukas moka laukti. Gamtoje pandos valandas sėdi tarp bambukų — neskuba, nekelia triukšmo. Tokį ritmą jis atneša ir tau: ilgos rankos apgaubia pečius, o švelnus svoris tarsi sako „čia saugu“. Žmonės jį renkasi po sunkių dienų, kai norisi ne patarimų, o tylios kompanijos. Jei ieškai apkabinimo be žodžių — Bambukas jau čia.",
    colorLabel: "Juoda ir balta",
    colorHex: "#1a1a1a",
    images: [
      "/products/photos/product-panda-1.jpg",
      "/products/photos/lifestyle-panda-shoulders.jpg",
      "/products/photos/lifestyle-panda.jpg",
    ],
    stockCount: 12,
    status: "active",
    ...BASE,
  },
  {
    id: "koala-1",
    slug: "koala",
    name: "Mira",
    animalLabel: "Koala",
    family: "koala",
    persona: "Visą dieną ilsisi — kviečia daryti tą patį.",
    description:
      "Mira — koala, kuri beveik visą laiką miega ir ilsisi. Jos ramybė užkrečiama: apsikabink ir leisk sau sulėtėti.",
    story:
      "Koalos gamtoje miega iki 18–22 valandų per parą. Mira gyvena tuo pačiu tempu: ji nekviečia „daryti daugiau“ — kviečia sustoti. Jos pūkuotos ausys ir švelnus svoris padeda kūnui prisiminti, kaip atsipalaiduoti. Daugelis ima Mirą į lovą ar ant sofos vakare: užmerk akis, pajusk svorį — ir pabandyk pasijusti kaip koala. Lėtai. Tyliai. Saugiai.",
    colorLabel: "Pilka",
    colorHex: "#6b7280",
    images: [
      "/products/photos/product-koala-1.jpg",
      "/products/photos/lifestyle-koala-shoulders.jpg",
      "/products/photos/lifestyle-koala.jpg",
    ],
    stockCount: 10,
    status: "active",
    ...BASE,
  },
  {
    id: "red-panda-1",
    slug: "raudonasis-pandukas",
    name: "Ugnelis",
    animalLabel: "Raudonasis pandukas",
    family: "red-panda",
    persona: "Šiltas kaip saulėlydis — kai mintys per greitos.",
    description:
      "Ugnelis — raudonasis pandukas su žieduota uodega. Jo šiluma ir svoris padeda nuraminti nerimą.",
    story:
      "Raudonieji pandukai gamtoje lipa medžiais ir slepiasi tarp šakų — maži, bet ištvermingi. Ugnelis toks pat: ryškus, mielas, bet ramus. Kai galvoje per daug triukšmo, jo svoris ant pečių ar krūtinės veikia kaip šiltas „stop“ mygtukas. Jei reikia draugo, kuris nesmerkia ir tiesiog būna greta — jis tavo.",
    colorLabel: "Oranžinė",
    colorHex: "#c2410c",
    images: [
      "/products/photos/product-red-panda-1.jpg",
      "/products/photos/lifestyle-red-panda.jpg",
      "/products/photos/lifestyle-red-outdoor.jpg",
      "/products/photos/lifestyle-woman.jpg",
    ],
    stockCount: 8,
    status: "active",
    ...BASE,
  },
  {
    id: "sloth-1",
    slug: "tinginys",
    name: "Lėtūnas",
    animalLabel: "Tinginys",
    family: "sloth",
    persona: "Lėčiausias ritmas — kai pasaulis per greitas.",
    description:
      "Lėtūnas moko neskubėti. Jo ilgos rankos ir svoris kviečia sustoti — šiuo metu išparduota.",
    story:
      "Tinginiai juda lėtai ne todėl, kad tingi — o todėl, kad taupo energiją. Lėtūnas atneša tą pačią filosofiją: nereikia visko suspėti šiandien. Kai vėl turėsime — pranešime pirmiems eilėje.",
    colorLabel: "Šiltas rudas",
    colorHex: "#8b6914",
    images: [
      "/products/photos/product-sloth-1.jpg",
      "/products/photos/lifestyle-sloth-shoulders.jpg",
      "/products/photos/lifestyle-sloth-hug.jpg",
    ],
    stockCount: 0,
    status: "sold_out",
    ...BASE,
  },
];

export const familyLabels: Record<ProductFamily, string> = {
  panda: "Pandos",
  koala: "Koalos",
  "red-panda": "Raudonieji pandukai",
  sloth: "Tinginiai",
};

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getActiveProducts() {
  return products.filter((p) => p.status === "active");
}

export function getSoldOutProducts() {
  return products.filter((p) => p.status === "sold_out" || p.status === "coming_soon");
}

export function getComingSoonProducts() {
  return products.filter((p) => p.status === "coming_soon" || p.status === "sold_out");
}
