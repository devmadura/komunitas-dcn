import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Types
export interface Kontributor {
  id: string;
  nim: string;
  nama: string;
  angkatan: string;
  total_poin: number;
  created_at: string;
}

export interface Pertemuan {
  id: string;
  tanggal: string;
  judul: string;
  berita_acara: string | null;
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
