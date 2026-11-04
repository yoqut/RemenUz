import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoView } from "../InfoView";
import { IP, SLUGS, isSlug } from "../content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  return { title: IP.ru.pages[slug].title };
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  return <InfoView slug={slug} />;
}
