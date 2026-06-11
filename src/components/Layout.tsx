"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";

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
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
            <nav
                className={`fixed left-0 top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-300 dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-[0_12px_40px_rgba(2,6,23,0.35)] ${showHeader ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="relative mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="flex h-9 w-9 items-center justify-center border border-violet-300 bg-violet-50 text-violet-700 shadow-sm transition hover:border-violet-400 hover:bg-violet-100 dark:border-violet-400/40 dark:bg-violet-400/10 dark:text-violet-200 dark:shadow-[0_0_24px_rgba(124,58,237,0.18)] dark:hover:border-violet-300 dark:hover:bg-violet-400/20"
                            title="Back to Home"
                            aria-label="Back to Home"
                        >
                            <FontAwesomeIcon icon={faCircleLeft} className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        <Link
                            href="/"
                            className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-slate-900 transition hover:text-violet-700 dark:text-slate-100 dark:hover:text-violet-200 sm:text-base"
                            aria-label="Hamayan.dev home"
                        >
                            Hamayan.dev
                        </Link>
                    </div>
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <main className="pt-20">{children}</main>

            <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center dark:border-slate-800 dark:bg-slate-950">
                <p className="font-mono text-xs text-slate-500 dark:text-slate-500">
                    © {new Date().getFullYear()} Hamayan.dev / All rights reserved.
                </p>
            </footer>
        </div>
    );
}
