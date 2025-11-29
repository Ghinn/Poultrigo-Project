import NewsDetail from "@/components/news/news-detail";
import { getNewsById, getPublishedNews } from "@/actions/news";
import { getSession } from "@/actions/auth";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getNewsById(id);
  const allNews = await getPublishedNews();
  const session = await getSession();

  let backUrl = "/";
  let backLabel = "Kembali ke Beranda";

  if (session?.role === "operator") {
    backUrl = "/operator";
    backLabel = "Kembali ke Dashboard";
  } else if (session?.role === "admin") {
    backUrl = "/admin";
    backLabel = "Kembali ke Dashboard";
  } else if (session?.role === "guest") {
    backUrl = "/guest";
    backLabel = "Kembali ke Dashboard";
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <NewsDetail article={article} allNews={allNews} backUrl={backUrl} backLabel={backLabel} />
      </div>
    </div>
  );
}
