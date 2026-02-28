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
        <div className="max-w-[1800px] mx-auto flex relative px-6">
          <div
            className="
    w-full
    max-w-6xl
    xl:max-w-4xl
    lg:max-w-4xl
    md:max-w-3xl
    sm:max-w-full
    bg-white dark:bg-gray-800
    p-4 sm:p-6 md:p-10 my-6 sm:my-12
    rounded-xl shadow-xl relative
    mx-auto
  "
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
              <div className="lg:hidden mb-6">
                <details className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-200">
                    Table of Contents
                  </summary>
                  <Toc items={toc} />
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
              className="
        hidden lg:block w-64 flex-shrink-0
        lg:ml-8
        2xl:absolute 2xl:right-[clamp(1rem,3vw,5rem)] 2xl:top-40
      "
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg sticky top-40 2xl:static">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                  Table of Contents
                </h2>
                <Toc items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </Layout>
  );
}
