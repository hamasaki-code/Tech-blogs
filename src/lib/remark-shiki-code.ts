import { visit } from "unist-util-visit";
import { codeToHtml, bundledLanguages, type BundledLanguage } from "shiki";
import type { Code, Html, Parents, Root } from "mdast";
import type { Plugin } from "unified";

const textLanguage = "text";

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function readMetaValue(meta: string | null | undefined, key: string) {
  if (!meta) return "";

  const match = meta.match(new RegExp(`${key}=("[^"]+"|'[^']+'|\\S+)`));
  if (!match) return "";

  return match[1].replace(/^["']|["']$/g, "");
}

function getShikiLanguage(language: string | null | undefined) {
  const normalized = language?.trim().toLowerCase();
  if (!normalized) return textLanguage;

  return normalized in bundledLanguages ? normalized : textLanguage;
}

function withCodeAttributes(html: string, node: Code) {
  const language = node.lang ?? "";
  const filename = readMetaValue(node.meta, "filename") || readMetaValue(node.meta, "title");
  const attributes = [
    `class="language-${escapeAttribute(language || "text")}"`,
    `data-language="${escapeAttribute(language)}"`,
    `data-meta="${escapeAttribute(node.meta ?? "")}"`,
    `data-filename="${escapeAttribute(filename)}"`,
  ].join(" ");

  return html.replace("<code>", `<code ${attributes}>`);
}

function replaceChild(parent: Parents, index: number, node: Html) {
  (parent.children as Array<Code | Html>)[index] = node;
}

export const remarkShikiCode: Plugin<[], Root> = () => {
  return async (tree: Root) => {
    const replacements: Promise<void>[] = [];

    visit(tree, "code", (node: Code, index: number | undefined, parent: Parents | undefined) => {
      if (index === undefined || !parent || node.lang === "mermaid") return;

      replacements.push(
        codeToHtml(node.value, {
          lang: getShikiLanguage(node.lang) as BundledLanguage,
          themes: {
            light: "light-plus",
            dark: "one-dark-pro",
          },
        }).then((highlightedHtml) => {
          replaceChild(parent, index, {
            type: "html",
            value: withCodeAttributes(highlightedHtml, node),
          });
        }),
      );
    });

    await Promise.all(replacements);
  };
};
