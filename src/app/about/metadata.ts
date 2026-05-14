import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Our Story, Team & Philosophy",
  description:
    "Meet the team behind ArchiDesignSolutions. Founded in 1999 by Ar. Amit Sethi, our Indore-based architecture firm brings three decades of experience in architectural design, interior design, landscape, and sustainable building.",
  keywords: [
    "about ArchiDesignSolutions",
    "architecture firm Indore",
    "Amit Sethi architect",
    "Prakriti Sethi architect",
    "Archit Sethi architect",
    "architecture team India",
  ],
  openGraph: {
    title: "About ArchiDesignSolutions — Our Story, Team & Philosophy",
    description:
      "Founded in 1999, ArchiDesignSolutions brings three decades of architectural excellence from Indore, India.",
    url: "https://archidesignsolutions.com/about",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArchiDesignSolutions — About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ArchiDesignSolutions — Our Story, Team & Philosophy",
    description:
      "Founded in 1999, ArchiDesignSolutions brings three decades of architectural excellence from Indore, India.",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: "https://archidesignsolutions.com/about",
  },
};
