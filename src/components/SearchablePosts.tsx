"use client";

import { useMemo, useState } from "react";
import SearchInput from "./SearchInput";
import PostCard from "./PostCard";

export type PostMeta = {
    title: string;
    date?: string;
    tags?: string[];
    excerpt?: string;
};

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
        if (!q) {
            return posts;
        }

        return posts.filter((post) => {
            const titleHit = post.meta.title.toLowerCase().includes(q);
            const tags = post.meta.tags ?? [];
            const tagHit = tags.some((tag) => tag.toLowerCase().includes(q));
            const excerpt = post.meta.excerpt ?? "";
            const excerptHit = excerpt.toLowerCase().includes(q);

            return titleHit || tagHit || excerptHit;
        });
    }, [posts, query]);

    return (
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col px-4 pt-10 pb-16 text-slate-950 dark:text-slate-100 sm:max-w-5xl sm:px-6 md:pt-12 md:pb-20 lg:max-w-7xl lg:px-8">
            <div className="mb-8 sm:mb-10">
                <SearchInput value={query} onSearch={(v: string) => setQuery(v)} />
            </div>

            <div className="mb-10 sm:mb-12">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-300">
                    Articles
                </p>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                    最新記事
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                    タイトル、タグ、概要から技術メモを検索できます。
                </p>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-violet-500 via-slate-300 to-transparent dark:via-slate-700" />
            </div>

            <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post.slug} className="flex h-full flex-col">
                            <PostCard
                                slug={post.slug}
                                title={post.meta.title}
                                date={post.meta.date}
                                tags={post.meta.tags ?? []}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex items-center justify-center py-12 sm:py-20">
                        <div className="max-w-md border border-slate-200 bg-white p-6 text-center shadow-[0_16px_48px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_16px_48px_rgba(2,6,23,0.26)] sm:p-10">
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 sm:text-lg">
                                条件に一致する記事が見つかりませんでした
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                「{query}」に一致する記事はありません。キーワードを短くするか、別の言葉で検索してください。
                            </p>
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="mt-4 inline-flex items-center justify-center border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-violet-400/50 dark:text-violet-200 dark:hover:bg-violet-400/10"
                            >
                                検索をクリア
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
