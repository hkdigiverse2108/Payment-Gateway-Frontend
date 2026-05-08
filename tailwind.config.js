export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "var(--color-brand-50)",
                    100: "var(--color-brand-100)",
                    200: "var(--color-brand-200)",
                    300: "var(--color-brand-300)",
                    400: "var(--color-brand-400)",
                    500: "var(--color-brand-500)",
                    600: "var(--color-brand-600)",
                    700: "var(--color-brand-700)",
                    800: "var(--color-brand-800)",
                    900: "var(--color-brand-900)",
                },

                accent: {
                    200: "var(--color-accent-200)",
                    300: "var(--color-accent-300)",
                    400: "var(--color-accent-400)",
                    500: "var(--color-accent-500)",
                },
                background: "var(--background)",
                backgroundlight: "var(--background-light)",
                surface: "var(--surface)",
                foreground: "var(--foreground)",
                border: "var(--border)",
                muted: "var(--text-muted)",
                // primaryy: "var(--background-primary)",

                primary: "var(--primaryy)",
                success: "var(--success)",
                warning: "var(--warning)",
                active: "var(--active)",
            },

            boxShadow: {
                "theme-xs": "var(--shadow-theme-xs)",
                "theme-sm": "var(--shadow-theme-sm)",
                "theme-md": "var(--shadow-theme-md)",
                "theme-lg": "var(--shadow-theme-lg)",
                "theme-xl": "var(--shadow-theme-xl)",
            },

            fontSize: {
                "theme-xs": [
                    "var(--text-theme-xs)",
                    { lineHeight: "var(--text-theme-xs--line-height)" },
                ],
                "theme-sm": [
                    "var(--text-theme-sm)",
                    { lineHeight: "var(--text-theme-sm--line-height)" },
                ],
                "theme-md": [
                    "var(--text-theme-md)",
                    { lineHeight: "var(--text-theme-md--line-height)" },
                ],
                "theme-lg": [
                    "var(--text-theme-lg)",
                    { lineHeight: "var(--text-theme-lg--line-height)" },
                ],
                "theme-xl": [
                    "var(--text-theme-xl)",
                    { lineHeight: "var(--text-theme-xl--line-height)" },
                ],
                "theme-2xl": [
                    "var(--text-theme-2xl)",
                    { lineHeight: "var(--text-theme-2xl--line-height)" },
                ],
            },
        },
    },
    plugins: [],
};