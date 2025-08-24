import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import Layout from "@/components/Layout";

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

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content);

  const contentHtml = processedContent.toString();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-10 my-12 rounded-xl shadow-lg">
        {/* タイトル */}
        <section className="w-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200
                      text-gray-900 py-14 text-center shadow-sm mb-6 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2
                  text-transparent bg-clip-text bg-gradient-to-r
                  from-pink-600 via-purple-600 to-blue-600">
            {data.title}
          </h1>
        </section>

        {data.tags && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {data.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800
                    dark:bg-blue-900 dark:text-blue-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 日付 */}
        <p className="text-center text-sm text-gray-500 mb-8">{data.date}</p>

        {/* 本文 */}
        <article className="markdown-body prose prose-lg lg:prose-xl max-w-none
                      prose-headings:text-gray-800 prose-a:text-blue-600
                      dark:prose-invert dark:prose-headings:text-gray-100">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>


        {/* サイドバー（目次） */}
        <aside
          className="hidden lg:block fixed top-40 w-64"
          style={{
            right: "calc((100vw - 1024px) / 2 / 2)",
          }}
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                      border border-gray-200 dark:border-gray-700
                      p-4 rounded-lg shadow-sm text-sm">
            <h2 className="font-bold mb-2 text-gray-700 dark:text-gray-200">目次</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="#見出し1" className="hover:text-blue-600">見出し1</a></li>
              <li><a href="#見出し2" className="hover:text-blue-600">見出し2</a></li>
              <li><a href="#見出し3" className="hover:text-blue-600">見出し3</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </Layout >
  );
}
