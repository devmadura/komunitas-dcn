"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Eye, EyeOff, Loader2, ImageIcon, Images } from "lucide-react";
import { Galeri, GaleriImage } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import Image from "next/image";

interface GaleriTabProps {
  onDataChanged?: () => void;
}

const UPLOADCARE_PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "demopublickey";

export default function GaleriTab({ onDataChanged }: GaleriTabProps) {
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGaleri, setEditingGaleri] = useState<Galeri | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteGaleriId, setDeleteGaleriId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    cover_image: "",
    cover_image_uuid: "",
    images: [] as GaleriImage[],
    is_published: true,
  });

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/galeri");
      const result = await response.json();
      setGaleriList(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching galeri:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleri();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      cover_image: "",
      cover_image_uuid: "",
      images: [],
      is_published: true,
    });
    setEditingGaleri(null);
  };

  const parseImages = (images: GaleriImage[] | string | null | undefined): GaleriImage[] => {
    if (!images) return [];
    if (typeof images === "string") {
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    }
    return Array.isArray(images) ? images : [];
  };

  const handleOpenForm = (galeri?: Galeri) => {
    setUploadKey(0);
    if (galeri) {
      setEditingGaleri(galeri);
      const parsedImages = parseImages(galeri.images);
      setFormData({
        title: galeri.title,
        cover_image: galeri.cover_image,
        cover_image_uuid: galeri.cover_image_uuid || "",
        images: parsedImages,
        is_published: galeri.is_published,
      });
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleCoverUpload = (event: {
    successEntries: Array<{ cdnUrl: string | null; uuid: string | null }>;
  }) => {
    if (event.successEntries.length > 0) {
      const file = event.successEntries[0];
      if (file.cdnUrl && file.uuid) {
        setFormData((prev) => ({
          ...prev,
          cover_image: file.cdnUrl as string,
          cover_image_uuid: file.uuid as string,
        }));
        setUploadKey((prev) => prev + 1);
      }
    }
  };

  const handleImagesUpload = (event: {
    successEntries: Array<{ cdnUrl: string | null; uuid: string | null }>;
  }) => {
    const newImages: GaleriImage[] = event.successEntries
      .filter((file) => file.cdnUrl && file.uuid)
      .map((file) => ({
        url: file.cdnUrl as string,
        uuid: file.uuid as string,
      }));

    if (newImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      setUploadKey((prev) => prev + 1);
    }
  };

  const handleRemoveImage = (uuid: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.uuid !== uuid),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingGaleri ? `/api/galeri/${editingGaleri.id}` : "/api/galeri";
      const method = editingGaleri ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: editingGaleri ? "Album berhasil diupdate" : "Album berhasil dibuat",
        });
        fetchGaleri();
        onDataChanged?.();
        handleCloseForm();
      } else {
        toast({ title: data.error || "Gagal menyimpan album", variant: "destructive" });
      }
    } catch {
      toast({ title: "Gagal menyimpan album", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteGaleriId(id);
  };

  const confirmDelete = async () => {
    if (!deleteGaleriId) return;

    setDeleting(deleteGaleriId);
    const idToDelete = deleteGaleriId;
    setDeleteGaleriId(null);

    try {
      const response = await fetch(`/api/galeri/${idToDelete}`, { method: "DELETE" });
      const data = await response.json();

      if (response.ok) {
        toast({ title: "Album berhasil dihapus" });
        fetchGaleri();
        onDataChanged?.();
      } else {
        toast({ title: data.error || "Gagal menghapus album", variant: "destructive" });
      }
    } catch {
      toast({ title: "Gagal menghapus album", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (galeri: Galeri) => {
    try {
      const response = await fetch(`/api/galeri/${galeri.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...galeri, is_published: !galeri.is_published }),
      });

      if (response.ok) {
        toast({
          title: galeri.is_published ? "Album di-unpublish" : "Album dipublish",
        });
        fetchGaleri();
      }
    } catch {
      toast({ title: "Gagal mengubah status", variant: "destructive" });
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Kelola Galeri</h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Album</span>
        </button>
      </div>

      {galeriList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada album galeri</p>
          <p className="text-gray-400 text-sm mt-2">
            Klik Tambah Album untuk memulai
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeriList.map((galeri) => (
            <div key={galeri.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48">
                {galeri.cover_image ? (
                  <Image
                    src={galeri.cover_image}
                    alt={galeri.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleTogglePublish(galeri)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      galeri.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {galeri.is_published ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Draft
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{galeri.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {parseImages(galeri.images).length} foto
                </p>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleOpenForm(galeri)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(galeri.id)}
                    disabled={deleting === galeri.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === galeri.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingGaleri ? "Edit Album" : "Tambah Album"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Album *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image *
                </label>
                {formData.cover_image && (
                  <div className="mb-3 relative">
                    <Image
                      src={formData.cover_image}
                      alt="Cover Preview"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover_image: "", cover_image_uuid: "" })}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <FileUploaderRegular
                  key={`cover-${uploadKey}`}
                  pubkey={UPLOADCARE_PUBLIC_KEY}
                  imgOnly={true}
                  multiple={false}
                  maxLocalFileSizeBytes={5000000}
                  onChange={handleCoverUpload}
                  className="uc-light"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Cover image yang akan ditampilkan di halaman galeri.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Album ({formData.images.length} foto)
                </label>
                {formData.images.length > 0 && (
                  <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={img.uuid} className="relative">
                        <Image
                          src={img.url}
                          alt={`Album image ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-24 object-cover rounded-lg"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.uuid)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <FileUploaderRegular
                  key={`images-${uploadKey}`}
                  pubkey={UPLOADCARE_PUBLIC_KEY}
                  imgOnly={true}
                  multiple={true}
                  maxLocalFileSizeBytes={5000000}
                  onChange={handleImagesUpload}
                  className="uc-light"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload foto-foto untuk album ini. Bisa multiple.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_published" className="text-sm text-gray-700">
                  Publish album (tampilkan di halaman galeri)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.cover_image}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingGaleri ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteGaleriId !== null}
        onOpenChange={(open) => !open && setDeleteGaleriId(null)}
        title="Hapus Album"
        description="Yakin ingin menghapus album ini? Semua foto dalam album akan ikut terhapus. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
