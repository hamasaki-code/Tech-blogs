"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type Props = {
    value: string;
    onSearch: (query: string) => void;
};

export default function SearchInput({ value, onSearch }: Props) {
    return (
        <div className="relative mx-auto w-full max-w-2xl">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

            <input
                type="text"
                value={value}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search articles by title, tag, or excerpt..."
                className="w-full border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-950 placeholder-slate-400 shadow-sm transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-500 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:focus:border-violet-400 dark:focus:ring-violet-500/30"
            />
        </div>
    );
}
