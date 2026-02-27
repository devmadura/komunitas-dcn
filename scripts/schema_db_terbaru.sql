-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.absensi (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pertemuan_id uuid,
  kontributor_id uuid,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['hadir'::character varying, 'izin'::character varying, 'alpha'::character varying]::text[])),
  poin integer NOT NULL DEFAULT 0,
  keterangan text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT absensi_pkey PRIMARY KEY (id),
  CONSTRAINT absensi_pertemuan_id_fkey FOREIGN KEY (pertemuan_id) REFERENCES public.pertemuan(id),
  CONSTRAINT absensi_kontributor_id_fkey FOREIGN KEY (kontributor_id) REFERENCES public.kontributor(id)
);
CREATE TABLE public.admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  email character varying NOT NULL UNIQUE,
  nama character varying NOT NULL,
  role character varying DEFAULT 'co-admin'::character varying,
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  label character varying DEFAULT '''Core Team''::character varying'::character varying,
  photo_url text,
  photo_uuid text,
  social_media jsonb,
  slug text UNIQUE,
  bio text,
  skills ARRAY,
  is_active boolean DEFAULT true,
  join_date date,
  CONSTRAINT admins_pkey PRIMARY KEY (id),
  CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  konten text NOT NULL DEFAULT ''::text,
  excerpt text,
  cover_image text,
  cover_image_uuid text,
  penulis_id uuid NOT NULL,
  kategori text,
  tags ARRAY,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'pending'::text, 'revision'::text, 'published'::text])),
  catatan_revisi text,
  views integer NOT NULL DEFAULT 0,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_penulis_id_fkey FOREIGN KEY (penulis_id) REFERENCES public.admins(id),
  CONSTRAINT blog_posts_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.admins(id)
);
CREATE TABLE public.code_redeem (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  poin integer NOT NULL,
  max_usage integer NOT NULL,
  current_usage integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  expires_at timestamp without time zone,
  CONSTRAINT code_redeem_pkey PRIMARY KEY (id)
);
CREATE TABLE public.code_redeem_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code_id uuid,
  kontributor_id uuid,
  redeemed_at timestamp without time zone DEFAULT now(),
  CONSTRAINT code_redeem_usage_pkey PRIMARY KEY (id),
  CONSTRAINT code_redeem_usage_code_id_fkey FOREIGN KEY (code_id) REFERENCES public.code_redeem(id),
  CONSTRAINT code_redeem_usage_kontributor_id_fkey FOREIGN KEY (kontributor_id) REFERENCES public.kontributor(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  deskripsi text,
  tanggal date NOT NULL,
  waktu text,
  lokasi text,
  tipe text DEFAULT 'Event'::text,
  gambar text,
  gambar_uuid text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.galeri (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  cover_image text NOT NULL,
  cover_image_uuid text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT galeri_pkey PRIMARY KEY (id)
);
CREATE TABLE public.kontributor (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nim character varying NOT NULL UNIQUE,
  nama character varying NOT NULL,
  angkatan character varying NOT NULL,
  total_poin integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  prodi character varying,
  email character varying,
  CONSTRAINT kontributor_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pertemuan (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tanggal date NOT NULL,
  judul character varying NOT NULL,
  berita_acara text,
  created_at timestamp with time zone DEFAULT now(),
  has_sertifikat boolean DEFAULT false,
  CONSTRAINT pertemuan_pkey PRIMARY KEY (id)
);
CREATE TABLE public.push_subscriptions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quiz (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quiz_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid,
  pertanyaan text NOT NULL,
  opsi_a text NOT NULL,
  opsi_b text NOT NULL,
  opsi_c text NOT NULL,
  opsi_d text NOT NULL,
  jawaban_benar character NOT NULL,
  urutan integer NOT NULL,
  CONSTRAINT quiz_questions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id)
);
CREATE TABLE public.quiz_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quiz_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_sessions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quiz(id)
);
CREATE TABLE public.quiz_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid,
  nama_peserta text NOT NULL,
  jawaban jsonb NOT NULL,
  skor integer NOT NULL,
  total_soal integer NOT NULL,
  submitted_at timestamp with time zone DEFAULT now(),
  poin integer DEFAULT 0,
  CONSTRAINT quiz_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_submissions_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.quiz_sessions(id)
);
CREATE TABLE public.sertifikat (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  kontributor_id uuid,
  nomor_sertifikat character varying NOT NULL UNIQUE,
  tipe character varying NOT NULL CHECK (tipe::text = ANY (ARRAY['pertemuan'::character varying, 'quiz'::character varying]::text[])),
  pertemuan_id uuid,
  tanggal_terbit timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sertifikat_pkey PRIMARY KEY (id),
  CONSTRAINT sertifikat_kontributor_id_fkey FOREIGN KEY (kontributor_id) REFERENCES public.kontributor(id),
  CONSTRAINT sertifikat_pertemuan_id_fkey FOREIGN KEY (pertemuan_id) REFERENCES public.pertemuan(id)
);