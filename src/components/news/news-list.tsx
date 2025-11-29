"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Eye, Tag, Search, Newspaper, TrendingUp, Home } from "lucide-react";
import { type NewsArticle } from "@/utils/news";

type CategoryFilter = "all" | NewsArticle["category"];

interface NewsListProps {
  initialNews: NewsArticle[];
  backUrl?: string;
  backLabel?: string;
}

export default function NewsList({ initialNews, backUrl = "/", backLabel = "Kembali ke Beranda" }: NewsListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const allNews = initialNews;
  const categories: NewsArticle["category"][] = [
    "Teknologi",
    "Tips",
    "Berita",
    "Update",
    "Tutorial",
  ];

  // Filter news
  const filteredNews = allNews.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" || article.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Get featured article (most recent)
  const featuredArticle = allNews.length > 0 ? allNews[0] : null;
  const showFeatured = featuredArticle && categoryFilter === "all" && !searchQuery;

  const regularNews = filteredNews.filter((article) => {
    if (showFeatured && article.id === featuredArticle.id) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: NewsArticle["category"]) => {
    const colors = {
      Teknologi: "bg-blue-500/10 text-blue-700 border-blue-200",
      Tips: "bg-green-500/10 text-green-700 border-green-200",
      Berita: "bg-purple-500/10 text-purple-700 border-purple-200",
      Update: "bg-orange-500/10 text-orange-700 border-orange-200",
      Tutorial: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    };
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back to Home Button */}
      <button
        type="button"
        onClick={() => router.push(backUrl)}
        className="group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-[#001B34] hover:shadow-sm"
      >
        <Home className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>{backLabel}</span>
      </button>

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 text-white shadow-xl sm:p-8 md:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <Newspaper className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-sm font-medium text-orange-100 sm:text-base">
              Portal Berita
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Berita & Artikel Poultrigo
          </h1>
          <p className="max-w-2xl text-base text-orange-50 sm:text-lg">
            Dapatkan informasi terbaru tentang teknologi peternakan, tips praktis, tutorial, dan update sistem dari tim Poultrigo
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari artikel berdasarkan judul, konten, atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 sm:py-3.5 sm:text-base"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:px-5 sm:py-2.5 ${categoryFilter === "all"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setCategoryFilter(category)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:px-5 sm:py-2.5 ${categoryFilter === category
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {filteredNews.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp className="h-4 w-4" />
            <span>
              Menampilkan <strong className="font-semibold text-[#001B34]">{filteredNews.length}</strong> artikel
            </span>
          </div>
        )}
      </div>

      {/* Featured Article */}
      {showFeatured && (
        <article
          onClick={() => router.push(`/news/${featuredArticle.id}`)}
          className="group relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-white shadow-lg transition-all hover:border-orange-300 hover:shadow-xl"
        >
          {featuredArticle.featuredImage && (
            <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
              <Image
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <span
                  className={`mb-3 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryColor(
                    featuredArticle.category
                  )}`}
                >
                  {featuredArticle.category}
                </span>
                <h2 className="mb-3 line-clamp-2 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  {featuredArticle.title}
                </h2>
                <p className="mb-4 line-clamp-2 text-sm text-white/90 sm:text-base">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 sm:text-sm">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {featuredArticle.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(featuredArticle.publishedAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {featuredArticle.views} dibaca
                  </span>
                </div>
              </div>
            </div>
          )}
        </article>
      )}

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Newspaper className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-[#001B34]">Tidak ada artikel ditemukan</h3>
          <p className="mt-2 text-sm text-slate-600">
            {searchQuery
              ? "Coba cari dengan kata kunci lain atau hapus filter."
              : "Belum ada artikel yang tersedia."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regularNews.map((article) => (
            <article
              key={article.id}
              onClick={() => router.push(`/news/${article.id}`)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
            >
              {article.featuredImage && (
                <div className="relative h-48 w-full overflow-hidden sm:h-52">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {!article.featuredImage && (
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                  )}
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-[#001B34] transition-colors group-hover:text-orange-600 sm:text-xl">
                  {article.title}
                </h2>

                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{article.author}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                    {article.views}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
