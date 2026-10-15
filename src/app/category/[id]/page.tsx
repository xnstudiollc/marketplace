import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowseClient } from "@/components/browse/BrowseClient";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CATEGORY_META, CATEGORY_ORDER, isCategoryId } from "@/lib/categories";
import { getBrowseEntries, getGamesByCategory } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export function generateStaticParams() {
  return CATEGORY_ORDER.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/category/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isCategoryId(id)) return {};
  const meta = CATEGORY_META[id];
  return {
    title: meta.label,
    description: `${meta.blurb} ${getGamesByCategory(id).length} games listed.`,
    alternates: { canonical: `/category/${id}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[id]">) {
  const { id } = await params;
  if (!isCategoryId(id)) notFound();
  const meta = CATEGORY_META[id];
  const Icon = meta.icon;
  const entries = getBrowseEntries(getGamesByCategory(id));

  return (
    <div className="container-page pt-8 pb-16 sm:pt-12" style={{ "--cat-accent": meta.accent } as CSSProperties}>
      <Breadcrumbs className="mb-6" items={[{ label: "Home", href: "/" }, { label: "Browse", href: "/browse" }, { label: meta.label }]} />
      <header className="glass relative mb-8 overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full opacity-35 blur-3xl"
          style={{ background: "var(--cat-accent)" }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[color-mix(in_srgb,var(--cat-accent)_16%,transparent)]"
            style={{ color: meta.accent }}
          >
            <Icon className="size-7" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{meta.label}</h1>
            <p className="mt-2 text-fg-muted">{meta.blurb}</p>
            <p className="tabular mt-3 text-sm text-fg-subtle">{formatNumber(entries.length)} games in this category</p>
          </div>
        </div>
      </header>
      <BrowseClient entries={entries} showCategories={false} />
    </div>
  );
}
