import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Architecture, Design & Sustainability Insights",
  description:
    "Read articles on sustainable architecture, interior design trends, green building practices, and urban planning insights from ArchiDesignSolutions.",
  keywords: [
    "architecture blog",
    "interior design trends",
    "sustainable architecture India",
    "green building blog",
    "urban planning insights",
    "IGBC green building",
  ],
  openGraph: {
    title: "Blog — ArchiDesignSolutions Design Insights",
    description:
      "Articles on sustainable architecture, interior design trends, green building, and urban planning.",
    url: "https://archidesignsolutions.com/blog",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchiDesignSolutions — Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — ArchiDesignSolutions Design Insights",
    description:
      "Articles on sustainable architecture, interior design trends, green building, and urban planning.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://archidesignsolutions.com/blog",
  },
};
