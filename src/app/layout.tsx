import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://courses.nanoschool.in';

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
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

import Chatbot from "@/components/common/Chatbot";

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
        <AuthProvider>
          <Toaster 
            position="top-center" 
            containerStyle={{ zIndex: 999999 }}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                borderRadius: '1.25rem',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '16px 28px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.05)',
                maxWidth: '450px',
                textAlign: 'center'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#3b82f6', // Sapphire blue for informational "error"
                  secondary: '#fff',
                },
              },
            }}
          />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
