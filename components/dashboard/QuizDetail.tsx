"use client";

import { useState, useEffect } from "react";
import { X, Users, Trophy, Clock, FileQuestion } from "lucide-react";
import { Quiz } from "@/lib/supabase";

interface Submission {
  id: string;
  nama_peserta: string;
  skor: number;
  total_soal: number;
  submitted_at: string;
}

interface QuizDetailProps {
  quiz: Quiz;
  onClose: () => void;
}

export default function QuizDetail({ quiz, onClose }: QuizDetailProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.id]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/quiz/${quiz.id}/submissions`);
      const data = await response.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (skor: number, total: number) => {
    const percentage = (skor / total) * 100;
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Kuis</h2>
            <p className="text-sm text-gray-500">{quiz.judul}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada yang mengerjakan kuis ini</p>
              <p className="text-gray-400 text-sm mt-2">
                Generate link dan bagikan ke peserta
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Users className="w-5 h-5" />
                <span className="font-medium">{submissions.length} peserta sudah mengerjakan</span>
              </div>

              <div className="space-y-3">
                {submissions.map((sub, index) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold rounded-full">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{sub.nama_peserta}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(sub.submitted_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold ${getScoreColor(sub.skor, sub.total_soal)}`}>
                        <Trophy className="w-4 h-4" />
                        <span>{sub.skor}/{sub.total_soal}</span>
                        <span className="text-xs">
                          ({Math.round((sub.skor / sub.total_soal) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
