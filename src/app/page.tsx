import Layout from "../components/Layout";
import Hero from "../components/Hero";
import { getAllPosts } from "../lib/posts";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <Layout>
      <Hero
        title="Hamayan.dev"
        subtitle="技術・学び・発見を記録する、Hamayanの開発ノート。"
      />

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
    </Layout>
  );
}
