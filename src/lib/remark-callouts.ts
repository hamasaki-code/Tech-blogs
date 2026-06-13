import { visit } from "unist-util-visit";
import type { Blockquote, Paragraph, Root, Text } from "mdast";
import type { Properties } from "hast";
import type { Plugin } from "unified";

const calloutTitles = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
} as const;

type CalloutType = keyof typeof calloutTitles;
type NodeData = { hName?: string; hProperties?: Properties } & Record<string, unknown>;

function isParagraph(node: unknown): node is Paragraph {
  return !!node && typeof node === "object" && (node as { type?: unknown }).type === "paragraph";
}

function isText(node: unknown): node is Text {
  return !!node && typeof node === "object" && (node as { type?: unknown }).type === "text";
}

function getCalloutType(value: string): CalloutType | null {
  const match = value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/);
  return match ? (match[1].toLowerCase() as CalloutType) : null;
}

export const remarkCallouts: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const firstChild = node.children[0];
      if (!isParagraph(firstChild)) return;

      const firstText = firstChild.children[0];
      if (!isText(firstText)) return;

      const calloutType = getCalloutType(firstText.value);
      if (!calloutType) return;

      firstText.value = firstText.value.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/, "");

      if (firstText.value.length === 0) {
        firstChild.children.shift();
      }

      if (firstChild.children.length === 0) {
        node.children.shift();
      }

      const data = (node.data ??= {}) as NodeData;
      data.hName = "aside";
      data.hProperties = {
        className: ["markdown-callout", `markdown-callout--${calloutType}`],
      };

      node.children.unshift({
        type: "paragraph",
        data: {
          hProperties: {
            className: ["markdown-callout-title"],
          },
        },
        children: [{ type: "text", value: calloutTitles[calloutType] }],
      });
    });
  };
};
