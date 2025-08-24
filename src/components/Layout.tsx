import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen
                bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50
                dark:from-gray-800 dark:via-gray-900 dark:to-gray-950">

            {/* ナビゲーション */}
            <nav className="w-full bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"
                    >
                        Hamayan.dev
                    </Link>
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full shadow hover:opacity-90 transition"
                    >
                        ← 戻る
                    </Link>
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
