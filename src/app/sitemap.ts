import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const pages = ["", "/produktai", "/duk", "/apie", "/privatumo-politika", "/grazinimas", "/pirkimo-taisykles"];
  return [...pages.map((p) => ({ url: `${base}${p}`, lastModified: new Date() })), ...products.map((p) => ({ url: `${base}/produktai/${p.slug}`, lastModified: new Date() }))];
}