import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Layout from "@/components/Layout";
import Toc from "@/components/Toc";
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
    .use(remarkExtractToc, { target: toc })
    .use(html, { sanitize: false })
    .process(post.content);

  const contentHtml = processedContent.toString();

  return (
    <Layout>
      <div className="w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-black py-8 sm:py-12">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,56rem)_16rem] xl:grid-cols-[minmax(0,64rem)_18rem] lg:items-start lg:justify-center">

          {/* 記事本体 */}
          <div
            className="w-full bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-10 my-6 sm:my-12 rounded-xl shadow-xl"
          >
            <section className="w-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 py-8 sm:py-12 text-center shadow-sm mb-6 rounded-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400">
                {post.meta.title}
              </h1>
            </section>

            {post.meta.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.meta.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {post.meta.date && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                {post.meta.date}
              </p>
            )}

            {toc.length > 0 && (
              <div className="lg:hidden sticky top-20 z-30 mb-6">
                <details className="group bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-md">
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-200">
                    Table of Contents
                  </summary>
                  <Toc
                    items={toc}
                    showTitle={false}
                    className="mt-4 max-h-[60vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none dark:bg-transparent"
                  />
                </details>
              </div>
            )}

            <article
              className="markdown-body prose prose-gray dark:prose-invert
          prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-p:text-gray-800 dark:prose-p:text-gray-200
          prose-li:text-gray-800 dark:prose-li:text-gray-200"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          {toc.length > 0 && (
            <aside
              className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-6"
            >
              <Toc items={toc} />
            </aside>
          )}
        </div>
      </div>
    </Layout>
  );
}
