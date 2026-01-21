/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ink': '#1A1A1A',        // 徽墨
                'paper': '#F5F5F0',      // 宣纸
                'cinnabar': '#CD4532',   // 朱砂
                'bamboo': '#4B6E57',     // 竹青
                'ochre': '#9A7D46',      // 赭石
                'gold': '#D4AF37',       // 赤金
                'indigo': '#2C3E50',     // 黛蓝
            },
            fontFamily: {
                serif: ['"Songti SC"', '"Noto Serif SC"', 'serif'],
                sans: ['"PingFang SC"', '"Noto Sans SC"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
