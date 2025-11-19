"use client";
import Image from "next/image";
export default function PageMaitenace() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full relative">
        <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 via-cyan-400 to-violet-500 opacity-40 blur-3xl -z-10" />

        <div className="relative bg-slate-900/80 border border-slate-700/60 rounded-3xl px-8 py-10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-32 rounded-2xl bg-white flex items-center justify-center text-xs font-bold tracking-wide">
              <Image
                src="/logo500x500.png"
                alt="DCN Unira Logo"
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                welcome to
              </p>
              <h1 className="text-xl font-semibold tracking-tight">
                dcnunira<span className="text-cyan-400">.dev</span>
              </h1>
            </div>
          </div>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <span>Scheduled Maintenance</span>
          </div>

          {/* Main text */}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            We’re upgrading the DCN UNIRA experience.
          </h2>
          <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
            Saat ini{" "}
            <span className="font-medium text-slate-100">dcnunira.dev</span>{" "}
            sedang kami maintenance untuk menyiapkan fitur dan pengalaman baru
            buat kamu. Tenang, ini cuma sementara kok.
          </p>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
                Status
              </p>
              <p className="font-medium text-slate-100">Under Maintenance</p>
              <p className="text-xs text-slate-400 mt-1">
                Beberapa layanan mungkin tidak tersedia sementara waktu.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
                What’s happening
              </p>
              <p className="text-xs text-slate-300">
                Performance tuning, bug fixing, dan sedikit sentuhan UI baru 😉
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-xs text-slate-400">
              Butuh bantuan urgent?
              <br />
              <span className="text-slate-200">
                Contact:{" "}
                <span className="text-cyan-300">info@dcnunira.dev</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Follow updates</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/dcn.unira"
                  target="_blank"
                  className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 hover:border-cyan-400/60 hover:text-cyan-200 transition"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-slate-500">
            Psst… kalau kamu lihat halaman ini, artinya kita lagi serius
            ningkatin dcnunira buat kamu. See you on the other side 👨‍💻🚀
          </p>
        </div>
      </div>
    </main>
  );
}
