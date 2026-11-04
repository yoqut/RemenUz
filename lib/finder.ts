// Belt finder ("Подбор ремня"): belt types, their profiles (each a remen.uz category) and the
// size fields that make sense for that type.
import { getCategory } from "./catalog";

export type BeltType = "tooth" | "poly" | "v" | "round";

type FieldDef = { ru: string; uz: string; ph: string } | null;

export const FINDER: Record<BeltType, { ru: string; uz: string; cats: number[]; len: FieldDef; second: FieldDef }> = {
  tooth: {
    ru: "Зубчатый", uz: "Tishli",
    // T/AT polyurethane, HTD, STD, RPP and inch-pitch profiles.
    cats: [24, 25, 26, 27, 115, 18, 19, 95, 21, 100, 94, 92, 20, 99, 22, 4, 101, 67],
    len: { ru: "Длина, мм", uz: "Uzunligi, mm", ph: "1645" },
    second: { ru: "Ширина, мм", uz: "Eni, mm", ph: "25" },
  },
  poly: {
    ru: "Поликлиновой", uz: "Koʻp ponali",
    cats: [31, 46, 47, 48, 49],
    len: { ru: "Длина, мм", uz: "Uzunligi, mm", ph: "1059" },
    second: { ru: "Ручьёв, шт", uz: "Ariqchalar, ta", ph: "8" },
  },
  v: {
    ru: "Клиновой", uz: "Ponasimon",
    cats: [45, 73, 10, 11, 74, 8, 39, 12, 13, 14, 41, 15, 43, 44],
    len: { ru: "Длина Lp / Li, мм", uz: "Uzunligi Lp / Li, mm", ph: "1250" },
    second: null,
  },
  round: {
    ru: "Круглого сечения", uz: "Dumaloq kesimli",
    cats: [38],
    len: null,
    second: { ru: "Диаметр, мм", uz: "Diametr, mm", ph: "6" },
  },
};

export const BELT_TYPES = Object.keys(FINDER) as BeltType[];

/** Profile options for a belt type: short code ("T5", "HTD 8M", "SPZ"), category slug and product count. */
export function profilesOf(type: BeltType) {
  return FINDER[type].cats
    .map((id) => getCategory(id))
    .filter((c) => !!c)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      count: c.count,
      code: c.id === 38 ? "Ø 3–10 мм" : c.name.replace(/^(Тип|Профиль)\s*-\s*/, "").replace(/\s*\(.*\)$/, "").trim(),
    }));
}

/** Catalog URL for a finder query; sizes become search words matched against name and SKU. */
export function finderHref(slug: string, len: string, second: string, type: BeltType) {
  const words = [len.trim(), type === "poly" && second.trim() ? `${second.trim()} PJ` : second.trim()].filter(Boolean);
  return words.length ? `/catalog/${slug}?q=${encodeURIComponent(words.join(" "))}` : `/catalog/${slug}`;
}
