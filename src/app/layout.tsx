import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import ShellWrapper from "@/components/ShellWrapper";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://archidesignsolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ArchiDesignSolutions | Architecture, Interior Design & Urban Planning in India",
    template: "%s | ArchiDesignSolutions",
  },
  description:
    "Award-winning architecture, interior design & urban planning firm in Indore, India. Three decades of expertise across architectural design, interior design, landscape, green building, town planning, MEP engineering, branding & project management.",
  keywords: [
    "architecture firm Indore",
    "interior design India",
    "urban planning",
    "green building consultants",
    "landscape design",
    "MEP engineering",
    "town planning India",
    "architectural design services",
    "IGBC certified",
    "ArchiDesignSolutions",
    "Amit Sethi architect",
    "residential architecture Indore",
    "commercial architecture India",
    "sustainable architecture",
    "branding for architects",
    "project management construction",
  ],
  authors: [{ name: "ArchiDesignSolutions", url: siteUrl }],
  creator: "ArchiDesignSolutions",
  publisher: "ArchiDesignSolutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "ArchiDesignSolutions | Architecture, Interior Design & Urban Planning",
    description:
      "Award-winning architecture, interior design & urban planning firm in Indore, India. Three decades of expertise across eight specialised disciplines.",
    url: siteUrl,
    siteName: "ArchiDesignSolutions",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchiDesignSolutions — Architecture, Interior Design & Urban Planning",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArchiDesignSolutions | Architecture, Interior Design & Urban Planning",
    description:
      "Award-winning architecture, interior design & urban planning firm in Indore, India.",
    images: ["/images/og-image.png"],
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
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "google508cf597c4714e5f",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "ArchiDesignSolutions",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/images/og-image.png`,
    description:
      "Award-winning architecture, interior design & urban planning firm in Indore, India with three decades of expertise.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "208B, Prakriti Corporate, Y.N. Road, New Palasia",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      postalCode: "452001",
      addressCountry: "IN",
    },
    telephone: "+91-731-4045559",
    email: "archidesignsolutions@gmail.com",
    foundingDate: "1999",
    founder: {
      "@type": "Person",
      name: "Ar. Amit Sethi",
      jobTitle: "Founder & Principal Architect",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: [
      "Architectural Design",
      "Interior Design",
      "Landscape Design",
      "Green Building Consulting",
      "Town Planning",
      "MEP Engineering",
      "Branding & Promotion",
      "Project Management",
    ],
    sameAs: [],
  };

  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-hanken), var(--font-primary)" }}>
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}
