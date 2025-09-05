import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import { remarkExtractToc } from "@/lib/remark-toc";
import Layout from "@/components/Layout";
import Toc from "@/components/Toc";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const files = fs.readdirSync("src/content");
  return files.map((file) => ({
    slug: file.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const filePath = path.join("src/content", `${decoded}.md`);

  if (!fs.existsSync(filePath)) {
    return { title: "記事が見つかりません | Hamayan.dev" };
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    title: `${data.title} | Hamayan.dev`,
    description: data.excerpt || "Hamayan.dev の記事詳細ページ",
  };
}

export default async function BlogPost(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const filePath = path.join("src/content", `${decoded}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const toc: { depth: number; text: string; id: string }[] = [];
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkExtractToc, { target: toc })
    .use(html, { sanitize: false })
    .process(content);

  const contentHtml = processedContent.toString();

  return (
    <Layout>
      <div className="w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-black py-8 sm:py-12">
        {/* 記事＋目次の横並びコンテナ */}
        <div className="max-w-[1800px] mx-auto flex relative px-6">

          {/* 記事本体 */}
          <div
            className="
    w-full
    max-w-6xl       /* ← デフォルトを広めにする（1152px） */
    xl:max-w-4xl    /* 1280px 以下では少し狭くする（1024px） */
    lg:max-w-4xl    /* 1024px 以下ではさらに狭くする（896px） */
    md:max-w-3xl    /* 768px 以下ではもっと狭くする（768px） */
    sm:max-w-full   /* スマホは幅いっぱい */
    bg-white dark:bg-gray-800
    p-4 sm:p-6 md:p-10 my-6 sm:my-12
    rounded-xl shadow-xl relative
    mx-auto
  "
          >

            {/* タイトル */}
            <section className="w-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 py-8 sm:py-12 text-center shadow-sm mb-6 rounded-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400">
                {data.title}
              </h1>
            </section>


            {/* タグ */}
            {Array.isArray(data.tags) && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {data.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 日付 */}
            {data.date && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                {data.date}
              </p>
            )}

            {/* モバイル用 TOC */}
            {toc.length > 0 && (
              <div className="lg:hidden mb-6">
                <details className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-200">
                    目次
                  </summary>
                  <Toc items={toc} />
                </details>
              </div>
            )}

            {/* 本文 */}
            <article
              className="markdown-body prose prose-gray dark:prose-invert
          prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-p:text-gray-800 dark:prose-p:text-gray-200
          prose-li:text-gray-800 dark:prose-li:text-gray-200"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          {/* PC用目次 */}
          {toc.length > 0 && (
            <aside
              className="
        hidden lg:block w-64 flex-shrink-0
        lg:ml-8
        2xl:absolute 2xl:right-[clamp(1rem,3vw,5rem)] 2xl:top-40
      "
            >
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg sticky top-40 2xl:static">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">目次</h2>
                <Toc items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </Layout>
  );
}
