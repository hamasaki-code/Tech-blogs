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
    <main className="max-w-3xl mx-auto px-6 py-12 bg-white shadow-lg rounded-lg border border-gray-100">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
          {data.title}
        </h1>
        <p className="text-gray-500 text-sm mt-2">{data.date}</p>
      </header>

      <article
        className="prose prose-lg prose-neutral max-w-none prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} My Blog. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
