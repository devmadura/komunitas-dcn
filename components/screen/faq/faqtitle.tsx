"use client";
import { motion } from "framer-motion";

export default function FAQTitle() {
  return (
    <motion.h1
      className="text-4xl sm:text-5xl font-extrabold mb-3 bg-linear-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent py-2"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      FAQ — Pertanyaan yang Sering Diajukan
    </motion.h1>
  );
}
