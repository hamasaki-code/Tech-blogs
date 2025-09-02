export default function Hero({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <section
            className="w-full
            bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200
            dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
            text-gray-900 dark:text-gray-100
            py-16 md:py-20 text-center shadow-md px-4"
        >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-snug tracking-tight mb-4 
                text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600
                dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 drop-shadow-lg">
                {title}
            </h1>
            {subtitle && (
                <p className="text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </section>
    );
}
