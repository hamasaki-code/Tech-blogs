"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950">
            {/* ナビゲーション */}
            <nav
                className={`w-full bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 z-50 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="relative max-w-6xl mx-auto flex items-center h-16">
                    {/* 左：戻るボタン */}
                    <div className="flex-shrink-0 ml-6">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-9 h-9 rounded-full
                            bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                            text-white shadow hover:opacity-90 transition"
                            title="Back to Home"
                            aria-label="Back to Home"
                        >
                            <FontAwesomeIcon icon={faCircleLeft} className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* 中央：ロゴ */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <Link
                            href="/"
                            className="text-xl font-bold text-transparent bg-clip-text
                            bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"
                            aria-label="Hamayan.dev home"
                        >
                            Hamayan.dev
                        </Link>
                    </div>
                </div>
            </nav>

            {/* メイン */}
            <main className="pt-20">{children}</main>

            {/* フッター */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center py-6 mt-12">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Hamayan.dev — All rights reserved.
                </p>
            </footer>
        </div>
    );
}
