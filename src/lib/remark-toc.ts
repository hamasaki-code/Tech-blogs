// src/lib/remark-toc.ts
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Root, Heading } from "mdast";
import type { Properties } from "hast";
import type { Plugin } from "unified";

export type TocItem = { depth: number; text: string; id: string };

type VFileLike = { data?: Record<string, unknown> };
type HeadingData = { hProperties?: Properties } & Record<string, unknown>;

/** プラグインのオプション（target に TOC を格納したい配列を渡せる） */
export type RemarkTocOptions = {
    target?: TocItem[];
};

/** 安全ガード */
function isRoot(x: unknown): x is Root {
    return !!x && typeof x === "object" && (x as { type?: unknown }).type === "root";
}
function isHeadingNode(n: unknown): n is Heading {
    return !!n && typeof n === "object" && (n as { type?: unknown }).type === "heading";
}

/**
 * remark プラグイン：見出し(H1〜H3)から TOC を抽出し、
 * - options.target があればそこへ格納
 * - なければ file.data.toc に格納
 * 各見出しに id を付与（rehype で hProperties が反映される）
 */
export const remarkExtractToc: Plugin<[RemarkTocOptions?], Root> = (options) => {
    return (tree: Root, file?: VFileLike) => {
        if (!isRoot(tree) || !Array.isArray((tree as unknown as { children?: unknown[] }).children)) {
            if (file) {
                file.data ??= {};
                (file.data as Record<string, unknown>).toc = [];
            }
            return;
        }

        const slugger = new GithubSlugger();
        const toc: TocItem[] = [];

        visit(tree, "heading", (node) => {
            if (!isHeadingNode(node)) return;
            if (node.depth >= 1 && node.depth <= 3) {
                const text = toString(node);
                const id = slugger.slug(text);

                const data = (node.data ??= {}) as HeadingData;
                data.hProperties ??= {};
                data.hProperties.id = id;

                toc.push({ depth: node.depth, text, id });
            }
        });

        if (options?.target) {
            // 渡された配列を差し替え（参照を保ちつつ中身だけ入れ替える）
            options.target.splice(0, options.target.length, ...toc);
        } else if (file) {
            file.data ??= {};
            (file.data as Record<string, unknown>).toc = toc;
        }
    };
};
