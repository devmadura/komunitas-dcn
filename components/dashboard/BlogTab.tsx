"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Plus, FileText, Trash2, Edit, Loader2, ImageIcon,
    ChevronLeft, Bold, Italic, List, ListOrdered, Heading2, Heading3,
    Quote, Code, Link as LinkIcon, Send, Clock, AlertCircle, CheckCircle,
    Strikethrough
} from "lucide-react";
import { BlogPost, BlogStatus } from "@/lib/supabase";
import { Admin } from "@/lib/permissions";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import NextImage from "next/image";
import { Markdown } from "tiptap-markdown";

interface BlogTabProps {
    currentAdmin: Admin;
    onDataChanged?: () => void;
}

const UPLOADCARE_PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "demopublickey";

const KATEGORI_OPTIONS = ["Tutorial", "Tips & Tricks", "Berita", "Opini", "Proyek", "Lainnya"];

const STATUS_CONFIG: Record<BlogStatus, { label: string; color: string; icon: React.ReactNode }> = {
    draft: { label: "Draft", color: "bg-gray-100 text-gray-600", icon: <FileText className="w-3 h-3" /> },
    pending: { label: "Menunggu Review", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
    revision: { label: "Perlu Revisi", color: "bg-orange-100 text-orange-700", icon: <AlertCircle className="w-3 h-3" /> },
    published: { label: "Published", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
};

// Notion-style Bubble Menu (muncul saat teks diselect)
function NotionBubbleMenu({ editor }: { editor: Editor }) {
    const handleLink = () => {
        const url = prompt("Masukkan URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
    };

    const items = [
        { icon: <Bold className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold (Ctrl+B)" },
        { icon: <Italic className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic (Ctrl+I)" },
        { icon: <Strikethrough className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), title: "Strikethrough" },
        { icon: <Code className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code"), title: "Inline Code" },
        { icon: <Heading2 className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), title: "Heading 2" },
        { icon: <Heading3 className="w-3.5 h-3.5" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), title: "Heading 3" },
        { icon: <LinkIcon className="w-3.5 h-3.5" />, action: handleLink, active: editor.isActive("link"), title: "Link" },
    ];

    return (
        <BubbleMenu
            editor={editor}
            className="flex items-center gap-0.5 bg-gray-900 text-white rounded-lg shadow-xl px-1.5 py-1 border border-gray-700"
        >
            {items.map((item, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={item.action}
                    title={item.title}
                    className={`p-1.5 rounded transition-colors ${item.active ? "bg-gray-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                >
                    {item.icon}
                </button>
            ))}
        </BubbleMenu>
    );
}

// Floating Menu saat di baris kosong (Notion "+" block picker)
function NotionFloatingMenu({ editor }: { editor: Editor }) {
    const blocks = [
        { icon: <Heading2 className="w-4 h-4" />, label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { icon: <Heading3 className="w-4 h-4" />, label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { icon: <List className="w-4 h-4" />, label: "List", action: () => editor.chain().focus().toggleBulletList().run() },
        { icon: <ListOrdered className="w-4 h-4" />, label: "OL", action: () => editor.chain().focus().toggleOrderedList().run() },
        { icon: <Quote className="w-4 h-4" />, label: "Quote", action: () => editor.chain().focus().toggleBlockquote().run() },
        { icon: <Code className="w-4 h-4" />, label: "Code", action: () => editor.chain().focus().toggleCodeBlock().run() },
    ];

    return (
        <FloatingMenu
            editor={editor}
            className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-md px-1.5 py-1"
        >
            {blocks.map((block, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={block.action}
                    title={block.label}
                    className="p-1.5 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                    {block.icon}
                </button>
            ))}
        </FloatingMenu>
    );
}

export default function BlogTab({ currentAdmin, onDataChanged }: BlogTabProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [deletePostId, setDeletePostId] = useState<string | null>(null);
    const [savingType, setSavingType] = useState<"draft" | "pending" | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Review modal (super-admin)
    const [reviewPostId, setReviewPostId] = useState<string | null>(null);
    const [reviewAction, setReviewAction] = useState<"publish" | "revision" | "reject" | null>(null);
    const [catatanRevisi, setCatatanRevisi] = useState("");
    const [reviewing, setReviewing] = useState(false);

    const [formData, setFormData] = useState({
        judul: "",
        excerpt: "",
        cover_image: "",
        cover_image_uuid: "",
        kategori: "",
        tags: "" as string,
    });

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: "Tulis konten artikel di sini..." }),
            Markdown.configure({
                html: true,
                transformPastedText: true,   // ← otomatis parse markdown saat paste
                transformCopiedText: false,
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none text-gray-900",
            },
        },
    });

    const fetchPosts = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setRefreshing(true);
            const statusParam = filterStatus === "all" ? "all" : filterStatus;
            const response = await fetch(`/api/blog?status=${statusParam}&limit=50`);
            const result = await response.json();
            setPosts(result.data || []);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        fetchPosts(true);
    }, [fetchPosts]);

    const resetForm = () => {
        setFormData({ judul: "", excerpt: "", cover_image: "", cover_image_uuid: "", kategori: "", tags: "" });
        editor?.commands.setContent("");
        setEditingPost(null);
    };

    const handleOpenForm = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                judul: post.judul,
                excerpt: post.excerpt || "",
                cover_image: post.cover_image || "",
                cover_image_uuid: post.cover_image_uuid || "",
                kategori: post.kategori || "",
                tags: post.tags?.join(", ") || "",
            });
            editor?.commands.setContent(post.konten || "");
        } else {
            resetForm();
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        resetForm();
    };

    const handleUploadChange = (event: { successEntries: Array<{ cdnUrl: string | null; uuid: string | null }> }) => {
        if (event.successEntries.length > 0) {
            const file = event.successEntries[0];
            if (file.cdnUrl && file.uuid) {
                setFormData((prev) => ({ ...prev, cover_image: file.cdnUrl as string, cover_image_uuid: file.uuid as string }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent, submitStatus: "draft" | "pending") => {
        e.preventDefault();
        if (!formData.judul) { toast({ title: "Judul wajib diisi", variant: "destructive" }); return; }

        const konten = editor?.getHTML() || "";
        if (!konten || konten === "<p></p>") { toast({ title: "Konten wajib diisi", variant: "destructive" }); return; }

        setSavingType(submitStatus);
        try {
            const tagsArray = formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
            const payload = { ...formData, konten, tags: tagsArray, status: submitStatus };

            const url = editingPost ? `/api/blog/${editingPost.id}` : "/api/blog";
            const method = editingPost ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                toast({ title: submitStatus === "pending" ? "Artikel disubmit untuk review!" : "Draft tersimpan" });
                setFilterStatus(submitStatus);
                fetchPosts();
                onDataChanged?.();
                handleCloseForm();
            } else {
                toast({ title: data.error || "Gagal menyimpan", variant: "destructive" });
            }
        } catch {
            toast({ title: "Gagal menyimpan", variant: "destructive" });
        } finally {
            setSavingType(null);
        }
    };

    const handleDelete = (id: string) => setDeletePostId(id);

    const confirmDelete = async () => {
        if (!deletePostId) return;
        setDeleting(deletePostId);
        const idToDelete = deletePostId;
        setDeletePostId(null);
        try {
            const response = await fetch(`/api/blog/${idToDelete}`, { method: "DELETE" });
            const data = await response.json();
            if (response.ok) {
                toast({ title: "Blog post berhasil dihapus" });
                fetchPosts();
                onDataChanged?.();
            } else {
                toast({ title: data.error || "Gagal menghapus", variant: "destructive" });
            }
        } catch {
            toast({ title: "Gagal menghapus", variant: "destructive" });
        } finally {
            setDeleting(null);
        }
    };

    const handleReview = async () => {
        if (!reviewPostId || !reviewAction) return;
        if (reviewAction === "revision" && !catatanRevisi) {
            toast({ title: "Catatan revisi wajib diisi", variant: "destructive" });
            return;
        }
        setReviewing(true);
        try {
            const response = await fetch(`/api/blog/${reviewPostId}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: reviewAction, catatan_revisi: catatanRevisi }),
            });
            const data = await response.json();
            if (response.ok) {
                const labels = { publish: "Blog berhasil dipublish!", revision: "Artikel dikembalikan untuk revisi", reject: "Artikel ditolak" };
                toast({ title: labels[reviewAction] });
                fetchPosts();
                onDataChanged?.();
                setReviewPostId(null);
                setCatatanRevisi("");
                setReviewAction(null);
            } else {
                toast({ title: data.error || "Gagal memproses review", variant: "destructive" });
            }
        } catch {
            toast({ title: "Gagal memproses review", variant: "destructive" });
        } finally {
            setReviewing(false);
        }
    };

    const canEdit = (post: BlogPost) =>
        currentAdmin.role === "super-admin" || post.penulis_id === currentAdmin.id;

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // --- FORM VIEW ---
    if (showForm) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <button onClick={handleCloseForm} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingPost ? "Edit Artikel" : "Tulis Artikel Baru"}
                    </h2>
                </div>

                {/* Revision note */}
                {editingPost?.catatan_revisi && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-orange-800">Catatan Revisi dari Admin:</p>
                                <p className="text-orange-700 mt-1">{editingPost.catatan_revisi}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Artikel *</label>
                        <input
                            type="text"
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            placeholder="Judul artikel yang menarik..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                    </div>

                    {/* Konten (Tiptap - Notion Style) */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Konten *</label>
                            <span className="text-xs text-gray-400">Pilih teks untuk format · Klik baris kosong untuk block</span>
                        </div>
                        <div className="relative border border-gray-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent transition-all">
                            {editor && <NotionBubbleMenu editor={editor} />}
                            {editor && <NotionFloatingMenu editor={editor} />}
                            <EditorContent
                                editor={editor!}
                                className="min-h-[400px] px-2"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan / Excerpt</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={3}
                            placeholder="Ringkasan singkat artikel (tampil di list blog)..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                        {formData.cover_image && (
                            <div className="mb-3 relative">
                                <NextImage
                                    src={formData.cover_image}
                                    alt="Cover preview"
                                    width={800}
                                    height={400}
                                    className="w-full h-52 object-cover rounded-lg"
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
                            pubkey={UPLOADCARE_PUBLIC_KEY}
                            imgOnly={true}
                            multiple={false}
                            maxLocalFileSizeBytes={5000000}
                            onChange={handleUploadChange}
                            className="uc-light"
                        />
                        <p className="mt-1 text-xs text-gray-500">JPG, PNG. Maks 5MB. Rekomendasi 1200x630px.</p>
                    </div>

                    {/* Kategori & Tags */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select
                                value={formData.kategori}
                                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            >
                                <option value="">— Pilih Kategori —</option>
                                {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="nextjs, tips, tutorial (pisah koma)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={handleCloseForm} disabled={savingType !== null} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
                            Batal
                        </button>
                        <button
                            type="button"
                            disabled={savingType !== null}
                            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, "draft")}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {savingType === "draft" && <Loader2 className="w-4 h-4 animate-spin" />}
                            <FileText className="w-4 h-4" />
                            {savingType === "draft" ? "Menyimpan..." : "Simpan Draft"}
                        </button>
                        {currentAdmin.role === "super-admin" ? (
                            <button
                                type="button"
                                disabled={savingType !== null}
                                onClick={(e) => handleSubmit(e as unknown as React.FormEvent, "pending")}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {savingType === "pending" && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Send className="w-4 h-4" />
                                {savingType === "pending" ? "Mengirim..." : "Submit & Review"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled={savingType !== null}
                                onClick={(e) => handleSubmit(e as unknown as React.FormEvent, "pending")}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {savingType === "pending" && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Send className="w-4 h-4" />
                                {savingType === "pending" ? "Mengirim..." : "Submit untuk Review"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        );
    }

    // --- LIST VIEW ---
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">Kelola Blog</h2>
                    {refreshing && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500" />
                    )}
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                    <Plus className="w-5 h-5" />
                    <span>Tulis Artikel</span>
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 border-b">
                {(["all", "draft", "pending", "revision", "published"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${filterStatus === s
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {s === "all" ? "Semua" : STATUS_CONFIG[s as BlogStatus]?.label || s}
                    </button>
                ))}
            </div>

            {posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Belum ada artikel</p>
                    <p className="text-gray-400 text-sm mt-2">Klik Tulis Artikel untuk mulai menulis</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artikel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penulis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {posts.map((post) => {
                                    const statusCfg = STATUS_CONFIG[post.status];
                                    return (
                                        <tr key={post.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {post.cover_image ? (
                                                        <NextImage
                                                            src={post.cover_image}
                                                            alt={post.judul}
                                                            width={48}
                                                            height={48}
                                                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate max-w-xs">{post.judul}</p>
                                                        {post.excerpt && (
                                                            <p className="text-xs text-gray-500 truncate max-w-xs">{post.excerpt}</p>
                                                        )}
                                                        {/* Catatan revisi notif */}
                                                        {post.status === "revision" && post.catatan_revisi && (
                                                            <p className="text-xs text-orange-600 mt-0.5 flex items-center gap-1">
                                                                <AlertCircle className="w-3 h-3" /> Ada catatan revisi
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {(post as BlogPost & { penulis?: { nama: string } }).penulis?.nama || "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {post.kategori ? (
                                                    <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                                                        {post.kategori}
                                                    </span>
                                                ) : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1 w-fit px-2 py-1 text-xs font-medium rounded-full ${statusCfg.color}`}>
                                                    {statusCfg.icon}
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(post.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Review button: super-admin only, untuk post pending */}
                                                    {currentAdmin.role === "super-admin" && post.status === "pending" && (
                                                        <button
                                                            onClick={() => { setReviewPostId(post.id); setReviewAction("publish"); }}
                                                            className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                                                        >
                                                            Review
                                                        </button>
                                                    )}
                                                    {/* Edit: penulis sendiri atau super-admin */}
                                                    {canEdit(post) && (
                                                        <button
                                                            onClick={() => handleOpenForm(post)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {/* Delete */}
                                                    {canEdit(post) && (
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            disabled={deleting === post.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            {deleting === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                        </button>
                                                    )}
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

            {/* Review Modal (super-admin) */}
            {reviewPostId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-bold text-gray-900">Review Artikel</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">Pilih tindakan untuk artikel ini:</p>
                            <div className="space-y-2">
                                {(["publish", "revision", "reject"] as const).map((act) => (
                                    <label key={act} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="reviewAction"
                                            value={act}
                                            checked={reviewAction === act}
                                            onChange={() => setReviewAction(act)}
                                            className="text-indigo-600"
                                        />
                                        <span className="text-sm font-medium text-black">
                                            {act === "publish" && "✅ Publish — Artikel langsung live"}
                                            {act === "revision" && "⚠️ Revisi — Kembalikan dengan catatan"}
                                            {act === "reject" && "❌ Tolak — Kembalikan ke draft"}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {reviewAction === "revision" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Revisi *</label>
                                    <textarea
                                        value={catatanRevisi}
                                        onChange={(e) => setCatatanRevisi(e.target.value)}
                                        rows={3}
                                        placeholder="Jelaskan apa yang perlu diperbaiki..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => { setReviewPostId(null); setCatatanRevisi(""); setReviewAction(null); }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleReview}
                                    disabled={reviewing || !reviewAction}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {reviewing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Konfirmasi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={deletePostId !== null}
                onOpenChange={(open) => !open && setDeletePostId(null)}
                title="Hapus Artikel"
                description="Yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </div>
    );
}
