import FAQClient from "@/components/screen/faq/clientfaq";
import FAQTitle from "@/components/screen/faq/faqtitle";

export const metadata = {
  title: "FAQ — Komunitas DCN",
  description: "Pertanyaan yang sering ditanyakan seputar Komunitas DCN",
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
];

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 mt-16">
      <header className="mb-8">
        <FAQTitle />
        <p className="text-neutral-400 max-w-3xl">
          Kumpulan jawaban cepat untuk membantu Anda memahami proyek Komunitas
          DCN.
        </p>
      </header>

      {/* Pasang komponen client di sini dan lewati data sebagai prop */}
      <FAQClient faqs={FAQS} />
    </main>
  );
}
