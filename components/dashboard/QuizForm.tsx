"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { Quiz, QuizQuestion } from "@/lib/supabase";

interface QuizFormProps {
  quiz: Quiz | null;
  manageQuestions?: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface QuestionForm {
  id?: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  jawaban_benar: "A" | "B" | "C" | "D";
  urutan: number;
  isNew?: boolean;
}

export default function QuizForm({
  quiz,
  manageQuestions = false,
  onClose,
  onSaved,
}: QuizFormProps) {
  const [judul, setJudul] = useState(quiz?.judul || "");
  const [deskripsi, setDeskripsi] = useState(quiz?.deskripsi || "");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "questions">(
    manageQuestions ? "questions" : "info"
  );
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(
    quiz?.id || null
  );

  useEffect(() => {
    if (currentQuizId) {
      fetchQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuizId]);

  const fetchQuestions = async () => {
    if (!currentQuizId) return;
    try {
      const response = await fetch(`/api/quiz/${currentQuizId}/questions`);
      const data = await response.json();
      setQuestions(
        Array.isArray(data)
          ? data.map((q: QuizQuestion) => ({ ...q, isNew: false }))
          : []
      );
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSaveQuiz = async () => {
    if (!judul.trim()) {
      alert("Judul kuis wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const url = currentQuizId ? `/api/quiz/${currentQuizId}` : "/api/quiz";
      const method = currentQuizId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, deskripsi }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!currentQuizId) {
          setCurrentQuizId(data.id);
          setActiveTab("questions");
        } else {
          onSaved();
        }
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Gagal menyimpan kuis");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        pertanyaan: "",
        opsi_a: "",
        opsi_b: "",
        opsi_c: "",
        opsi_d: "",
        jawaban_benar: "A",
        urutan: questions.length + 1,
        isNew: true,
      },
    ]);
  };

  const updateQuestion = (
    index: number,
    field: keyof QuestionForm,
    value: string
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const saveQuestion = async (index: number) => {
    const q = questions[index];
    if (!q.pertanyaan || !q.opsi_a || !q.opsi_b || !q.opsi_c || !q.opsi_d) {
      alert("Semua field soal wajib diisi");
      return;
    }

    setLoading(true);
    try {
      if (q.isNew) {
        const response = await fetch(`/api/quiz/${currentQuizId}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(q),
        });
        if (response.ok) {
          const data = await response.json();
          const updated = [...questions];
          updated[index] = { ...data, isNew: false };
          setQuestions(updated);
        }
      } else {
        const response = await fetch(`/api/quiz/${currentQuizId}/questions`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: q.id, ...q }),
        });
        if (response.ok) {
          await fetchQuestions();
        }
      }
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Gagal menyimpan soal");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (index: number) => {
    const q = questions[index];
    if (q.isNew) {
      setQuestions(questions.filter((_, i) => i !== index));
      return;
    }

    if (!confirm("Yakin ingin menghapus soal ini?")) return;

    try {
      const response = await fetch(
        `/api/quiz/${currentQuizId}/questions?questionId=${q.id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setQuestions(questions.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {quiz ? "Edit Kuis" : "Buat Kuis Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {currentQuizId && (
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-6 py-3 font-medium ${
                activeTab === "info"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600"
              }`}
            >
              Info Kuis
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-6 py-3 font-medium ${
                activeTab === "questions"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600"
              }`}
            >
              Soal ({questions.length})
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "info" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Kuis *
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  placeholder="Masukkan judul kuis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  placeholder="Deskripsi kuis (opsional)"
                />
              </div>
              <button
                onClick={handleSaveQuiz}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Menyimpan..."
                  : currentQuizId
                  ? "Update Kuis"
                  : "Simpan & Lanjut ke Soal"}
              </button>
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div
                  key={q.id || index}
                  className="bg-gray-50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm font-medium">
                      Soal {index + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveQuestion(index)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={q.pertanyaan}
                    onChange={(e) =>
                      updateQuestion(index, "pertanyaan", e.target.value)
                    }
                    placeholder="Tulis pertanyaan..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    {(["A", "B", "C", "D"] as const).map((opt) => (
                      <div key={opt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`answer-${index}`}
                          checked={q.jawaban_benar === opt}
                          onChange={() =>
                            updateQuestion(index, "jawaban_benar", opt)
                          }
                          className="text-indigo-600"
                        />
                        <span className="font-medium text-sm">{opt}.</span>
                        <input
                          type="text"
                          value={
                            q[
                              `opsi_${opt.toLowerCase()}` as keyof QuestionForm
                            ] as string
                          }
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              `opsi_${opt.toLowerCase()}` as keyof QuestionForm,
                              e.target.value
                            )
                          }
                          placeholder={`Opsi ${opt}`}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-black"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={addQuestion}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tambah Soal
              </button>

              {questions.length > 0 && (
                <button
                  onClick={onSaved}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Selesai
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
