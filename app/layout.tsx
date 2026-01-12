import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const siteUrl = "https://dcnunira.dev";
const siteName = "DCN UNIRA - Dicoding Community Network Universitas Madura";
const siteDescription =
  "Komunitas developer resmi Dicoding di Universitas Madura. Bergabung untuk belajar, berbagi, dan berkembang bersama dalam dunia teknologi dan pemrograman.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s - DCN UNIRA",
  },
  description: siteDescription,
  authors: [
    {
      name: "Abrordc",
      url: "https://linkedin.com/in/moh-abroril-huda",
    },
  ],
  creator: "DCN UNIRA Team Developer",
  publisher: "Dicoding Community Network Universitas Madura",
  keywords: [
    "dcnunira",
    "dcn unira",
    "dcn",
    "dicoding community network",
    "komunitas dcn",
    "universitas madura",
    "komunitas developer",
    "belajar programming",
    "komunitas teknologi madura",
    "developer indonesia",
    "dicoding indonesia",
    "unira",
    "dicoding community network universitas madura",
  ],
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
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DCN UNIRA - Dicoding Community Network Universitas Madura",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DCN UNIRA",
  alternateName: "Dicoding Community Network Universitas Madura",
  url: siteUrl,
  logo: `${siteUrl}/logo500x500.png`,
  description: siteDescription,
  sameAs: ["https://instagram.com/dcn.unira"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@dcnunira.dev",
    contactType: "customer service",
    availableLanguage: ["Indonesian", "English"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pamekasan",
    addressRegion: "Jawa Timur",
    addressCountry: "ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
