import { Metadata } from "next";
import PrivacyPolicyPage from "@/components/screen/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy | DCN UNIRA",
  description:
    "Kebijakan Privasi DCN Universitas Madura. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
