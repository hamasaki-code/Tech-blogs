"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* 🔍 アイコン */}
            <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5
                text-gray-500 dark:text-gray-400 pointer-events-none"
            />

            {/* 入力欄 */}
            <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search articles by title or tag..."
                className="w-full pl-10 pr-4 py-3 rounded-full
                    bg-white dark:bg-gray-800
                    border border-gray-300 dark:border-gray-600
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                    transition"
            />
        </div>
    );
}
