import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content");

export function getAllPosts() {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return {
        slug,
        meta: data as { title: string; date: string; tags: string[] },
        content,
    };
    });

  // 日付でソート（新しい順）
    return posts.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
}
