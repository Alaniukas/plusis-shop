import type { Metadata, Viewport } from "next";
import { Karla, Young_Serif } from "next/font/google";
import "./globals.css";
import { DemoBanner } from "@/components/demo-banner";
import { CookieConsent } from "@/components/cookie-consent";
import { COMPANY } from "@/lib/company";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://plusis.lt";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf6f1",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${COMPANY.brand} | Svoriniai pliušiniai, kurie nuramina`,
    template: `%s | ${COMPANY.brand}`,
  },
  description:
    "Svoriniai ilgorankiai pliušiniai Lietuvoje — Bambukas, Mira, Ugnelis. Švelnus svoris mažina stresą ir nerimą, padeda užmigti. Nemokamas pristatymas nuo 50 €.",
  keywords: [
    "svorinis pliušinis",
    "ilgorankis pliušinis",
    "pliušinis žaislas",
    "svorinė panda",
    "koala pliušinis",
    "raudonasis pandukas",
    "streso mažinimas",
    "nerimas",
    "dovana",
    "Plušis",
    "Lietuva",
  ],
  authors: [{ name: COMPANY.name }],
  creator: COMPANY.brand,
  openGraph: {
    type: "website",
    locale: "lt_LT",
    url: siteUrl,
    siteName: COMPANY.brand,
    title: `${COMPANY.brand} | Svoris, kuris apkabina`,
    description:
      "Svoriniai pliušiniai su ilgomis rankomis. Nuramina po ilgos dienos — Lietuvoje.",
    images: [{ url: "/products/photos/lifestyle-woman.jpg", width: 1200, height: 1200 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.brand} | Svoriniai pliušiniai`,
    description: "Švelnus svoris, kuris nuramina. Pandos, koalos, raudonieji pandukai.",
    images: ["/products/photos/product-panda-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.brand,
    legalName: COMPANY.name,
    url: siteUrl,
    email: COMPANY.email,
  };

  return (
    <html lang="lt" className={`${karla.variable} ${youngSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <DemoBanner />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
