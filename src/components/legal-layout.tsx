import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-16">
        <h1 className="break-words font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <div className="mt-8 space-y-4 overflow-x-auto text-muted leading-relaxed [overflow-wrap:anywhere]">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
