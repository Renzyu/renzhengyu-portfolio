import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Serif_SC } from "next/font/google";
import { PageTransitionProvider } from "@/components/layout/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "任政宇 | REN ZHENGYU · Visual Creator",
  description:
    "任政宇 · 商业影像创作者 + AI Creative Technologist · Cinematic Interactive Portfolio",
  openGraph: {
    title: "任政宇 | REN ZHENGYU",
    description: "Visual Creator · Cinematic Portfolio",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${playfair.variable} ${notoSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
