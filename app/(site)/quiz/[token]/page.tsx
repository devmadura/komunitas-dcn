"use client";

import { useState, useEffect, use } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

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
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
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
        } else if (data.already_submitted) {
          setAlreadySubmitted(true);
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
      alert("Nama peserta wajib diisi");
      return;
    }

    const unanswered = quizData?.quiz.quiz_questions.filter(
      (q) => !answers[q.id]
    );
    if (unanswered && unanswered.length > 0) {
      if (
        !confirm(
          `Masih ada ${unanswered.length} soal yang belum dijawab. Lanjutkan submit?`
        )
      ) {
        return;
      }
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
        alert(data.error || "Gagal submit jawaban");
      }
    } catch {
      alert("Gagal submit jawaban");
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Link Kadaluarsa
          </h1>
          <p className="text-gray-600">
            Link kuis ini sudah tidak berlaku. Silakan minta link baru kepada
            penyelenggara.
          </p>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-50 to-orange-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sudah Dikerjakan
          </h1>
          <p className="text-gray-600">
            Kuis ini sudah pernah dikerjakan sebelumnya.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kuis Selesai!
          </h1>
          <p className="text-gray-600 mb-6">Terima kasih, {namaPeserta}!</p>

          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Nilai Anda</p>
            <p className="text-5xl font-bold mb-2">{result.persentase}</p>
            <p className="text-lg">
              {result.skor} dari {result.total_soal} soal benar
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
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
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {quizData?.quiz.judul}
              </h1>
              {quizData?.quiz.deskripsi && (
                <p className="text-gray-600 mt-1">{quizData.quiz.deskripsi}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {quizData?.quiz.quiz_questions.length} soal
              </p>
            </div>
            {timeLeft !== null && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  timeLeft < 300
                    ? "bg-red-100 text-red-700"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Peserta *
            </label>
            <input
              type="text"
              value={namaPeserta}
              onChange={(e) => setNamaPeserta(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Masukkan nama Anda"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {quizData?.quiz.quiz_questions.map((q, index) => (
            <div key={q.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-gray-900 font-medium">{q.pertanyaan}</p>
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
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                        className="text-indigo-600"
                      />
                      <span className="font-medium text-gray-700">{opt}.</span>
                      <span className="text-gray-800">
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
          <button
            onClick={handleSubmit}
            disabled={submitting || !namaPeserta.trim()}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Mengirim..." : "Kirim Jawaban"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            Jawaban yang sudah dikirim tidak dapat diubah
          </p>
        </div>
      </div>
    </div>
  );
}
