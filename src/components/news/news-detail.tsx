"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Eye, Tag, Clock, Share2, BookOpen, Home } from "lucide-react";
import {
  getNewsById,
  incrementNewsViews,
  getPublishedNews,
} from "@/utils/news";
import { MarkdownRenderer } from "./markdown-renderer";

export default function NewsDetail() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;

  const article = articleId ? getNewsById(articleId) : null;
  const allNews = getPublishedNews();

  useEffect(() => {
    if (article && article.published) {
      incrementNewsViews(article.id);
    }
  }, [article]);

  if (!article || !article.published) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <BookOpen className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#001B34] sm:text-3xl">Artikel Tidak Ditemukan</h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Artikel yang Anda cari tidak ditemukan atau belum dipublikasikan.
          </p>
          <button
            type="button"
            onClick={() => router.push("/news")}
            className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg"
          >
            Kembali ke Daftar Berita
          </button>
        </div>
      </div>
    );
  }

  // Get related articles (same category, exclude current)
  const relatedArticles = allNews
    .filter(
      (a) => a.id !== article.id && a.category === article.category && a.published
    )
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Teknologi: "bg-blue-500/10 text-blue-700 border-blue-200",
      Tips: "bg-green-500/10 text-green-700 border-green-200",
      Berita: "bg-purple-500/10 text-purple-700 border-purple-200",
      Update: "bg-orange-500/10 text-orange-700 border-orange-200",
      Tutorial: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    };
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link artikel telah disalin ke clipboard!");
    }
  };

  return (
    <article className="space-y-6">
      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md"
        >
          <Home className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Beranda</span>
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-[#001B34]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${getCategoryColor(
              article.category
            )}`}
          >
            {article.category}
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-bold leading-tight text-[#001B34] sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4 text-sm text-slate-600">
          <span className="flex items-center gap-2 font-medium">
            <User className="h-4 w-4 text-slate-400" />
            {article.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-2 font-medium">
            <Eye className="h-4 w-4 text-slate-400" />
            {article.views} dilihat
          </span>
          {article.updatedAt !== article.publishedAt && (
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              Diperbarui {formatDate(article.updatedAt)}
            </span>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#001B34]"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="prose prose-slate prose-lg max-w-none prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-bold prose-headings:text-[#001B34] prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-[#001B34] prose-strong:font-semibold prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:my-2 prose-blockquote:border-l-orange-500 prose-blockquote:italic prose-blockquote:text-slate-600 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">
          <MarkdownRenderer content={article.content} />
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-orange-500/10 p-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-[#001B34] sm:text-2xl">Artikel Terkait</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <article
                key={related.id}
                onClick={() => router.push(`/news/${related.id}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-md"
              >
                {related.featuredImage && (
                  <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={related.featuredImage}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}
                <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[#001B34] transition-colors group-hover:text-orange-600 sm:text-lg">
                  {related.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {related.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(related.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Back to List Button */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={() => router.push("/news")}
          className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg"
        >
          Lihat Semua Artikel
        </button>
      </div>
    </article>
  );
}
