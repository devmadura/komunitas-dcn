"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function NotFoundContent() {
  return (
    <>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-accent/20 via-secondary/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="relative mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent leading-none select-none">
            404
          </h1>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Search className="w-16 h-16 md:w-24 md:h-24 text-muted-foreground/50" />
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
            Pastikan URL yang kamu masukkan sudah benar.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-muted-foreground/30"
          >
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Halaman Sebelumnya
            </Link>
          </Button>
        </motion.div>

        {/* Fun Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Mungkin kamu mencari:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Beranda", href: "/" },
              { label: "FAQ", href: "/faq" },
            ].map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
