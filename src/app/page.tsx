import { getAllPosts } from "@/lib/posts";
import SearchablePosts from "@/components/SearchablePosts";
import ThemeToggle from "@/components/ThemeToggle";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="relative w-full overflow-hidden border-b border-slate-200 bg-slate-50 px-4 pt-24 pb-16 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),transparent_34%,rgba(14,165,233,0.07)_68%,transparent)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.18),transparent_34%,rgba(14,165,233,0.08)_68%,transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] dark:bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
            Development Notes
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-slate-950 dark:text-white sm:text-6xl md:text-7xl">
            Hamayan.dev
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            実装で学んだこと、詰まったこと、あとから読み返したい技術メモを記録するブログです。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="border border-violet-300 bg-violet-50 px-3 py-1.5 font-mono text-xs font-semibold text-violet-700 dark:border-violet-400/40 dark:bg-violet-400/10 dark:text-violet-200">
              Next.js
            </span>
            <span className="border border-cyan-300 bg-cyan-50 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200">
              Rails
            </span>
            <span className="border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-600 dark:border-slate-500/40 dark:bg-slate-900/70 dark:text-slate-300">
              Flutter
            </span>
          </div>
        </div>
      </section>

      <div className="w-full border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-12 dark:border-slate-900 dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] sm:py-16">
        <SearchablePosts posts={posts} />
      </div>
    </>
  );
}
