"use client";

import { useEffect } from "react";

const themeChangeEvent = "themechange";

function readTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getThemeVariables(theme: "light" | "dark") {
  if (theme === "dark") {
    return {
      background: "#020617",
      primaryColor: "#0f172a",
      primaryTextColor: "#f8fafc",
      primaryBorderColor: "#334155",
      lineColor: "#94a3b8",
      secondaryColor: "#111827",
      tertiaryColor: "#1e293b",
      clusterBkg: "#0f172a",
      clusterBorder: "#334155",
      edgeLabelBackground: "#020617",
      fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    };
  }

  return {
    background: "#ffffff",
    primaryColor: "#f8fafc",
    primaryTextColor: "#0f172a",
    primaryBorderColor: "#cbd5e1",
    lineColor: "#64748b",
    secondaryColor: "#f1f5f9",
    tertiaryColor: "#e2e8f0",
    clusterBkg: "#f8fafc",
    clusterBorder: "#cbd5e1",
    edgeLabelBackground: "#ffffff",
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  };
}

export default function MermaidRenderer() {
  useEffect(() => {
    let cancelled = false;

    async function renderDiagrams() {
      const codeBlocks = Array.from(
        document.querySelectorAll<HTMLElement>("pre > code.language-mermaid"),
      );
      const existingContainers = Array.from(
        document.querySelectorAll<HTMLElement>(".mermaid-diagram[data-mermaid-source]"),
      );

      if (codeBlocks.length === 0 && existingContainers.length === 0) {
        return;
      }

      const { default: mermaid } = await import("mermaid");
      const theme = readTheme();

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: getThemeVariables(theme),
      });

      for (const codeBlock of codeBlocks) {
        const pre = codeBlock.parentElement;
        if (!pre || pre.dataset.mermaidProcessed === "true") {
          continue;
        }

        const source = codeBlock.textContent ?? "";
        const container = document.createElement("div");
        container.className = "mermaid-diagram";
        container.dataset.mermaidSource = source;
        pre.replaceWith(container);
      }

      const containers = Array.from(
        document.querySelectorAll<HTMLElement>(".mermaid-diagram[data-mermaid-source]"),
      );

      await Promise.all(
        containers.map(async (container, index) => {
          const source = container.dataset.mermaidSource ?? "";
          const diagramId = `mermaid-${theme}-${index}-${Date.now()}`;

          try {
            const { svg } = await mermaid.render(diagramId, source);
            if (!cancelled) {
              container.removeAttribute("data-mermaid-error");
              container.innerHTML = svg;
            }
          } catch (error) {
            if (!cancelled) {
              container.dataset.mermaidError = "true";
              container.textContent = error instanceof Error ? error.message : "Diagram render failed.";
            }
          }
        }),
      );
    }

    renderDiagrams();

    const handleThemeChange = () => {
      renderDiagrams();
    };

    window.addEventListener(themeChangeEvent, handleThemeChange);
    return () => {
      cancelled = true;
      window.removeEventListener(themeChangeEvent, handleThemeChange);
    };
  }, []);

  return null;
}
