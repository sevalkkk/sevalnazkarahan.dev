// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import CursorStar from "./components/CursorStar";
import JsonLd from "./components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sevalnazkarahan.dev";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seval Naz Karahan | Otomasyon Mühendisi & İş Analisti",
    template: "%s | Seval Naz Karahan",
  },
  description:
    "Seval Naz Karahan — Otomasyon Mühendisi & İş Analisti. UiPath RPA, C#, REFramework, SAP, BOA Bankacılık ve Document Understanding alanlarında kurumsal uçtan uca otonom süreç mimarisi.",
  keywords: [
    "Seval Naz Karahan",
    "Seval Karahan",
    "Otomasyon Mühendisi",
    "Automation Engineer",
    "İş Analisti",
    "Business Analyst",
    "RPA Developer",
    "RPA Geliştirici",
    "UiPath",
    "UiPath Studio",
    "UiPath Orchestrator",
    "C#",
    ".NET",
    "REFramework",
    "SAP Otomasyonu",
    "BOA Bankacılık",
    "Document Understanding",
    "Process Mining",
    "Süreç Madenciliği",
    "Robotic Process Automation",
    "Robotik Süreç Otomasyonu",
    "Enterprise Automation",
    "Yazılım Portfolyo",
  ],
  authors: [{ name: "Seval Naz Karahan", url: siteUrl }],
  creator: "Seval Naz Karahan",
  publisher: "Seval Naz Karahan",
  applicationName: "Seval Naz Karahan Portfolio",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png" },
    ],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
      "en-US": "/?lang=en",
    },
  },
  openGraph: {
    title: "Seval Naz Karahan | Otomasyon Mühendisi & İş Analisti",
    description:
      "UiPath RPA, C#, REFramework, SAP ve BOA Bankacılık süreçlerinde uzmanlaşmış uçtan uca kurumsal otonom süreç mimarı Seval Naz Karahan'ın portfolyosu.",
    url: siteUrl,
    siteName: "Seval Naz Karahan — Portfolyo",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seval Naz Karahan | Otomasyon Mühendisi & İş Analisti",
    description:
      "UiPath RPA, C#, REFramework, SAP ve kurumsal otonom süreç mimarisi.",
    creator: "@sevalnazkarahan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <LanguageProvider>
          <CursorStar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}