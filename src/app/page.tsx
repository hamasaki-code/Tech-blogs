import { getAllPosts } from "../lib/posts";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      {/* ✅ Tailwind 有効チェック用 */}
      <div className="bg-red-500 text-white text-3xl font-bold p-6 rounded-xl shadow-xl text-center mb-8">
        ✅ Tailwind は有効です！（赤背景）
      </div>

      <section className="w-full h-96 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-black text-center shadow-xl flex flex-col justify-center items-center border-4 border-black">
        <h1 className="text-5xl font-extrabold tracking-tight">🌈 背景グラデーションテスト</h1>
        <p className="mt-4 text-lg">これは絶対に色が見えるはず！</p>
      </section>


      {/* Blog List */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.meta.title}
              date={post.meta.date}
            />
          ))}
        </div>
      </main>
    </>
  );
}
