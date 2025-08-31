"use client";

import { useMemo, useState } from "react";
import SearchInput from "./SearchInput";
import PostCard from "./PostCard";

/** 記事メタ情報の型 */
export type PostMeta = {
    title: string;
    date?: string;
    tags?: string[];
};

/** 記事の型 */
export type Post = {
    slug: string;
    meta: PostMeta;
};

type Props = {
    posts: Post[];
};

export default function SearchablePosts({ posts }: Props) {
    const [query, setQuery] = useState<string>("");

    const filteredPosts = useMemo(() => {
        const q = query.toLowerCase().trim();
        return posts.filter((post) => {
            const titleHit = post.meta.title.toLowerCase().includes(q);
            const tags = post.meta.tags ?? [];
            const tagHit = tags.some((tag) => tag.toLowerCase().includes(q));
            return titleHit || tagHit;
        });
    }, [posts, query]);

    return (
        <main
            className="max-w-3xl sm:max-w-5xl lg:max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-16 md:pb-20
            min-h-[60vh] flex flex-col"
        >
            {/* 🔍 検索フォーム */}
            <div className="mb-8 sm:mb-10">
                <SearchInput onSearch={(v: string) => setQuery(v)} />
            </div>

            {/* セクションヘッダー */}
            <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                    技術ブログ一覧
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    開発の学びと知見を記録しています。
                </p>
                <div
                    className="mt-4 w-12 sm:w-16 h-1 mx-auto
                    bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"
                />
            </div>

            {/* カードリスト */}
            <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 flex-1">
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
                                tags={post.meta.tags ?? []}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center col-span-full py-12 sm:py-20">
                        <div
                            className="text-center max-w-md
                            bg-gradient-to-br from-gray-50 to-white
                            dark:from-gray-800 dark:to-gray-900
                            border border-gray-200 dark:border-gray-700
                            rounded-lg p-6 sm:p-10 shadow-sm"
                        >
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
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
