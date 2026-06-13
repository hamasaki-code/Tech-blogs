import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";
import Layout from "@/components/Layout";
import MermaidRenderer from "@/components/MermaidRenderer";
import Toc from "@/components/Toc";
import { remarkCallouts } from "@/lib/remark-callouts";
import { remarkCodeBlocks } from "@/lib/remark-code-blocks";
import { remarkShikiCode } from "@/lib/remark-shiki-code";
import { remarkExtractToc } from "@/lib/remark-toc";
import {
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/posts";

export const revalidate = 300;

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | Hamayan.dev" };
  }

  return {
    title: `${post.meta.title} | Hamayan.dev`,
    description: post.meta.excerpt || "Hamayan.dev post detail page",
  };
}

export default async function BlogPost(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: requestedSlug } = await params;
  const decodedRequestedSlug = decodeSlug(requestedSlug);
  const post = await getPostBySlug(requestedSlug);

  if (!post) {
    notFound();
  }

  if (decodedRequestedSlug === post.sourceSlug && post.slug !== post.sourceSlug) {
    permanentRedirect(`/blog/${encodeURIComponent(post.slug)}`);
  }

  const toc: { depth: number; text: string; id: string }[] = [];
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkCallouts)
    .use(remarkCodeBlocks)
    .use(remarkShikiCode)
    .use(remarkExtractToc, { target: toc })
    .use(html, { sanitize: false })
    .process(post.content);

  const contentHtml = processedContent.toString();

  return (
    <Layout>
      <div className="w-full bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-8 dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] sm:py-12">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,56rem)_16rem] lg:items-start lg:justify-center xl:grid-cols-[minmax(0,64rem)_18rem]">
          <div className="w-full border border-slate-200 bg-white p-4 shadow-[0_22px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-[0_22px_70px_rgba(2,6,23,0.34)] sm:my-8 sm:p-6 md:p-10">
            <section className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-300">
                Article
              </p>
              <h1 className="text-3xl font-black text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
                {post.meta.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {post.meta.date && (
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-500">
                    {post.meta.date}
                  </p>
                )}

                {post.meta.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.meta.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="border border-violet-300 bg-violet-50 px-2.5 py-1 font-mono text-xs font-semibold text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {toc.length > 0 && (
              <div className="mb-8 lg:hidden">
                <details className="group border border-slate-200 bg-white/95 p-4 shadow-[0_16px_48px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_16px_48px_rgba(2,6,23,0.28)]">
                  <summary className="cursor-pointer font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
                    Contents
                  </summary>
                  <Toc
                    items={toc}
                    showTitle={false}
                    className="mt-4 max-h-[60vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none"
                  />
                </details>
              </div>
            )}

            <article
              className="markdown-body prose prose-gray max-w-none prose-sm sm:prose-base md:prose-lg lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            <CodeBlockEnhancer />
            <MermaidRenderer />
          </div>

          {toc.length > 0 && (
            <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto py-6 lg:block">
              <Toc items={toc} />
            </aside>
          )}
        </div>
      </div>
    </Layout>
  );
}
