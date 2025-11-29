"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Link2, Clock } from "lucide-react";
import { Quiz } from "@/lib/supabase";

interface QuizLinkGeneratorProps {
  quiz: Quiz;
  onClose: () => void;
}

export default function QuizLinkGenerator({ quiz, onClose }: QuizLinkGeneratorProps) {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingActive, setCheckingActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExistingLink, setIsExistingLink] = useState(false);

  useEffect(() => {
    checkActiveSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.id]);

  const checkActiveSession = async () => {
    setCheckingActive(true);
    try {
      const response = await fetch(`/api/quiz/${quiz.id}/generate-link`);
      const data = await response.json();

      if (data.is_active) {
        setGeneratedUrl(data.url);
        setExpiresAt(data.expires_at);
        setIsExistingLink(true);
      }
    } catch (error) {
      console.error("Error checking active session:", error);
    } finally {
      setCheckingActive(false);
    }
  };

  const generateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quiz/${quiz.id}/generate-link`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setGeneratedUrl(data.url);
        setExpiresAt(data.expires_at);
        setIsExistingLink(false);
      } else {
        alert(data.error || "Gagal generate link");
      }
    } catch (error) {
      console.error("Error generating link:", error);
      alert("Gagal generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Generate Link Kuis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">{quiz.judul}</h3>
            {quiz.deskripsi && (
              <p className="text-sm text-gray-600 mt-1">{quiz.deskripsi}</p>
            )}
          </div>

          {checkingActive ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : !generatedUrl ? (
            <div className="text-center py-4">
              <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                Generate link untuk kuis ini. Link akan valid selama{" "}
                <span className="font-semibold">1 jam</span>.
              </p>
              <button
                onClick={generateLink}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Link"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`${isExistingLink ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"} border rounded-lg p-4`}>
                <div className={`flex items-center gap-2 ${isExistingLink ? "text-blue-700" : "text-green-700"} mb-2`}>
                  {isExistingLink ? <Link2 className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  <span className="font-medium">
                    {isExistingLink ? "Link aktif ditemukan!" : "Link berhasil dibuat!"}
                  </span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isExistingLink ? "text-blue-600" : "text-green-600"}`}>
                  <Clock className="w-4 h-4" />
                  <span>
                    Kadaluarsa:{" "}
                    {expiresAt &&
                      new Date(expiresAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                  </span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="w-full px-4 py-3 pr-24 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={generateLink}
                disabled={loading}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Generate Link Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
