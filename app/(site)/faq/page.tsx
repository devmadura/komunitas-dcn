import FAQClient from "@/components/screen/faq/clientfaq";
import FAQTitle from "@/components/screen/faq/faqtitle";

export const metadata = {
  title: "FAQ | DCN UNIRA",
  description:
    "Pertanyaan yang sering ditanyakan seputar Komunitas DCN Universitas Madura",
};

const FAQS = [
  {
    id: "apa-itu-dcn",
    q: "Apa itu Komunitas DCN?",
    a: "Dicoding Community Network merupakan sebuah program kepemimpinan komunitas digital, yang memberi kesempatan bagi mahasiswa untuk mendirikan dan memimpin komunitas pembelajaran teknologi di kampusnya sendiri dengan dukungan dari Dicoding.",
  },
  {
    id: "gratis",
    q: "Apakah komunitas ini berbayar?",
    a: "Tidak. Program ini 100% gratis",
  },
  {
    id: "apa-itu-contributor",
    q: "Apa itu Contributor?",
    a: "Community Contributor adalah anggota aktif dalam komunitas yang mengikuti kegiatan, diskusi, dan belajar bersama melalui program Dicoding Community Network.",
  },
  {
    id: "siapa-saja",
    q: "Siapa saja yang bisa menjadi Community Contributor?",
    a: "Mahasiswa dari mana saja yang ingin ikut belajar teknologi bersama komunitas dapat bergabung sebagai Community Contributor.",
  },
  {
    id: "bagaimana",
    q: "Bagaimana cara menjadi Community Contributor?",
    a: "Kamu bisa bergabung melalui Community Builder di kampus/sekolahmu, atau mencari komunitas terdekat yang sudah aktif di Dicoding Community Network.",
  },
  {
    id: "apa-unira",
    q: "Apa itu UNIRA?",
    a: "Universitas Madura (UNIRA) adalah sebuah perguruan tinggi swasta yang terletak di Pamekasan, Madura, Indonesia. Didirikan pada tahun 1967, UNIRA menawarkan berbagai program studi salah satunya di bidang informatika fakultas teknik",
  },
];

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 mt-16">
      <header className="mb-8">
        <FAQTitle />
        <p className="text-neutral-400 max-w-3xl">
          Kumpulan jawaban cepat untuk membantu Anda memahami Komunitas DCN
          Universitas Madura.
        </p>
      </header>

      {/* Pasang komponen client di sini dan lewati data sebagai prop */}
      <FAQClient faqs={FAQS} />
    </main>
  );
}
