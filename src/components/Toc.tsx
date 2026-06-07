"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TocItem = {
    depth: number;
    text: string;
    id: string;
};

type TocProps = {
    items: TocItem[];
    className?: string;
    showTitle?: boolean;
};

export default function Toc({ items, className = "", showTitle = true }: TocProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const isManualScroll = useRef(false);

    const tocItems = useMemo(() => items.filter((item) => item.depth <= 2), [items]);

    useEffect(() => {
        const handleScroll = () => {
            if (isManualScroll.current) return;

            const scrollY = window.scrollY + 120;
            let current: string | null = tocItems[0]?.id || null;

            for (let i = 0; i < tocItems.length; i++) {
                const el = document.getElementById(tocItems[i].id);
                const nextEl =
                    i + 1 < tocItems.length ? document.getElementById(tocItems[i + 1].id) : null;

                if (el) {
                    const thisTop = el.offsetTop;
                    const nextTop = nextEl ? nextEl.offsetTop : Infinity;

                    if (scrollY >= thisTop && scrollY < nextTop) {
                        current = tocItems[i].id;
                        break;
                    }
                }
            }

            if (current) setActiveId(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [tocItems]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
            const headerOffset = 96;
            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            isManualScroll.current = true;
            setActiveId(id);

            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            history.replaceState(null, "", `#${encodeURIComponent(id)}`);

            setTimeout(() => {
                isManualScroll.current = false;
            }, 600);
        }
    };

    if (tocItems.length === 0) return null;

    return (
        <nav
            className={`border border-slate-200 bg-white/90 p-5 text-sm shadow-[0_16px_48px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-[0_16px_48px_rgba(2,6,23,0.28)] ${className}`}
            aria-label="記事の目次"
        >
            {showTitle && (
                <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">
                    Contents
                </h2>
            )}
            <ul className="space-y-3 pl-4">
                {tocItems.map((item, idx) => (
                    <li key={item.id} className="relative pl-6">
                        <span
                            className={`absolute left-0 top-2 z-10 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${activeId === item.id
                                ? "bg-violet-500 dark:bg-violet-400"
                                : "bg-slate-300 dark:bg-slate-600"
                                }`}
                            style={{
                                width: item.depth === 1 ? "12px" : "9px",
                                height: item.depth === 1 ? "12px" : "9px",
                                borderRadius: "3px",
                                boxShadow:
                                    activeId === item.id
                                        ? "0 0 10px rgba(167,139,250,0.85)"
                                        : "none",
                            }}
                        />

                        {idx < tocItems.length - 1 && (
                            <span className="absolute left-0 top-2 bottom-[-16px] w-px bg-slate-300 dark:bg-slate-700" />
                        )}

                        <a
                            href={`#${encodeURIComponent(item.id)}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={`block leading-snug tracking-wide transition-colors duration-300 ${activeId === item.id
                                ? "font-semibold text-violet-700 underline underline-offset-4 dark:text-violet-200"
                                : "text-slate-600 hover:text-violet-700 dark:text-slate-400 dark:hover:text-violet-200"
                                }`}
                            style={{ marginLeft: (item.depth - 1) * 12 }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
