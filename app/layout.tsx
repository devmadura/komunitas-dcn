import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
