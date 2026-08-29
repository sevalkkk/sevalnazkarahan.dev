import { ImageResponse } from "next/og";

export const alt = "Seval Naz Karahan | Otomasyon Mühendisi & RPA Çözüm Mimarı";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "60px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Arka Plan Efektleri */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251, 70, 23, 0.22) 0%, rgba(10, 10, 10, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "20%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251, 70, 23, 0.12) 0%, rgba(10, 10, 10, 0) 70%)",
          }}
        />

        {/* Üst Bar: Durum & Etiket */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#FB4617",
              boxShadow: "0 0 16px #FB4617",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#FB4617",
            }}
          >
            // OTOMASYON MÜHENDİSİ & İŞ ANALİSTİ
          </span>
        </div>

        {/* Orta Alan: İsim & Anahtar Başlık */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "950px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
            }}
          >
            Seval Naz Karahan
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#a3a3a3",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            UiPath RPA, C#, REFramework, SAP ve Kurumsal Uçtan Uca Otonom Süreç Mimarisi
          </p>
        </div>

        {/* Alt Çubuk: Teknoloji Hapları & Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #262626",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {["UiPath RPA", "C# / .NET", "REFramework", "SAP Automation", "Doc Understanding"].map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: "#171717",
                  border: "1px solid #333333",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "14px",
                  color: "#d4d4d4",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#FB4617",
              letterSpacing: "0.5px",
            }}
          >
            sevalnazkarahan.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
