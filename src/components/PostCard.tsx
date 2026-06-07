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
        <Link href={`/blog/${slug}`} className="group block h-full">
            <article className="relative flex h-full flex-col justify-between overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_16px_48px_rgba(15,23,42,0.08)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-violet-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_16px_48px_rgba(2,6,23,0.26)] dark:hover:border-violet-400/70 dark:hover:bg-slate-900 sm:p-6">
                <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400" />

                <h2 className="mb-3 line-clamp-2 text-lg font-extrabold leading-snug text-slate-950 transition-colors group-hover:text-violet-700 dark:text-slate-100 dark:group-hover:text-violet-200 sm:text-xl">
                    {title}
                </h2>

                {date && (
                    <p className="mb-5 font-mono text-xs text-slate-500 dark:text-slate-500 sm:text-sm">
                        {date}
                    </p>
                )}

                {tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="border border-violet-300 bg-violet-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-violet-700 transition group-hover:border-violet-400 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200 dark:group-hover:border-violet-300/60 sm:px-3 sm:text-xs"
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
