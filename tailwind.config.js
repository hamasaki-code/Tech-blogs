/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx,md}",
    ],
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        fontSize: "1.1rem",
                        lineHeight: "1.9",
                        color: theme("colors.gray.800"),
                        h1: {
                            fontSize: theme("fontSize.4xl")[0],
                            fontWeight: "800",
                            color: theme("colors.gray.900"),
                            marginTop: "1.5em",
                            marginBottom: "1em",
                        },
                        h2: {
                            fontSize: theme("fontSize.3xl")[0],
                            fontWeight: "700",
                            color: theme("colors.gray.800"),
                            marginTop: "1.5em",
                            marginBottom: "0.9em",
                        },
                        h3: {
                            fontSize: theme("fontSize.2xl")[0],
                            fontWeight: "600",
                            color: theme("colors.gray.700"),
                            marginTop: "1.2em",
                            marginBottom: "0.6em",
                        },
                        p: {
                            marginTop: "1rem",
                            marginBottom: "1rem",
                        },
                        ul: {
                            paddingLeft: "1.5rem",
                            listStyleType: "disc",
                        },
                        ol: {
                            paddingLeft: "1.5rem",
                            listStyleType: "decimal",
                        },
                        li: {
                            marginTop: "0.25rem",
                            marginBottom: "0.25rem",
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/line-clamp"),
    ],
};
