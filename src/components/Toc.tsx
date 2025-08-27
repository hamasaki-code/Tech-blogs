"use client";

import { useEffect, useState, useRef } from "react";

type TocItem = {
    depth: number;
    text: string;
    id: string;
};

export default function Toc({ items }: { items: TocItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const isManualScroll = useRef(false);

    const tocItems = items.filter((item) => item.depth <= 2);

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

    return (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-300 dark:border-gray-700 p-5 rounded-md shadow text-sm">
            <h2 className="font-bold mb-3 text-gray-800 dark:text-gray-200 tracking-wide">
                目次
            </h2>
            <ul className="pl-4 space-y-3">
                {tocItems.map((item, idx) => (
                    <li key={item.id} className="relative pl-6">
                        {/* ノード */}
                        <span
                            className={`absolute left-0 top-2 transform -translate-x-1/2 -translate-y-1/2 
                                z-10 transition-colors duration-300
                                ${activeId === item.id
                                    ? "bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600"
                                    : "bg-gray-400 dark:bg-gray-600"
                                }`}
                            style={{
                                width: item.depth === 1 ? "12px" : "9px",
                                height: item.depth === 1 ? "12px" : "9px",
                                borderRadius: "3px",
                                boxShadow:
                                    activeId === item.id
                                        ? "0 0 6px rgba(99,102,241,0.8)"
                                        : "none",
                            }}
                        />

                        {/* 線（最後の要素以外につける） */}
                        {idx < tocItems.length - 1 && (
                            <span className="absolute left-0 top-2 bottom-[-16px] w-px bg-gray-400 dark:bg-gray-600"></span>
                        )}

                        {/* リンク */}
                        <a
                            href={`#${encodeURIComponent(item.id)}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={`block transition-colors duration-300 leading-snug tracking-wide
                                ${activeId === item.id
                                    ? "text-indigo-600 font-semibold underline underline-offset-4"
                                    : "text-gray-700 dark:text-gray-400 hover:text-indigo-500"
                                }`}
                            style={{ marginLeft: (item.depth - 1) * 12 }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
