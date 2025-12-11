"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Scale,
  Award,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Mail,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: Users,
    title: "Keanggotaan Komunitas",
    content: [
      "Keanggotaan di DCN UNIRA terbuka untuk semua mahasiswa UNIRA yang tertarik dengan teknologi dan pemrograman.",
      "Pendaftaran dilakukan melalui platform resmi yang disediakan oleh komunitas.",
      "Anggota wajib memberikan informasi yang akurat dan valid saat pendaftaran.",
      "Keanggotaan bersifat personal dan tidak dapat dipindahtangankan.",
      "Komunitas berhak menolak atau mencabut keanggotaan tanpa pemberitahuan jika ditemukan pelanggaran.",
    ],
  },
  {
    icon: CheckCircle,
    title: "Hak Anggota",
    content: [
      "Mengikuti seluruh kegiatan dan event yang diselenggarakan oleh DCN UNIRA.",
      "Mengakses materi pembelajaran dan resource yang disediakan komunitas.",
      "Mendapatkan sertifikat digital untuk kegiatan yang diikuti dan diselesaikan.",
      "Berpartisipasi dalam diskusi dan forum komunitas.",
      "Mendapatkan informasi terkait program dan kesempatan dari Dicoding Indonesia.",
      "Menggunakan fasilitas dan layanan yang disediakan oleh komunitas.",
    ],
  },
  {
    icon: XCircle,
    title: "Kewajiban dan Larangan",
    content: [
      "Menjaga nama baik komunitas, universitas, dan Dicoding Indonesia.",
      "Tidak melakukan tindakan yang merugikan anggota lain atau komunitas.",
      "Dilarang menyebarkan konten yang mengandung SARA, pornografi, atau ujaran kebencian.",
      "Dilarang melakukan plagiarisme atau mengklaim karya orang lain.",
      "Dilarang menggunakan sertifikat atau identitas komunitas untuk kepentingan yang merugikan.",
      "Wajib mengikuti kode etik dan tata tertib yang berlaku di komunitas.",
    ],
  },
  {
    icon: Award,
    title: "Sertifikat Digital",
    content: [
      "Sertifikat diterbitkan untuk kegiatan yang memenuhi kriteria yang ditetapkan.",
      "Sertifikat memiliki nomor unik yang dapat diverifikasi melalui website resmi.",
      "Pemalsuan atau manipulasi sertifikat adalah pelanggaran serius dan akan ditindak tegas.",
      "Komunitas berhak mencabut sertifikat jika ditemukan kecurangan atau pelanggaran.",
      "Sertifikat tidak dapat diperjual belikan atau dipindah tangankan.",
    ],
  },
  {
    icon: Scale,
    title: "Hak Kekayaan Intelektual",
    content: [
      "Seluruh konten, logo, dan materi di website ini adalah milik DCN UNIRA dan/atau Dicoding Indonesia.",
      "Penggunaan logo atau identitas komunitas harus mendapat izin tertulis.",
      "Karya yang dibuat oleh anggota tetap menjadi hak milik anggota yang bersangkutan.",
      "Komunitas berhak menggunakan dokumentasi kegiatan untuk keperluan promosi dan publikasi.",
      "Dilarang menggunakan konten komunitas untuk kepentingan komersial tanpa izin.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Sanksi Pelanggaran",
    content: [
      "Peringatan tertulis untuk pelanggaran ringan.",
      "Pembatasan akses ke layanan atau kegiatan tertentu.",
      "Pencabutan keanggotaan untuk pelanggaran berat atau berulang.",
      "Pencabutan sertifikat yang telah diterbitkan jika terbukti ada kecurangan.",
      "Tindakan hukum jika pelanggaran menyangkut aspek legal.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Perubahan Layanan",
    content: [
      "Komunitas berhak mengubah, menghentikan, atau memodifikasi layanan kapan saja.",
      "Perubahan signifikan akan diinformasikan melalui kanal komunikasi resmi.",
      "Komunitas tidak bertanggung jawab atas kerugian akibat perubahan atau penghentian layanan.",
      "Fitur dan program dapat berubah sesuai dengan kebijakan Dicoding Indonesia.",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-secondary/5 via-primary/5 to-accent/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-secondary to-primary rounded-2xl mb-6 shadow-lg"
            >
              <FileText className="w-10 h-10 dark:text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold mb-3 bg-linear-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent py-2"
            >
              Syarat & Ketentuan
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Dengan menggunakan layanan DCN UNIRA, Anda menyetujui syarat dan
              ketentuan berikut. Harap baca dengan seksama sebelum menggunakan
              layanan kami.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground"
            >
              <Calendar className="w-4 h-4" />
              <span>Terakhir diperbarui: Desember 2025</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Introduction */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-primary/10"
            >
              <h2 className="text-xl font-bold text-foreground mb-3">
                Pendahuluan
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                DCN UNIRA (Dicoding Community Network Universitas Madura) adalah
                komunitas pembelajaran teknologi yang merupakan bagian dari
                program Dicoding Community Network yang diselenggarakan oleh
                Dicoding Indonesia. Syarat dan ketentuan ini mengatur hubungan
                antara anggota dengan komunitas dan penggunaan seluruh layanan
                yang disediakan.
              </p>
            </motion.div>

            {sections.map((section, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 hover:shadow-lg hover:border-secondary/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 bg-linear-to-br from-secondary/10 to-primary/10 rounded-xl flex items-center justify-center group-hover:from-secondary/20 group-hover:to-primary/20 transition-colors duration-300">
                        <section.icon className="w-6 h-6 text-secondary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Disclaimer */}
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                    Batasan Tanggung Jawab
                  </h2>
                  <ul className="space-y-3">
                    {[
                      'Layanan disediakan "sebagaimana adanya" tanpa jaminan apapun.',
                      "Komunitas tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan layanan.",
                      "Keputusan dan tindakan yang diambil berdasarkan informasi dari komunitas sepenuhnya menjadi tanggung jawab pengguna.",
                      "Komunitas tidak menjamin ketersediaan layanan secara terus-menerus tanpa gangguan.",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-secondary/5 via-primary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-secondary/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-secondary to-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Pertanyaan atau Keluhan
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan
                    ini atau ingin menyampaikan keluhan, silakan hubungi kami
                    melalui:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Email:</strong>{" "}
                      info@dcnunira.dev
                    </p>
                    <p>
                      <strong className="text-foreground">Instagram:</strong>{" "}
                      @dcn.unira
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Agreement Notice */}
            <motion.div
              variants={itemVariants}
              className="text-center p-6 bg-muted/50 rounded-2xl"
            >
              <p className="text-muted-foreground">
                Dengan mendaftar dan menggunakan layanan DCN UNIRA, Anda
                menyatakan telah membaca, memahami, dan menyetujui seluruh
                Syarat dan Ketentuan ini beserta{" "}
                <Link
                  href="/privacy-policy"
                  className="text-primary hover:underline font-medium"
                >
                  Kebijakan Privasi
                </Link>{" "}
                kami.
              </p>
            </motion.div>

            {/* Links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center pt-8"
            >
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 px-6 py-3 text-secondary rounded-full font-medium transition-colors duration-300"
              >
                Lihat Kebijakan Privasi
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
