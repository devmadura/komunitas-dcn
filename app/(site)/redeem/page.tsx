"use client";

import { useState } from "react";
import { Gift, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RedeemResult {
  nama: string;
  poin_didapat: number;
  total_poin: number;
}

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [nim, setNim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RedeemResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/code-redeem/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, nim }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        setCode("");
        setNim("");
      } else {
        toast({
          title: data.error || "Gagal redeem code",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Terjadi kesalahan, silahkan coba lagi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-border">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Redeem Berhasil!
          </h1>
          <p className="text-muted-foreground mb-6">Selamat, {result.nama}!</p>

          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Poin Didapat</p>
            <p className="text-5xl font-bold mb-2">+{result.poin_didapat}</p>
            <p className="text-lg">
              Total poin kamu sekarang: {result.total_poin}
            </p>
          </div>

          <button
            onClick={() => setResult(null)}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Redeem Code Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24">
      <div className="bg-card rounded-xl shadow-lg p-8 max-w-md w-full border border-border">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Redeem Code</h1>
          <p className="text-muted-foreground mt-2">
            Masukkan code dan NIM untuk mendapatkan poin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Code Redeem
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Masukkan code"
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground font-mono text-lg tracking-wider"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              NIM
            </label>
            <input
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Masukkan NIM"
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim() || !nim.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Memproses...
              </span>
            ) : (
              "Redeem Sekarang"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pastikan NIM kamu sudah terdaftar di sistem DCN
        </p>
      </div>
    </div>
  );
}
