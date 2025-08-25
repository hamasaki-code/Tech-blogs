// components/Toc.tsx
"use client";

import { useEffect, useState } from "react";

type TocItem = {
    depth: number;
    text: string;
    id: string;
};

export default function Toc({ toc }: { toc: TocItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // 表示されている heading を上から順に並べる
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                root: null,
                rootMargin: "-30% 0px -60% 0px", // 👈 中央寄りで判定
                threshold: [0, 0.1, 0.5, 1.0],
            }
        );

        toc.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [toc]);

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm text-sm">
            <h2 className="font-bold mb-2 text-gray-700 dark:text-gray-200">目次</h2>
            <ul className="space-y-2">
                {toc.map((item) => (
                    <li key={item.id} style={{ marginLeft: (item.depth - 1) * 12 }}>
                        <a
                            href={`#${item.id}`}
                            className={`block hover:text-blue-600 transition ${activeId === item.id
                                    ? "text-blue-600 font-semibold"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
