import { redirect } from "next/navigation";

// Products live at /product/[slug]; the bare path goes to the catalog.
export default function ProductIndex() {
  redirect("/catalog");
}
