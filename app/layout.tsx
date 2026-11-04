import type { Metadata, Viewport } from "next";
import { LangProvider } from "@/lib/lang";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Remen.uz — приводные ремни и конвейерные ленты",
    template: "%s · Remen.uz",
  },
  description:
    "Зубчатые, поликлиновые, клиновые и круглые ремни Megadyne, Bando и PIX в Ташкенте. Подбор по артикулу, размерам или старому образцу.",
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
