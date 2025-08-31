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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 min-h-[60vh] flex flex-col">
            {/* 🔍 検索フォーム */}
            <div className="mb-10">
                <SearchInput onSearch={(q) => setQuery(q)} />
            </div>

            {/* セクションヘッダー */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                    技術ブログ一覧
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    開発の学びと知見を記録しています。
                </p>
                <div className="mt-4 w-16 h-1 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"></div>
            </div>

            {/* カードリスト */}
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 flex-1">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div
                            key={post.slug}
                            className="h-full flex flex-col transition-transform duration-300 ease-out hover:scale-105"
                        >
                            <PostCard
                                slug={post.slug}
                                title={post.meta.title}
                                date={post.meta.date}
                                tags={post.meta.tags}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center col-span-full py-20">
                        <div className="text-center max-w-md bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-10 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                記事が見つかりませんでした
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                検索条件を変更して、もう一度お試しください。
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
