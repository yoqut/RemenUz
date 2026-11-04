import Link from "next/link";
import { ACCENT } from "@/lib/i18n";

export function Logo({ size = 40, fontSize = 22 }: { size?: number; fontSize?: number }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span className="drop" style={{ width: size, height: size, display: "block", backgroundColor: ACCENT }} />
      <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize, letterSpacing: -0.5 }}>
        remen<span style={{ color: "#FFB088" }}>.uz</span>
      </span>
    </Link>
  );
}
