import Link from "next/link";
import { CartButton } from "./cart-button";
import { AnnouncementBar } from "./announcement-bar";
import { MobileNav } from "./mobile-nav";
import { COMPANY } from "@/lib/company";

const navLinks = [
  { href: "/#katalogas", label: "Katalogas" },
  { href: "/duk", label: "Klausimai" },
  { href: "/apie", label: "Apie" },
];

function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      className={className}
      aria-hidden
    >
      <circle cx="64" cy="64" r="64" fill="#FDF2F0" />
      <path
        fill="#E89B96"
        d="M64 16c22 0 40 14 44 34 3 14 0 28-10 40-8 10-20 16-30 18v-11c8-2 16-7 21-14 8-10 10-21 8-31C93 36 80 26 64 26S35 36 31 52c-2 10 0 21 8 31 5 7 13 12 21 14v11c-10-2-22-8-30-18C20 78 17 64 20 50 24 30 42 16 64 16z"
      />
      <circle cx="64" cy="50" r="24" fill="#FBF7F2" />
      <path
        d="M52 48c3 4 8 4 11 0"
        stroke="#4A342E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M65 48c3 4 8 4 11 0"
        stroke="#4A342E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        fill="#E89B96"
        d="M64 54c-1-2-3.2-2.6-4.8-1.4-1.4.9-1.6 2.8-.4 4L64 62.5 69.2 56.6c1.2-1.2 1-3.1-.4-4-1.6-1.2-3.8-.6-4.8 1.4z"
      />
      <path
        fill="#FBF7F2"
        d="M64 112c-1.4 0-2.6-.6-3.5-1.6C48.5 96.5 40 88.2 40 76.8 40 69.2 45.8 63 53.2 63c4 0 7.6 1.8 10.8 5.4C67.2 64.8 70.8 63 74.8 63 82.2 63 88 69.2 88 76.8c0 11.4-8.5 19.7-20.5 33.6-1 1-2.1 1.6-3.5 1.6z"
      />
    </svg>
  );
}

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-[90]"
          : "sticky top-0 z-[90] bg-warm-white/95 backdrop-blur-md"
      }
    >
      {!transparent && <AnnouncementBar />}
      <div className={transparent ? "" : "border-b border-border"}>
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm sm:h-12 sm:w-12 md:h-14 md:w-14" />
            <span
              className={
                transparent
                  ? "truncate font-display text-xl tracking-tight text-white drop-shadow sm:text-2xl md:text-[1.85rem]"
                  : "truncate font-display text-xl tracking-tight text-foreground sm:text-2xl md:text-[1.85rem]"
              }
            >
              {COMPANY.brand}
            </span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  transparent
                    ? "text-sm font-medium text-white/90 drop-shadow transition hover:text-white"
                    : "text-sm font-medium text-muted transition hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <CartButton light={transparent} />
            <MobileNav light={transparent} />
          </div>
        </div>
      </div>
    </header>
  );
}
