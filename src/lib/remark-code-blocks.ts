import { visit } from "unist-util-visit";
import type { Code, Root } from "mdast";
import type { Properties } from "hast";
import type { Plugin } from "unified";

type CodeData = { hProperties?: Properties } & Record<string, unknown>;

function readMetaValue(meta: string | null | undefined, key: string) {
  if (!meta) return undefined;

  const match = meta.match(new RegExp(`${key}=("[^"]+"|'[^']+'|\\S+)`));
  if (!match) return undefined;

  return match[1].replace(/^["']|["']$/g, "");
}

export const remarkCodeBlocks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "code", (node: Code) => {
      const data = (node.data ??= {}) as CodeData;
      data.hProperties = {
        ...(data.hProperties ?? {}),
        "data-language": node.lang ?? "",
        "data-meta": node.meta ?? "",
        "data-filename": readMetaValue(node.meta, "filename") ?? readMetaValue(node.meta, "title") ?? "",
      };
    });
  };
};
