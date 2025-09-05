/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx,md}",
    ],
    theme: {
        extend: {
            screens: {
                macbook: { min: "1470px", max: "1699px" },
                xl2: "1700px",
            },

            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme("colors.gray.800"),
                        maxWidth: "none",
                    },
                },
                invert: {
                    css: {
                        color: theme("colors.gray.200"),
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
