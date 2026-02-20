import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nanoschool.in'),
  title: {
    default: "NanoSchool - Advanced AI, Biotech & Nanotech Education",
    template: "%s | NanoSchool",
  },
  description: "India's leading platform for hands-on training in Artificial Intelligence, Biotechnology, and Nanotechnology. Expert-led workshops and certification programs.",
  keywords: ["AI", "Biotechnology", "Nanotechnology", "Education", "Workshops", "Courses", "Certification", "India"],
  authors: [{ name: "NanoSchool" }],
  creator: "NanoSchool",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nanoschool.in",
    siteName: "NanoSchool",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists or use a default
        width: 1200,
        height: 630,
        alt: "NanoSchool",
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
  return (
    <html lang="en" suppressHydrationWarning={true}>
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
