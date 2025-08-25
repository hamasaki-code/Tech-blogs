// lib/remark-toc.ts
import { visit } from "unist-util-visit";

export function remarkExtractToc(toc: any[]) {
    const slugCount: Record<string, number> = {}; // 👈 同じ見出し用カウンタ

    return () => (tree: any) => {
        visit(tree, "heading", (node: any) => {
            if (node.depth <= 3) {
                const text = node.children
                    .filter((c: any) => c.type === "text" || c.type === "inlineCode")
                    .map((c: any) => c.value)
                    .join(" ");

                let slug = text
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "");

                // 重複を避けるためインデックスを追加
                if (slugCount[slug]) {
                    slugCount[slug] += 1;
                    slug = `${slug}-${slugCount[slug]}`;
                } else {
                    slugCount[slug] = 1;
                }

                if (!node.data) node.data = {};
                if (!node.data.hProperties) node.data.hProperties = {};
                node.data.hProperties.id = slug;

                toc.push({ depth: node.depth, text, id: slug });
            }
        });
    };
}
