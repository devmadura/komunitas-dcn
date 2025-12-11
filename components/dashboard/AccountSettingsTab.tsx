"use client";

import { useState, useEffect } from "react";
import { Admin } from "@/lib/permissions";
import {
  User,
  Instagram,
  Linkedin,
  Github,
  Twitter,
  Save,
  Loader2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface SocialMedia {
  instagram?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

interface AccountSettingsTabProps {
  currentAdmin: Admin | null;
  onAdminUpdated?: () => void;
}

const UPLOADCARE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "demopublickey";

export default function AccountSettingsTab({
  currentAdmin,
  onAdminUpdated,
}: AccountSettingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [nama, setNama] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUuid, setPhotoUuid] = useState("");
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    instagram: "",
    linkedin: "",
    github: "",
    twitter: "",
  });

  useEffect(() => {
    if (currentAdmin) {
      fetchAccountData();
    }
  }, [currentAdmin]);

  const handleUploadChange = (event: {
    successEntries: Array<{ cdnUrl: string | null; uuid: string | null }>;
  }) => {
    if (event.successEntries.length > 0) {
      const file = event.successEntries[0];
      if (file.cdnUrl && file.uuid) {
        setPhotoUrl(file.cdnUrl);
        setPhotoUuid(file.uuid);
        console.log("Photo uploaded:", file.cdnUrl, file.uuid);
      }
    }
  };

  const fetchAccountData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        const admin = data.admin;
        setNama(admin.nama || "");
        setPhotoUrl(admin.photo_url || "");
        setPhotoUuid(admin.photo_uuid || "");
        setSocialMedia({
          instagram: admin.social_media?.instagram || "",
          linkedin: admin.social_media?.linkedin || "",
          github: admin.social_media?.github || "",
          twitter: admin.social_media?.twitter || "",
        });
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!photoUuid || deleting) return;
    setShowDeleteConfirm(true);
  };

  const confirmRemovePhoto = async () => {
    setShowDeleteConfirm(false);
    setDeleting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_uuid: photoUuid }),
      });

      const data = await response.json();
      if (response.ok) {
        setPhotoUrl("");
        setPhotoUuid("");
        setMessage({
          type: "success",
          text: data.message || "Foto berhasil dihapus",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal menghapus foto",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const filteredSocialMedia: SocialMedia = {};
      if (socialMedia.instagram)
        filteredSocialMedia.instagram = socialMedia.instagram;
      if (socialMedia.linkedin)
        filteredSocialMedia.linkedin = socialMedia.linkedin;
      if (socialMedia.github) filteredSocialMedia.github = socialMedia.github;
      if (socialMedia.twitter)
        filteredSocialMedia.twitter = socialMedia.twitter;

      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          photo_url: photoUrl,
          photo_uuid: photoUuid,
          social_media:
            Object.keys(filteredSocialMedia).length > 0
              ? filteredSocialMedia
              : null,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Profil berhasil diperbarui" });
        onAdminUpdated?.();
      } else {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.error || "Gagal memperbarui profil",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Pengaturan Akun
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Foto Profil
            </label>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={deleting}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Hapus foto"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              <div className="flex-1">
                <FileUploaderRegular
                  pubkey={UPLOADCARE_PUBLIC_KEY}
                  imgOnly={true}
                  multiple={false}
                  maxLocalFileSizeBytes={5000000}
                  onChange={handleUploadChange}
                  className="uc-light"
                />
                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG. Maksimal 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Nama */}
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama
            </label>
            <input
              type="text"
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Label jabatan */}
          {/* <div>
            <label
              htmlFor="label"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Label / Jabatan
            </label>
            <input
              type="text"
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Founder, Lead Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div> */}

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Media
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={socialMedia.instagram}
                  onChange={(e) =>
                    setSocialMedia({
                      ...socialMedia,
                      instagram: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com/username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={socialMedia.linkedin}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={socialMedia.github}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, github: e.target.value })
                  }
                  placeholder="https://github.com/username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={socialMedia.twitter}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, twitter: e.target.value })
                  }
                  placeholder="https://twitter.com/username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Hapus Foto Profil"
        description="Apakah Anda yakin ingin menghapus foto profil?"
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmRemovePhoto}
        variant="destructive"
      />
    </div>
  );
}
