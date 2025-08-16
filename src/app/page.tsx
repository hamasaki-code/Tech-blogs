import { getAllPosts } from "../lib/posts";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-gray-900 py-24 text-center shadow-md">
        <h1 className="text-6xl font-extrabold leading-[1.2] tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 drop-shadow-lg">
          Hamayan.dev
        </h1>

        <p className="text-xl text-gray-800">
          技術・学び・発見を記録する、Hamayanの開発ノート。
        </p>
      </section>


      {/* Blog List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          技術ブログ一覧
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.meta.title}
              date={post.meta.date}
              tags={post.meta.tags}
            />
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 text-center py-6">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Hamayan.dev — All rights reserved.
        </p>
      </footer>
    </>
  );
}
