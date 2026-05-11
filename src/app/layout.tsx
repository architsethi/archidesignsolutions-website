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

export const metadata: Metadata = {
  title: "ArchiDesignSolutions | Architectural & Interior Design Solutions",
  description:
    "Award-winning architecture, interior design & urban planning — crafted for India and beyond. Three decades of expertise across eight specialised disciplines.",
  keywords: [
    "architecture",
    "interior design",
    "master planning",
    "green building",
    "landscape design",
    "Indore",
    "India",
    "ArchiDesignSolutions",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ArchiDesignSolutions | Architectural & Interior Design Solutions",
    description:
      "Award-winning architecture, interior design & urban planning — crafted for India and beyond.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body style={{ fontFamily: "var(--font-hanken), var(--font-primary)" }}>
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}
