import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { templates, getTemplate } from "@/data/templates";
import { getCard } from "@/data/cards";
import { CardRenderer } from "@/components/card-templates/registry";
import { PhoneFrame } from "@/components/card/PhoneFrame";

export function generateStaticParams() {
  return templates.map((t) => ({ templateId: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> {
  const { templateId } = await params;
  const meta = getTemplate(templateId);
  return {
    title: meta ? `${meta.name} template preview` : "Template preview",
    description: meta?.description,
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const meta = getTemplate(templateId);
  if (!meta) notFound();
  const card = getCard(meta.demoSlug);
  if (!card) notFound();

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-surface bg-grid">
      <div className="mx-auto flex w-full max-w-[430px] shrink-0 items-center justify-between px-6 pt-6">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> All templates
        </Link>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: meta.style.accent }}
        >
          {meta.name}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 justify-center px-5 py-6">
        <PhoneFrame screenClassName="min-h-0 flex-1 !p-0">
          {/* Full-bleed inside the phone: strip the card's own frame so it
              fills the screen like a real app rather than floating as a card. */}
          <div className="[&>div>div]:max-w-none [&>div>div]:overflow-visible [&>div>div]:rounded-none [&>div>div]:sm:rounded-none [&>div>div]:border-0 [&>div>div]:sm:border-0 [&>div>div]:shadow-none [&>div>div]:sm:shadow-none [&>div>div]:min-h-0 [&>div>div]:sm:min-h-0">
            <CardRenderer card={card} templateId={meta.id} />
          </div>
        </PhoneFrame>
      </div>
    </main>
  );
}
