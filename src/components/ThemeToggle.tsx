"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const themeChangeEvent = "themechange";

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event(themeChangeEvent));
}

function readTheme(): Theme {
    if (typeof document === "undefined") {
        return "light";
    }

    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(listener: () => void) {
    window.addEventListener(themeChangeEvent, listener);
    return () => window.removeEventListener(themeChangeEvent, listener);
}

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, readTheme, () => "light");

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    };

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 items-center justify-center gap-2 border border-slate-300 bg-white px-3 text-slate-700 shadow-sm transition hover:border-violet-400 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-violet-400 dark:hover:text-violet-200"
            aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
            title={isDark ? "Light mode" : "Dark mode"}
        >
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            <span className="font-mono text-xs font-semibold">
                {isDark ? "Light" : "Dark"}
            </span>
        </button>
    );
}
