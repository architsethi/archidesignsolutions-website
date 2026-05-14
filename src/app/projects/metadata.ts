import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Architectural, Interior & Landscape Design Portfolio",
  description:
    "Explore our portfolio of architectural design, interior design, landscape, green building, town planning, and MEP engineering projects across India. Filter by discipline to see our work.",
  keywords: [
    "architecture portfolio India",
    "interior design projects",
    "landscape design projects",
    "green building projects",
    "town planning projects Indore",
    "MEP engineering projects",
    "residential architecture",
    "commercial architecture",
  ],
  openGraph: {
    title: "Projects — ArchiDesignSolutions Portfolio",
    description:
      "Explore our portfolio spanning architectural design, interior design, landscape, green building, town planning, and more.",
    url: "https://archidesignsolutions.com/projects",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchiDesignSolutions — Projects Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — ArchiDesignSolutions Portfolio",
    description:
      "Explore our portfolio spanning architectural design, interior design, landscape, green building, town planning, and more.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://archidesignsolutions.com/projects",
  },
};
