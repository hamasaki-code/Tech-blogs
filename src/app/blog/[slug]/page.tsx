import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import { remarkExtractToc } from "@/lib/remark-toc";
import Layout from "@/components/Layout";
import Toc from "@/components/Toc"; // 👈 スクロールスパイ対応のTOC

export async function generateStaticParams() {
  const files = fs.readdirSync("src/content");
  return files.map((file) => ({
    slug: file.replace(/\.md$/, ""),
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const filePath = path.join("src/content", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  // 👇 TOC をここで収集
  const toc: { depth: number; text: string; id: string }[] = [];
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkExtractToc(toc))
    .use(html, { sanitize: false })
    .process(content);

  const contentHtml = processedContent.toString();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-10 my-12 rounded-xl shadow-lg relative">
        {/* タイトル */}
        <section className="w-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-gray-900 py-14 text-center shadow-sm mb-6 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
            {data.title}
          </h1>
        </section>

        {/* タグ */}
        {data.tags && (
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
        <p className="text-center text-sm text-gray-500 mb-8">{data.date}</p>

        {/* 本文 */}
        <article
          className="markdown-body prose prose-lg lg:prose-xl max-w-none prose-headings:text-gray-800 prose-a:text-blue-600 dark:prose-invert dark:prose-headings:text-gray-100"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* 目次 */}
        {toc.length > 0 && (
          <aside
            className="hidden lg:block fixed top-40 w-64"
            style={{
              right: "calc((100vw - 1024px) / 2 / 2)",
            }}
          >
            <Toc toc={toc} />
          </aside>
        )}
      </div>
    </Layout>
  );
}
