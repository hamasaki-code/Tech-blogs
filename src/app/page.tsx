import { getAllPosts } from "@/lib/posts";
import SearchablePosts from "@/components/SearchablePosts";

export default async function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      {/* ヒーローセクション */}
      <section className="w-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200
                    text-gray-900 py-24 text-center shadow-md overflow-visible">
        <h1 className="text-6xl font-extrabold leading-snug tracking-tight mb-4
                text-transparent bg-clip-text
                bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 drop-shadow-lg">
          Hamayan.dev
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
          技術・学び・発見を記録する、Hamayanの開発記事。
        </p>


      </section>

      {/* 記事一覧背景にブランドカラーの淡いグラデーションを適用 */}
      <div className="w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16">
        <SearchablePosts posts={posts} />
      </div>
    </>
  );
}
