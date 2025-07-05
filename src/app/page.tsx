import { getAllPosts } from "../lib/posts";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">技術ブログ</h1>
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          slug={post.slug}
          title={post.meta.title}
          date={post.meta.date}
        />
      ))}
    </main>
  );
}
