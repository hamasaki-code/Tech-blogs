export default function Hero({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <section className="w-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-gray-900 py-20 text-center shadow-md">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.2] tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 drop-shadow-lg">
                {title}
            </h1>
            {subtitle && <p className="text-lg md:text-xl text-gray-800">{subtitle}</p>}
        </section>
    );
}
