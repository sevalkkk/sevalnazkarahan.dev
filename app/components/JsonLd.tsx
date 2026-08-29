export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://sevalnazkarahan.dev/#person",
    name: "Seval Naz Karahan",
    alternateName: ["Seval Karahan", "Seval Naz"],
    jobTitle: "Otomasyon Mühendisi & İş Analisti | Automation Engineer & Business Analyst",
    url: "https://sevalnazkarahan.dev",
    image: "https://sevalnazkarahan.dev/profile.jpg",
    email: "mailto:sevalnazkarahan@gmail.com",
    gender: "https://schema.org/Female",
    nationality: {
      "@type": "Country",
      name: "Turkey",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "İzmir",
      addressCountry: "TR",
    },
    sameAs: [
      "https://www.linkedin.com/in/seval-naz-karahan-188525210/",
    ],
    knowsAbout: [
      "Robotic Process Automation (RPA)",
      "UiPath Studio & Orchestrator",
      "C# & .NET Programming",
      "REFramework Architecture",
      "SAP Automation (BAPI & GUI Scripting)",
      "BOA Banking Platform & Intertech",
      "UiPath Document Understanding (AI/ML OCR)",
      "Business Analysis & Process Mapping",
      "Process Mining & Optimization",
      "Enterprise Solution Architecture",
      "SQL & Database Querying",
      "RESTful API & Webhook Integrations",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sevalnazkarahan.dev/#website",
    url: "https://sevalnazkarahan.dev",
    name: "Seval Naz Karahan | Portfolio",
    description:
      "Seval Naz Karahan — Otomasyon Mühendisi & İş Analisti. UiPath RPA, C#, REFramework, SAP ve kurumsal otonom süreç mimarisi portfolyosu.",
    publisher: {
      "@id": "https://sevalnazkarahan.dev/#person",
    },
    inLanguage: ["tr-TR", "en-US"],
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://sevalnazkarahan.dev/#webpage",
    url: "https://sevalnazkarahan.dev",
    name: "Seval Naz Karahan — Otomasyon Mühendisi & İş Analisti Portfolyosu",
    isPartOf: {
      "@id": "https://sevalnazkarahan.dev/#website",
    },
    mainEntity: {
      "@id": "https://sevalnazkarahan.dev/#person",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa / Home",
          item: "https://sevalnazkarahan.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "İletişim / Contact",
          item: "https://sevalnazkarahan.dev/contact",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}
