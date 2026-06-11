export default function Hero({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <section className="w-full border-b border-slate-200 bg-slate-50 px-4 py-16 text-center text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 md:py-20">
            <h1 className="mb-4 text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl md:text-6xl">
                {title}
            </h1>
            {subtitle && (
                <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg md:text-xl">
                    {subtitle}
                </p>
            )}
        </section>
    );
}
