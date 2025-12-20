import { Metadata } from "next";
import PrivacyPolicyPage from "@/components/screen/privacy-policy";

const siteUrl = "https://dcnunira.dev";
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Kebijakan Privasi DCN Universitas Madura. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  openGraph: {
    title: "Privacy Policy | DCN UNIRA",
    description:
      "Kebijakan Privasi DCN Universitas Madura. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
    type: "website",
    url: `${siteUrl}/privacy-policy`,
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy  | DCN UNIRA",
    description:
      "Kebijakan Privasi DCN Universitas Madura. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  },
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
