import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function generateStaticParams() {
    const files = fs.readdirSync("src/content");
    return files.map((file) => ({
    slug: file.replace(/\.md$/, ""),
}));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const filePath = path.join("src/content", `${params.slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

return (
    <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        <p className="text-gray-500 text-sm mb-6">{data.date}</p>
        <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
    );
}
