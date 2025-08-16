/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx,mdx,md}",
    ],
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        h1: {
                            fontSize: theme("fontSize.4xl"),
                            fontWeight: "800",
                            color: theme("colors.gray.900"),
                            marginBottom: "1.2em",
                            marginTop: "1.5em",
                        },
                        h2: {
                            fontSize: theme("fontSize.3xl"),
                            fontWeight: "700",
                            color: theme("colors.gray.800"),
                            marginBottom: "1em",
                            marginTop: "1.5em",
                        },
                        h3: {
                            fontSize: theme("fontSize.2xl"),
                            fontWeight: "600",
                            color: theme("colors.gray.700"),
                            marginBottom: "0.8em",
                            marginTop: "1.2em",
                        },
                        // 他にも必要に応じて p, a, blockquote などを追加可能
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
    ],
};
