"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Shield, User } from "lucide-react";
import {
  Admin,
  Permission,
  PERMISSIONS,
  PERMISSION_LABELS,
} from "@/lib/permissions";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ManageAdminTabProps {
  currentAdmin: Admin | null;
}

export default function ManageAdminTab({ currentAdmin }: ManageAdminTabProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    emailUsername: "",
    nama: "",
    password: "",
    permissions: [] as Permission[],
    label: "",
    is_active: true,
    join_date: "",
  });

  const EMAIL_DOMAIN = "@dcnunira.dev";
  const [submitting, setSubmitting] = useState(false);
  const [deleteAdmin, setDeleteAdmin] = useState<Admin | null>(null);

  const isSuperAdmin = currentAdmin?.role === "super-admin";

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin");
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAdmin) {
        const response = await fetch("/api/admin", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingAdmin.id,
            nama: formData.nama,
            permissions: formData.permissions,
            label: formData.label || null,
            is_active: formData.is_active,
            join_date: formData.join_date || null,
          }),
        });

        if (response.ok) {
          await fetchAdmins();
          resetForm();
          toast({ title: "Admin berhasil diupdate!" });
        } else {
          const data = await response.json();
          toast({ title: data.error || "Gagal mengupdate admin", variant: "destructive" });
        }
      } else {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.emailUsername + EMAIL_DOMAIN,
            nama: formData.nama,
            password: formData.password,
            permissions: formData.permissions,
          }),
        });

        if (response.ok) {
          await fetchAdmins();
          resetForm();
          toast({ title: "Admin berhasil ditambahkan!" });
        } else {
          const data = await response.json();
          toast({ title: data.error || "Gagal menambahkan admin", variant: "destructive" });
        }
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast({ title: "Terjadi kesalahan", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (admin: Admin) => {
    setDeleteAdmin(admin);
  };

  const confirmDelete = async () => {
    if (!deleteAdmin) return;

    try {
      const response = await fetch(`/api/admin?id=${deleteAdmin.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAdmins();
        toast({ title: "Admin berhasil dihapus!" });
      } else {
        const data = await response.json();
        toast({ title: data.error || "Gagal menghapus admin", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast({ title: "Terjadi kesalahan", variant: "destructive" });
    } finally {
      setDeleteAdmin(null);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      emailUsername: admin.email.replace(EMAIL_DOMAIN, ""),
      nama: admin.nama,
      password: "",
      permissions: admin.permissions || [],
      label: admin.label || "",
      is_active: admin.is_active !== false,
      join_date: admin.join_date || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      emailUsername: "",
      nama: "",
      password: "",
      permissions: [],
      label: "",
      is_active: true,
      join_date: "",
    });
    setEditingAdmin(null);
    setShowForm(false);
  };

  const togglePermission = (permission: Permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Kelola Admin</h2>
        {isSuperAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Admin</span>
          </button>
        )}
      </div>

      {admins.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada admin</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  {isSuperAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{admin.nama}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${admin.role === "super-admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        <Shield className="w-3 h-3" />
                        {admin.role === "super-admin" ? "Super Admin" : "Co-Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {admin.role === "super-admin" ? (
                        <span className="text-sm text-gray-500">Semua akses</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions?.length > 0 ? (
                            admin.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {PERMISSION_LABELS[perm]}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">
                              Tidak ada akses
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 text-right">
                        {admin.role !== "super-admin" && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(admin)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingAdmin ? "Edit Admin" : "Tambah Admin Baru"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {editingAdmin ? (
                  <input
                    type="email"
                    value={editingAdmin.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                  />
                ) : (
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.emailUsername}
                      onChange={(e) =>
                        setFormData({ ...formData, emailUsername: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '') })
                      }
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                      placeholder="username"
                    />
                    <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                      {EMAIL_DOMAIN}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                  placeholder="Nama Admin"
                />
              </div>

              {/* Label / Jabatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label / Jabatan
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                  placeholder="Contoh: Founder, Lead Developer"
                />
              </div>

              {/* Status Active/Alumni */}
              {editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, is_active: !formData.is_active })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_active ? "bg-green-600" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">
                      {formData.is_active ? "Active Member" : "Alumni"}
                    </span>
                  </div>
                </div>
              )}

              {/* Join Date */}
              {editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Bergabung
                  </label>
                  <input
                    type="date"
                    value={formData.join_date}
                    onChange={(e) =>
                      setFormData({ ...formData, join_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                  />
                </div>
              )}

              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingAdmin}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    placeholder="Password untuk login"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PERMISSIONS).map(([key, value]) => {
                    if (value === "manage_admin" || value === "activity_log") {
                      return null;
                    }
                    return (
                      <label
                        key={key}
                        className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(value)}
                          onChange={() => togglePermission(value)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {PERMISSION_LABELS[value]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {submitting
                    ? "Menyimpan..."
                    : editingAdmin
                      ? "Update"
                      : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteAdmin !== null}
        onOpenChange={(open) => !open && setDeleteAdmin(null)}
        title="Hapus Admin"
        description={`Yakin ingin menghapus admin "${deleteAdmin?.nama}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
