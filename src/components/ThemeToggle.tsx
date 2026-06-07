"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
    const toggleTheme = () => {
        const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        document.documentElement.style.colorScheme = nextTheme;
        window.localStorage.setItem("theme", nextTheme);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-violet-400 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-violet-400 dark:hover:text-violet-200"
            aria-label="テーマを切り替え"
            title="Toggle theme"
        >
            <MoonIcon className="h-5 w-5 dark:hidden" />
            <SunIcon className="hidden h-5 w-5 dark:block" />
        </button>
    );
}
