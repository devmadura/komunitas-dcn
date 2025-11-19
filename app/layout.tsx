import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dicoding Community Network Universitas Madura",
  description: "dicoding community network unira official website",
  authors: [
    {
      name: "Abrordc",
      url: "https://linkedin.com/in/moh-abroril-huda",
    },
  ],
  keywords: [
    "dcnunira",
    "dcn unira",
    "dcn",
    "dicoding community network",
    "komunitas dcn",
    "universitas madura",
  ],
  applicationName: "Dicoding Community Network Universitas Madura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
