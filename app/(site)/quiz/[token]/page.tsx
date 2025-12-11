"use client";

import { useState, useEffect, use } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  urutan: number;
}

interface QuizData {
  session_id: string;
  expires_at: string;
  quiz: {
    id: string;
    judul: string;
    deskripsi: string | null;
    quiz_questions: Question[];
  };
}

interface QuizResult {
  skor: number;
  total_soal: number;
  persentase: number;
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [namaPeserta, setNamaPeserta] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    fetchQuizData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!quizData?.expires_at) return;

    const updateTimeLeft = () => {
      const diff = new Date(quizData.expires_at).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(diff / 1000));
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [quizData?.expires_at]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/quiz/session/${token}`);
      const data = await response.json();

      if (!response.ok) {
        if (data.expired) {
          setExpired(true);
        } else {
          setError(data.error || "Link tidak valid");
        }
        return;
      }

      setQuizData(data);
    } catch {
      setError("Gagal memuat kuis");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!namaPeserta.trim()) {
      toast({ title: "Nama peserta wajib diisi", variant: "destructive" });
      return;
    }

    const unanswered = quizData?.quiz.quiz_questions.filter(
      (q) => !answers[q.id]
    );
    if (unanswered && unanswered.length > 0) {
      toast({
        title: `Masih ada ${unanswered.length} soal yang belum dijawab`,
        description: "Harap jawab semua soal sebelum submit.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: quizData?.session_id,
          nama_peserta: namaPeserta,
          jawaban: answers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        toast({ title: data.error || "Gagal submit jawaban", variant: "destructive" });
      }
    } catch {
      toast({ title: "Gagal submit jawaban", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-md text-center border border-border">
          <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Link Kadaluwarsa
          </h1>
          <p className="text-muted-foreground">
            Link kuis ini sudah tidak berlaku. Silakan minta link baru kepada
            penyelenggara.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-md text-center border border-border">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-md text-center border border-border">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Kuis Selesai!
          </h1>
          <p className="text-muted-foreground mb-6">
            Terima kasih, {namaPeserta}!
          </p>

          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Nilai Anda</p>
            <p className="text-5xl font-bold mb-2">{result.persentase}</p>
            <p className="text-lg">
              {result.skor} dari {result.total_soal} soal benar
            </p>
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            {result.persentase >= 80 && "🎉 Luar biasa! Nilai sempurna!"}
            {result.persentase >= 60 &&
              result.persentase < 80 &&
              "👍 Bagus! Terus tingkatkan!"}
            {result.persentase < 60 && "💪 Tetap semangat belajar!"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 pt-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-lg p-6 mb-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {quizData?.quiz.judul}
              </h1>
              {quizData?.quiz.deskripsi && (
                <p className="text-muted-foreground mt-1">
                  {quizData.quiz.deskripsi}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {quizData?.quiz.quiz_questions.length} soal
              </p>
            </div>
            {timeLeft !== null && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  timeLeft < 600
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono font-medium">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-1">
              Nama Peserta *
            </label>
            <input
              type="text"
              value={namaPeserta}
              onChange={(e) => setNamaPeserta(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="Masukkan nama Anda"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {quizData?.quiz.quiz_questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-card rounded-xl shadow-lg p-6 border border-border"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-foreground font-medium">{q.pertanyaan}</p>
              </div>

              <div className="space-y-2 ml-11">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const optionKey =
                    `opsi_${opt.toLowerCase()}` as keyof Question;
                  const isSelected = answers[q.id] === opt;

                  return (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                        className="text-primary"
                      />
                      <span className="font-medium text-muted-foreground">
                        {opt}.
                      </span>
                      <span className="text-foreground">
                        {q[optionKey] as string}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>Progress pengerjaan</span>
            <span className="font-medium">
              {Object.keys(answers).length} /{" "}
              {quizData?.quiz.quiz_questions.length} soal dijawab
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(answers).length /
                    (quizData?.quiz.quiz_questions.length || 1)) *
                  100
                }%`,
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              !namaPeserta.trim() ||
              Object.keys(answers).length !==
                quizData?.quiz.quiz_questions.length
            }
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Mengirim..." : "Kirim Jawaban"}
          </button>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {Object.keys(answers).length !==
            quizData?.quiz.quiz_questions.length
              ? "Jawab semua soal untuk melanjutkan"
              : "Jawaban yang sudah dikirim tidak dapat diubah"}
          </p>
        </div>
      </div>
    </div>
  );
}
