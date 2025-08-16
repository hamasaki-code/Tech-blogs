import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

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
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg p-10 text-white text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">{data.title}</h1>
        <p className="text-md mt-4 opacity-90">{data.date}</p>
      </section>

      {/* Markdown content */}
      <article className="markdown-body prose lg:prose-xl max-w-none">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>

      {/* Tags */}
      {data.tags && (
        <div className="mt-8 flex flex-wrap gap-2">
          {data.tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Hamayan.dev — All rights reserved.
        </p>
      </footer>
    </main>
  );
}
