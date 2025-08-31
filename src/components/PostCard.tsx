import Link from "next/link";

export default function PostCard({
    slug,
    title,
    date,
    tags = [],
}: {
    slug: string;
    title: string;
    date: string;
    tags?: string[];
}) {
    return (
        <Link href={`/blog/${slug}`} className="block group h-full">
            <article className="relative flex flex-col h-full justify-between
            p-6 rounded-2xl border border-gray-100
            bg-white shadow-md hover:shadow-xl hover:border-purple-300
            transition-all duration-300 ease-in-out">

                <div className="absolute top-0 left-0 w-full h-1
                bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600
                rounded-t-2xl" />

                <h2 className="text-xl font-extrabold text-gray-800 mb-2
                group-hover:text-purple-700 transition-colors line-clamp-2">
                    {title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{date}</p>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-purple-100 text-purple-800 text-xs font-semibold 
                                px-3 py-1 rounded-full hover:bg-purple-200 transition"
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
