"use client";

import { useEffect } from "react";

function readLanguage(codeBlock: HTMLElement) {
  const datasetLanguage = codeBlock.dataset.language;
  if (datasetLanguage) return datasetLanguage;

  const className = Array.from(codeBlock.classList).find((value) => value.startsWith("language-"));
  return className?.replace(/^language-/, "") ?? "";
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.append(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("Copy failed");
  }
}

function showCopyStatus(
  copyButton: HTMLButtonElement,
  status: HTMLElement,
  state: "copied" | "failed",
) {
  const resetTimer = Number(copyButton.dataset.resetTimer);
  if (resetTimer) {
    window.clearTimeout(resetTimer);
  }

  copyButton.dataset.copyState = state;
  status.dataset.copyState = state;

  if (state === "copied") {
    copyButton.textContent = "Copied";
    status.textContent = "Copied to clipboard";
  } else {
    copyButton.textContent = "Retry";
    status.textContent = "Copy failed";
  }

  copyButton.dataset.resetTimer = String(
    window.setTimeout(() => {
      delete copyButton.dataset.copyState;
      delete copyButton.dataset.resetTimer;
      delete status.dataset.copyState;
      copyButton.textContent = "Copy";
      status.textContent = "";
    }, 2200),
  );
}

export default function CodeBlockEnhancer() {
  useEffect(() => {
    const controller = new AbortController();
    const codeBlocks = Array.from(
      document.querySelectorAll<HTMLElement>("pre > code"),
    );

    for (const codeBlock of codeBlocks) {
      if (codeBlock.classList.contains("language-mermaid")) {
        continue;
      }

      const pre = codeBlock.parentElement;
      if (!pre) {
        continue;
      }

      const language = readLanguage(codeBlock);
      const filename = codeBlock.dataset.filename ?? "";
      let wrapper = pre.parentElement;

      if (!wrapper?.classList.contains("markdown-codeblock")) {
        wrapper = document.createElement("div");
        wrapper.className = "markdown-codeblock";

        const header = document.createElement("div");
        const label = document.createElement("div");
        const actions = document.createElement("div");
        const status = document.createElement("span");
        const copyButton = document.createElement("button");

        header.className = "markdown-codeblock-header";
        label.className = "markdown-codeblock-label";
        actions.className = "markdown-codeblock-actions";
        status.className = "markdown-codeblock-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        copyButton.className = "markdown-codeblock-copy";
        copyButton.type = "button";
        copyButton.textContent = "Copy";
        copyButton.setAttribute("aria-label", "Copy code");

        label.textContent = filename || language || "code";
        actions.append(status, copyButton);
        header.append(label, actions);
        pre.replaceWith(wrapper);
        wrapper.append(header, pre);
      }

      const copyButton = wrapper.querySelector<HTMLButtonElement>(".markdown-codeblock-copy");
      if (!copyButton) {
        continue;
      }

      let status = wrapper.querySelector<HTMLElement>(".markdown-codeblock-status");
      if (!status) {
        status = document.createElement("span");
        status.className = "markdown-codeblock-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");

        const actions = wrapper.querySelector<HTMLElement>(".markdown-codeblock-actions");
        if (actions) {
          actions.prepend(status);
        } else {
          const header = wrapper.querySelector<HTMLElement>(".markdown-codeblock-header");
          const newActions = document.createElement("div");

          if (!header) {
            continue;
          }

          newActions.className = "markdown-codeblock-actions";
          copyButton.replaceWith(newActions);
          newActions.append(status, copyButton);
          header.append(newActions);
        }
      }

      copyButton.addEventListener(
        "click",
        async () => {
          const code = codeBlock.textContent ?? "";
          try {
            await copyToClipboard(code);
            showCopyStatus(copyButton, status, "copied");
          } catch {
            showCopyStatus(copyButton, status, "failed");
          }
        },
        { signal: controller.signal },
      );
    }

    return () => controller.abort();
  }, []);

  return null;
}
