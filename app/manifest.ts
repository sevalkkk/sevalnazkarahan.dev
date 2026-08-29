import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seval Naz Karahan | Otomasyon Mühendisi & İş Analisti",
    short_name: "SNK Portfolio",
    description:
      "Seval Naz Karahan — UiPath RPA, C#, REFramework, SAP ve Kurumsal Otonom Süreç Mimarisi Portfolyosu",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
