import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <ChatBubble />
      <Footer />
    </>
  );
}
