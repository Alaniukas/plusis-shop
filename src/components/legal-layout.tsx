import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-8 space-y-4 text-muted leading-relaxed">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
