import Link from "next/link";

export default function PostCard({
    slug,
    title,
    date,
    excerpt,
    tags = [],
}: {
    slug: string;
    title: string;
    date: string;
    excerpt?: string;
    tags?: string[];
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                <Link href={`/blog/${slug}`} className="hover:underline">
                    {title}
                </Link>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{date}</p>
            {excerpt && <p className="text-gray-700 dark:text-gray-300 mb-4">{excerpt}</p>}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-3 py-1 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
