"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  X,
  Save,
  Calendar,
  User,
  Tag,
  Eye as EyeIcon,
  FileText,
} from "lucide-react";
import {
  getNewsArticles,
  getPublishedNews,
  deleteNewsArticle,
  saveNewsArticle,
  updateNewsArticle,
  type NewsArticle,
} from "@/utils/news";
import { getCurrentUser } from "@/utils/auth";

type NewsModalMode = "create" | "edit" | "view" | null;

export function NewsManagement() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [modalMode, setModalMode] = useState<NewsModalMode>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Berita" as NewsArticle["category"],
    tags: "",
    published: false,
    featuredImage: "",
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    setAllNews(getNewsArticles());
  };

  const filteredNews = allNews.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && article.published) ||
      (statusFilter === "draft" && !article.published);

    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Berita",
      tags: "",
      published: false,
      featuredImage: "",
    });
    setSelectedArticle(null);
    setModalMode("create");
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags.join(", "),
      published: article.published,
      featuredImage: article.featuredImage || "",
    });
    setSelectedArticle(article);
    setModalMode("edit");
  };

  const handleOpenView = (article: NewsArticle) => {
    setSelectedArticle(article);
    setModalMode("view");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedArticle(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Berita",
      tags: "",
      published: false,
      featuredImage: "",
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert("Harap lengkapi semua field yang wajib diisi.");
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (modalMode === "create") {
      saveNewsArticle({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: currentUser?.name || "Admin",
        authorId: currentUser?.id || "admin-001",
        category: formData.category,
        tags: tagsArray,
        published: formData.published,
        featuredImage: formData.featuredImage || undefined,
      });
    } else if (modalMode === "edit" && selectedArticle) {
      updateNewsArticle(selectedArticle.id, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: tagsArray,
        published: formData.published,
        featuredImage: formData.featuredImage || undefined,
      });
    }

    loadNews();
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      deleteNewsArticle(id);
      loadNews();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#001B34]">Kelola Berita</h2>
          <p className="text-sm text-slate-600">
            Buat, edit, dan kelola artikel berita untuk platform Poultrigo
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Tambah Artikel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {status === "all" ? "Semua" : status === "published" ? "Published" : "Draft"}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-slate-500">Tidak ada artikel ditemukan.</p>
          </div>
        ) : (
          filteredNews.map((article) => (
            <div
              key={article.id}
              className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                {article.featuredImage && (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg sm:h-40 sm:w-48">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            article.published
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {article.published ? "Published" : "Draft"}
                        </span>
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#001B34]">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{article.excerpt}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <EyeIcon className="h-3.5 w-3.5" />
                      {article.views} views
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/news/${article.id}`)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Lihat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(article)}
                      className="flex items-center gap-1.5 rounded-lg border border-orange-300 px-3 py-1.5 text-xs font-medium text-orange-700 transition-colors hover:bg-orange-50"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-[#001B34]">
                {modalMode === "create" && "Tambah Artikel Baru"}
                {modalMode === "edit" && "Edit Artikel"}
                {modalMode === "view" && selectedArticle?.title}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            {modalMode === "view" && selectedArticle ? (
              <div className="p-6">
                <div className="mb-4 space-y-2">
                  <p className="text-sm text-slate-600">Kategori: {selectedArticle.category}</p>
                  <p className="text-sm text-slate-600">Status: {selectedArticle.published ? "Published" : "Draft"}</p>
                  <p className="text-sm text-slate-600">Views: {selectedArticle.views}</p>
                </div>
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold">{selectedArticle.title}</h2>
                  <p className="text-slate-600">{selectedArticle.excerpt}</p>
                  <div className="mt-4 whitespace-pre-wrap text-slate-700">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-6 p-6"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Judul Artikel *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="Masukkan judul artikel"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ringkasan (Excerpt) *
                  </label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="Masukkan ringkasan artikel"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Konten Artikel *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="Masukkan konten artikel (mendukung markdown)"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as NewsArticle["category"],
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Teknologi">Teknologi</option>
                      <option value="Tips">Tips</option>
                      <option value="Berita">Berita</option>
                      <option value="Update">Update</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      URL Gambar Featured (opsional)
                    </label>
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) =>
                        setFormData({ ...formData, featuredImage: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tags (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="IoT, Machine Learning, Tips"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-slate-700">
                    Publikasikan artikel (tampilkan ke pengguna)
                  </label>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                  >
                    <Save className="h-4 w-4" />
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


