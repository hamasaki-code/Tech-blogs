/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx,md}",
    ],
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.800'),
                        maxWidth: 'none',
                        h1: {
                            color: theme('colors.gray.900'),
                        },
                        h2: {
                            color: theme('colors.gray.900'),
                        },
                        h3: {
                            color: theme('colors.gray.900'),
                        },
                        p: {
                            color: theme('colors.gray.800'),
                        },
                        li: {
                            color: theme('colors.gray.800'),
                        },
                        strong: {
                            color: theme('colors.gray.900'),
                        },
                    }
                },
                invert: {
                    css: {
                        color: theme('colors.gray.200'),
                        h1: {
                            color: theme('colors.gray.100'),
                        },
                        h2: {
                            color: theme('colors.gray.100'),
                        },
                        h3: {
                            color: theme('colors.gray.100'),
                        },
                        p: {
                            color: theme('colors.gray.200'),
                        },
                        li: {
                            color: theme('colors.gray.200'),
                        },
                        strong: {
                            color: theme('colors.gray.100'),
                        },
                    }
                },
            }),
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/line-clamp"),
    ],
};
