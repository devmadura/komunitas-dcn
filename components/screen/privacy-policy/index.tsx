"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Mail,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: Eye,
    title: "Informasi yang Kami Kumpulkan",
    content: [
      "Informasi pribadi seperti nama, email, dan nomor telepon saat Anda mendaftar sebagai anggota komunitas.",
      "Data akademik seperti nama universitas, jurusan, dan tahun angkatan untuk keperluan verifikasi keanggotaan.",
      "Informasi aktivitas seperti kehadiran event, partisipasi dalam program, dan pencapaian di komunitas.",
    ],
  },
  {
    icon: Database,
    title: "Penggunaan Informasi",
    content: [
      "Memverifikasi dan mengelola keanggotaan Anda di Komunitas DCN UNIRA.",
      "Mengirimkan informasi terkait event, program, dan kegiatan komunitas.",
      "Menerbitkan sertifikat digital untuk kegiatan yang Anda ikuti.",
      "Meningkatkan layanan dan pengalaman pengguna di platform kami.",
      "Berkomunikasi dengan Anda terkait update komunitas dan program Dicoding.",
    ],
  },
  {
    icon: Lock,
    title: "Keamanan Data",
    content: [
      "Kami menerapkan enkripsi SSL/TLS untuk melindungi transfer data.",
      "Data disimpan di server yang aman dengan akses terbatas.",
      "Kami melakukan backup data secara berkala untuk mencegah kehilangan data.",
      "Akses ke data pribadi dibatasi hanya untuk pengurus komunitas yang berwenang.",
    ],
  },
  {
    icon: UserCheck,
    title: "Hak Pengguna",
    content: [
      "Anda berhak mengakses, memperbarui, atau menghapus data pribadi Anda.",
      "Anda dapat memilih untuk berhenti berlangganan dari komunikasi kami kapan saja.",
      "Anda berhak meminta salinan data pribadi yang kami simpan.",
      "Anda dapat mengajukan keberatan atas pemrosesan data tertentu.",
    ],
  },
  {
    icon: Shield,
    title: "Berbagi dengan Pihak Ketiga",
    content: [
      "Kami tidak menjual data pribadi Anda kepada pihak ketiga.",
      "Data dapat dibagikan dengan Dicoding Indonesia sebagai penyelenggara program DCN.",
      "Kami dapat membagikan data jika diwajibkan oleh hukum yang berlaku.",
      "Partner event dapat menerima data peserta untuk keperluan penyelenggaraan acara.",
    ],
  },
  {
    icon: Calendar,
    title: "Retensi Data",
    content: [
      "Data keanggotaan disimpan selama Anda masih terdaftar sebagai anggota aktif.",
      "Data sertifikat disimpan secara permanen untuk keperluan verifikasi.",
      "Data yang tidak diperlukan akan dihapus dalam waktu 2 tahun setelah ketidak aktifan.",
      "Anda dapat meminta penghapusan data lebih awal dengan menghubungi kami.",
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

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

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
              className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-2xl mb-6 shadow-lg"
            >
              <Shield className="w-10 h-10 dark:text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold mb-3 bg-linear-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent py-2"
            >
              Kebijakan Privasi
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Kami berkomitmen untuk melindungi privasi dan data pribadi Anda.
              Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
              dan melindungi informasi Anda.
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
            {sections.map((section, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 bg-linear-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors duration-300">
                        <section.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                        {section.title}
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
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Contact Section */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 sm:p-8 border border-primary/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Hubungi Kami
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini
                    atau ingin menggunakan hak-hak Anda, silakan hubungi kami
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

            {/* Notice */}
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20"
            >
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Kebijakan Privasi ini dapat berubah sewaktu-waktu. Kami akan
                memberitahu Anda tentang perubahan material melalui email atau
                pemberitahuan di website kami. Penggunaan berkelanjutan atas
                layanan kami setelah perubahan berarti Anda menyetujui kebijakan
                yang diperbarui.
              </p>
            </motion.div>

            {/* Links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center pt-8"
            >
              <Link
                href="/terms-of-service"
                className="inline-flex items-center gap-2 px-6 py-3  text-primary rounded-full font-medium transition-colors duration-300"
              >
                Lihat Syarat & Ketentuan
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
