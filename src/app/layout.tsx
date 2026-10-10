import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { SitePlugins } from "@/components/chat/site-plugins";
import { loadSitePlugins } from "@/lib/plugins-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXTAUTH_URL?.startsWith("http")
  ? process.env.NEXTAUTH_URL
  : "https://linart.club";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LinArt Labs — Private IoT, Cloud & AI from Bavaria",
    template: "%s · LinArt Labs",
  },
  description:
    "LinArt Labs builds and hosts IoT platforms, smart-lock automation for rentals, private cloud and AI assistants on our own servers in Germany. No US cloud, no data resale.",
  applicationName: "LinArt Labs",
  keywords: [
    "LinArt",
    "IoT platform",
    "smart lock rental automation",
    "private cloud Germany",
    "AI consultant self-hosted",
    "Sensor Hub",
    "QR generator",
    "Bavaria",
  ],
  authors: [{ name: "Vladimir Linartas", url: SITE_URL }],
  openGraph: {
    type: "website",
    siteName: "LinArt Labs",
    title: "LinArt Labs — Private IoT, Cloud & AI from Bavaria",
    description:
      "IoT platform, smart-lock automation, private cloud and AI assistants — hosted on our own hardware in Germany.",
    url: SITE_URL,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "LinArt Labs" }],
    locale: "en_US",
    alternateLocale: ["de_DE", "ru_RU"],
  },
  twitter: {
    card: "summary",
    title: "LinArt Labs — Private IoT, Cloud & AI from Bavaria",
    description:
      "IoT platform, smart-lock automation, private cloud and AI assistants — hosted on our own hardware in Germany.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Сторонние скрипты настраиваются в /admin/plugins; пока список не сохраняли,
  // берётся консультант из AI_CONSULTANT_CLIENT_ID (пусто = ничего не грузим).
  const { plugins } = await loadSitePlugins();

  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
        <SitePlugins plugins={plugins} />
      </body>
    </html>
  );
}
