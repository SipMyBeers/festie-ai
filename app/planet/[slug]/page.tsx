import { festivals, getFestivalBySlug } from "@/lib/data/festivals";
import { notFound } from "next/navigation";
import { PlanetPageClient } from "./client";

export function generateStaticParams() {
  return festivals
    .filter((f) => !f.comingSoon)
    .map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);
  if (!festival) return {};
  return {
    title: `${festival.name} — Festie.ai`,
    description: `Explore ${festival.name} in 3D. ${festival.description}`,
  };
}

export default async function PlanetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);
  if (!festival || festival.comingSoon) notFound();
  return <PlanetPageClient festival={festival} />;
}
