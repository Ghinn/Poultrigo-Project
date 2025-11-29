import NewsList from "@/components/news/news-list";
import { getPublishedNews } from "@/actions/news";
import { getSession } from "@/actions/auth";
import { type NewsArticle } from "@/utils/news";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  let allNews: NewsArticle[] = [];
  let session = null;
  
  try {
    allNews = await getPublishedNews();
    session = await getSession();
  } catch (error) {
    // Fallback if database connection fails during build
    console.error('Error loading news:', error);
  }

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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <NewsList initialNews={allNews} backUrl={backUrl} backLabel={backLabel} />
      </div>
    </div>
  );
}
