"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import PostCard from "./PostCard";

export default function SearchablePosts({ posts }: { posts: any[] }) {
    const [query, setQuery] = useState("");

    const filteredPosts = posts.filter(
        (post) =>
            post.meta.title.toLowerCase().includes(query.toLowerCase()) ||
            post.meta.tags.some((tag: string) =>
                tag.toLowerCase().includes(query.toLowerCase())
            )
    );

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* 検索フォーム */}
            <div className="mb-10">
                <SearchInput onSearch={(q) => setQuery(q)} />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                技術ブログ一覧
            </h2>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <PostCard
                            key={post.slug}
                            slug={post.slug}
                            title={post.meta.title}
                            date={post.meta.date}
                            tags={post.meta.tags}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No articles found.
                    </p>
                )}
            </div>
        </main>
    );
}
