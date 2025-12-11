"use client";

import { useState, useEffect } from "react";
import { Plus, Gift, Trash2, Copy, Check, Users } from "lucide-react";
import { CodeRedeem, CodeRedeemWithUsage } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface CodeRedeemTabProps {
  onDataChanged?: () => void;
}

export default function CodeRedeemTab({ onDataChanged }: CodeRedeemTabProps) {
  const [codes, setCodes] = useState<CodeRedeemWithUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteCodeId, setDeleteCodeId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    poin: "",
    max_usage: "",
    expires_at: "",
  });

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/code-redeem");
      const data = await response.json();
      setCodes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching codes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/code-redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          poin: Number(formData.poin),
          max_usage: Number(formData.max_usage),
          expires_at: formData.expires_at || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Code berhasil dibuat" });
        setShowForm(false);
        setFormData({ code: "", poin: "", max_usage: "", expires_at: "" });
        fetchCodes();
        onDataChanged?.();
      } else {
        toast({ title: data.error || "Gagal membuat code", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error creating code:", error);
      toast({ title: "Gagal membuat code", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteCodeId(id);
  };

  const confirmDelete = async () => {
    if (!deleteCodeId) return;

    setDeleting(deleteCodeId);
    const idToDelete = deleteCodeId;
    setDeleteCodeId(null);

    try {
      const response = await fetch(`/api/code-redeem/${idToDelete}`, { method: "DELETE" });
      const data = await response.json();

      if (response.ok) {
        toast({ title: "Code berhasil dihapus" });
        fetchCodes();
        onDataChanged?.();
      } else {
        toast({ title: data.error || "Gagal menghapus code", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting code:", error);
      toast({ title: "Gagal menghapus code", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (code: CodeRedeem) => {
    try {
      const response = await fetch(`/api/code-redeem/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !code.is_active }),
      });

      if (response.ok) {
        toast({ title: `Code ${code.is_active ? "dinonaktifkan" : "diaktifkan"}` });
        fetchCodes();
      }
    } catch (error) {
      console.error("Error toggling code:", error);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatus = (code: CodeRedeemWithUsage) => {
    if (!code.is_active) return { label: "Nonaktif", color: "bg-gray-100 text-gray-700" };
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return { label: "Expired", color: "bg-red-100 text-red-700" };
    }
    if (code.current_usage >= code.max_usage) {
      return { label: "Habis", color: "bg-orange-100 text-orange-700" };
    }
    return { label: "Aktif", color: "bg-green-100 text-green-700" };
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
        <h2 className="text-2xl font-bold text-gray-900">Code Redeem</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Code</span>
        </button>
      </div>

      {codes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada code redeem</p>
          <p className="text-gray-400 text-sm mt-2">
            Klik Buat Code untuk memulai
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Code</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Poin</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Penggunaan</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Expires</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {codes.map((code) => {
                  const status = getStatus(code);
                  return (
                    <tr key={code.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            {code.code}
                          </code>
                          <button
                            onClick={() => copyCode(code.code)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedCode === code.code ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-900">
                        {code.poin}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {code.current_usage}/{code.max_usage}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {code.expires_at
                          ? new Date(code.expires_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleActive(code)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              code.is_active
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {code.is_active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button
                            onClick={() => handleDelete(code.id)}
                            disabled={deleting === code.id}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === code.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Buat Code Redeem</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Contoh: DCN2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poin
                </label>
                <input
                  type="number"
                  value={formData.poin}
                  onChange={(e) => setFormData({ ...formData, poin: e.target.value })}
                  placeholder="Contoh: 10"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maksimal Penggunaan
                </label>
                <input
                  type="number"
                  value={formData.max_usage}
                  onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })}
                  placeholder="Contoh: 5"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Expired (Opsional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ code: "", poin: "", max_usage: "", expires_at: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteCodeId !== null}
        onOpenChange={(open) => !open && setDeleteCodeId(null)}
        title="Hapus Code"
        description="Yakin ingin menghapus code ini? Data penggunaan juga akan dihapus."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
