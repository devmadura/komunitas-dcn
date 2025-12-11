"use client";

import { useState, useEffect } from "react";
import { Plus, FileQuestion, Link2, Trash2, Edit, Eye, BarChart2 } from "lucide-react";
import { Quiz } from "@/lib/supabase";
import QuizForm from "./QuizForm";
import QuizLinkGenerator from "./QuizLinkGenerator";
import QuizDetail from "./QuizDetail";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface QuizTabProps {
  onDataChanged?: () => void;
}

export default function QuizTab({ onDataChanged }: QuizTabProps) {
  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedQuizForLink, setSelectedQuizForLink] = useState<Quiz | null>(null);
  const [selectedQuizForDetail, setSelectedQuizForDetail] = useState<Quiz | null>(null);
  const [managingQuestionsFor, setManagingQuestionsFor] = useState<Quiz | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  const fetchQuizList = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/quiz");
      const data = await response.json();
      setQuizList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizList();
  }, []);

  const handleDelete = (id: string) => {
    setDeleteQuizId(id);
  };

  const confirmDelete = async () => {
    if (!deleteQuizId) return;
    
    setDeleting(deleteQuizId);
    const idToDelete = deleteQuizId;
    setDeleteQuizId(null);
    try {
      const response = await fetch(`/api/quiz/${idToDelete}`, { method: "DELETE" });
      const data = await response.json();
      
      if (response.ok) {
        fetchQuizList();
        onDataChanged?.();
      } else {
        toast({ title: data.error || "Gagal menghapus kuis", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast({ title: "Gagal menghapus kuis", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingQuiz(null);
    setManagingQuestionsFor(null);
  };

  const handleFormSaved = () => {
    fetchQuizList();
    onDataChanged?.();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Kelola Kuis</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Kuis</span>
        </button>
      </div>

      {quizList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada kuis</p>
          <p className="text-gray-400 text-sm mt-2">
            Klik Buat Kuis untuk memulai
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizList.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{quiz.judul}</h3>
                  {quiz.deskripsi && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {quiz.deskripsi}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Dibuat: {new Date(quiz.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <FileQuestion className="w-8 h-8 text-indigo-600" />
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setManagingQuestionsFor(quiz);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Soal
                </button>
                <button
                  onClick={() => setSelectedQuizForDetail(quiz)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <BarChart2 className="w-4 h-4" />
                  Hasil
                </button>
                <button
                  onClick={() => setSelectedQuizForLink(quiz)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  Link
                </button>
                <button
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  disabled={deleting === quiz.id}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {deleting === quiz.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <QuizForm
          quiz={editingQuiz}
          manageQuestions={!!managingQuestionsFor}
          onClose={handleFormClose}
          onSaved={handleFormSaved}
        />
      )}

      {selectedQuizForLink && (
        <QuizLinkGenerator
          quiz={selectedQuizForLink}
          onClose={() => setSelectedQuizForLink(null)}
        />
      )}

      {selectedQuizForDetail && (
        <QuizDetail
          quiz={selectedQuizForDetail}
          onClose={() => setSelectedQuizForDetail(null)}
        />
      )}

      <ConfirmDialog
        open={deleteQuizId !== null}
        onOpenChange={(open) => !open && setDeleteQuizId(null)}
        title="Hapus Kuis"
        description="Yakin ingin menghapus kuis ini? Semua data termasuk soal, sesi, dan hasil akan dihapus."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
