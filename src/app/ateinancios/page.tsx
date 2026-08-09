import { redirect } from "next/navigation";

/** Senas „netrukus“ kelias — nukreipiame į parduotuvę */
export default function ComingSoonPage() {
  redirect("/produktai");
}
