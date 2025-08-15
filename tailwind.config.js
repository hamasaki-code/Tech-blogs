/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx,md}"],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography")], // Markdownに対応するために必要
};

