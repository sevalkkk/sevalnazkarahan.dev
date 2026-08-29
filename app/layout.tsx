// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import CursorStar from "./components/CursorStar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seval Naz Karahan | Otomasyon Mühendisi & İş Analisti",
  description: "Seval Naz Karahan — Otomasyon Mühendisi & İş Analisti. UiPath RPA, C#, REFramework, SAP, BOA Bankacılık ve Document Understanding alanlarında kurumsal uçtan uca otonom süreç mimarisi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <LanguageProvider>
          <CursorStar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}