import Link from "next/link";

export function Logo({ height = 36 }: { height?: number }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo.png" alt="Remen.uz" style={{ height, width: "auto", display: "block" }} />
    </Link>
  );
}
