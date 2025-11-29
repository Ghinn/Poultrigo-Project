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
  Eye as EyeIcon,
  FileText,
  Upload,
} from "lucide-react";
import {
  getNews,
  deleteNews,
  createNews,
  updateNews,
} from "@/actions/news";
import { getCurrentUser } from "@/utils/auth";
import { useToast } from "@/components/ui/toast-provider";

type NewsModalMode = "create" | "edit" | "view" | null;

export function NewsManagement() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const [allNews, setAllNews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [modalMode, setModalMode] = useState<NewsModalMode>(null);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Berita",
    tags: "",
    published: false,
    featuredImage: "",
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const news = await getNews();
    setAllNews(news);
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
    setImagePreview("");
    setSelectedArticle(null);
    setModalMode("create");
  };

  const handleOpenEdit = (article: any) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags.join(", "),
      published: article.published,
      featuredImage: article.featuredImage || "",
    });
    setImagePreview(article.featuredImage || "");
    setSelectedArticle(article);
    setModalMode("edit");
  };

  const handleOpenView = (article: any) => {
    setSelectedArticle(article);
    setModalMode("view");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedArticle(null);
    setImagePreview("");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, featuredImage: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const { showToast } = useToast();

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      showToast("Harap lengkapi semua field yang wajib diisi.", "error");
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("excerpt", formData.excerpt);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("tags", formData.tags);
    data.append("published", String(formData.published));
    data.append("featuredImage", formData.featuredImage);

    if (modalMode === "create") {
      data.append("author", currentUser?.name || "Admin");
      data.append("authorId", currentUser?.id || "admin-001");
      await createNews(null, data);
    } else if (modalMode === "edit" && selectedArticle) {
      data.append("id", selectedArticle.id);
      await updateNews(null, data);
    }

    await loadNews();
    setIsLoading(false);
    handleCloseModal();
    showToast("Artikel berhasil disimpan!", "success");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      await deleteNews(id);
      loadNews();
      showToast("Artikel berhasil dihapus!", "success");
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
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${statusFilter === status
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
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${article.published
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
                      onClick={() => handleOpenView(article)}
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
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-6">
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
                {selectedArticle.featuredImage && (
                  <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
                    <Image
                      src={selectedArticle.featuredImage}
                      alt={selectedArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="mb-4 space-y-2">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {selectedArticle.category}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selectedArticle.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {selectedArticle.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{selectedArticle.author}</span>
                    <span>•</span>
                    <span>{formatDate(selectedArticle.publishedAt)}</span>
                    <span>•</span>
                    <span>{selectedArticle.views} views</span>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-[#001B34]">{selectedArticle.title}</h2>
                  <p className="text-lg text-slate-600">{selectedArticle.excerpt}</p>
                  <div className="mt-6 whitespace-pre-wrap text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
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
                          category: e.target.value as any,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
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
                      Gambar Thumbnail
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          <Upload className="h-4 w-4" />
                          {imagePreview ? "Ganti Gambar" : "Upload Gambar"}
                        </label>
                      </div>
                    </div>
                    {imagePreview && (
                      <div className="mt-2 relative h-32 w-full overflow-hidden rounded-lg border border-slate-200">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData({ ...formData, featuredImage: "" });
                          }}
                          className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-slate-600 hover:bg-white hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
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
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Menyimpan..." : "Simpan"}
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


