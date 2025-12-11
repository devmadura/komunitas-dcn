import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Types
export interface Kontributor {
  id: string;
  nim: string;
  nama: string;
  email?: string;
  angkatan: string;
  total_poin: number;
  created_at: string;
}

export interface Pertemuan {
  id: string;
  tanggal: string;
  judul: string;
  berita_acara: string | null;
  has_sertifikat: boolean;
  created_at: string;
}

export interface Absensi {
  id: string;
  pertemuan_id: string;
  kontributor_id: string;
  status: "hadir" | "izin" | "alpha";
  poin: number;
  keterangan: string | null;
  created_at: string;
  kontributor?: Kontributor;
}

export interface AbsensiWithDetails extends Absensi {
  kontributor: Kontributor;
  pertemuan: Pertemuan;
}

// Quiz Types
export interface Quiz {
  id: string;
  judul: string;
  deskripsi: string | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  jawaban_benar: "A" | "B" | "C" | "D";
  urutan: number;
}

export interface QuizSession {
  id: string;
  quiz_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface QuizSubmission {
  id: string;
  session_id: string;
  nama_peserta: string;
  jawaban: Record<string, string>;
  skor: number;
  total_soal: number;
  submitted_at: string;
}

export interface QuizWithQuestions extends Quiz {
  quiz_questions: QuizQuestion[];
}

// Sertifikat Types
export interface Sertifikat {
  id: string;
  kontributor_id: string;
  nomor_sertifikat: string;
  tipe: "pertemuan" | "quiz";
  pertemuan_id?: string;
  tanggal_terbit: string;
  created_at: string;
}

export interface SertifikatWithDetails extends Sertifikat {
  kontributor: Kontributor;
  pertemuan?: Pertemuan;
}

// Code Redeem Types
export interface CodeRedeem {
  id: string;
  code: string;
  poin: number;
  max_usage: number;
  current_usage: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface CodeRedeemUsage {
  id: string;
  code_id: string;
  kontributor_id: string;
  redeemed_at: string;
}

export interface CodeRedeemWithUsage extends CodeRedeem {
  code_redeem_usage: CodeRedeemUsage[];
}
