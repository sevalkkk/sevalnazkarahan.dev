import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Contact",
  description:
    "Seval Naz Karahan ile iletişime geçin. UiPath RPA projeleri, kurumsal süreç otomasyonu, C# entegrasyonları ve iş analizi işbirlikleri için doğrudan mesaj gönderin.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "İletişim — Seval Naz Karahan | Otomasyon Mühendisi & İş Analisti",
    description:
      "Kurumsal RPA projeleri, UiPath & C# otomasyon mimarileri ve iş analizi süreçleri için iletişime geçin.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
