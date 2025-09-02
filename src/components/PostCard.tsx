import Link from "next/link";

export default function PostCard({
    slug,
    title,
    date,
    tags = [],
}: {
    slug: string;
    title: string;
    date?: string;
    tags?: string[];
}) {
    return (
        <Link href={`/blog/${slug}`} className="block group h-full">
            <article
                className="relative flex flex-col h-full justify-between
                p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700
                bg-white dark:bg-gray-800
                shadow-md hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-400
                transition-all duration-300 ease-in-out"
            >
                <div
                    className="absolute top-0 left-0 w-full h-1
                    bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600
                    dark:from-purple-500 dark:via-purple-400 dark:to-purple-300
                    rounded-t-2xl"
                />

                <h2
                    className="text-lg sm:text-xl font-extrabold text-gray-800 dark:text-gray-100 mb-2
                    group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors line-clamp-2"
                >
                    {title}
                </h2>

                {/* date があるときだけ表示 */}
                {date && (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {date}
                    </p>
                )}

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-[11px] sm:text-xs font-semibold 
                                px-2.5 sm:px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-700 transition"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </article>
        </Link>
    );
}
