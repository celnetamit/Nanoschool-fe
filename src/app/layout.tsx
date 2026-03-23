import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://nanoschool.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NanoSchool - Advanced AI, Biotech & Nanotech Education",
    template: "%s | NanoSchool",
  },
  description: "India's leading platform for hands-on training in Artificial Intelligence, Biotechnology, and Nanotechnology. Expert-led workshops and professional certification programs.",
  keywords: [
    "AI courses India", 
    "Biotechnology workshops", 
    "Nanotechnology certification", 
    "hands-on AI training", 
    "advanced biotech education", 
    "nanoscience workshops for students",
    "professional AI certification",
    "deep tech education India"
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: "NanoSchool" }],
  creator: "NanoSchool",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "NanoSchool",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NanoSchool - Advanced Tech Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nanoschool",
    creator: "@nanoschool",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NanoSchool",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "India's leading platform for hands-on training in AI, Biotech, and Nanotechnology.",
    "sameAs": [
      "https://twitter.com/nanoschool",
      "https://linkedin.com/company/nanoschool",
      "https://facebook.com/nanoschool"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NanoSchool",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
