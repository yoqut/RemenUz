import type { Metadata, Viewport } from "next";
import { LangProvider } from "@/lib/lang";
import { CartProvider } from "@/lib/cart";
import { FavProvider } from "@/lib/favorites";
import { themeInitScript } from "@/components/ThemeToggle";
import { MobileTabBar } from "@/components/MobileTabBar";
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
  // Matches the dark utility strip at the top of every page.
  themeColor: "#15181C",
  // Lets the phone tab bar sit above the home indicator (env(safe-area-inset-bottom)).
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <LangProvider>
          <CartProvider>
            <FavProvider>
              {children}
              <MobileTabBar />
            </FavProvider>
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
