"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
    return (
        <div className="relative w-full max-w-2xl mx-auto overflow-visible">
            {/* 🔍 アイコン */}
            <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 pointer-events-none"
            />

            {/* 入力欄 */}
            <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search articles by title or tag..."
                className="w-full pl-12 pr-4 py-3 rounded-full
                    bg-white border border-gray-300 shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                    transition text-gray-700"
            />
        </div>
    );
}
