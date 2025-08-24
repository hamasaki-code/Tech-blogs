import { getAllPosts } from "@/lib/posts";
import SearchablePosts from "@/components/SearchablePosts";

export default async function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="w-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200
                    text-gray-900 py-24 text-center shadow-md overflow-visible">
        <h1 className="text-6xl font-extrabold leading-snug tracking-tight mb-4
                text-transparent bg-clip-text
                bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 drop-shadow-lg">
          Hamayan.dev
        </h1>

        <p className="text-xl text-gray-800 leading-relaxed">
          技術・学び・発見を記録する、Hamayanの開発ノート。
        </p>
      </section>


      {/* クライアントに渡す */}
      <SearchablePosts posts={posts} />
    </>
  );
}
