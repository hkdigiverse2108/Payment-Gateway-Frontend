export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    400: "var(--color-brand-400)",
                    500: "var(--color-brand-500)",
                    600: "var(--color-brand-600)",
                    700: "var(--color-brand-700)",
                },
                accent: {
                    200: "var(--color-accent-200)",
                    400: "var(--color-accent-400)",
                },

                surface: "var(--surface)",
                foreground: "var(--foreground)",
                border: "var(--border)",
                muted: "var(--text-muted)",
            },

            boxShadow: {
                "theme-xl": "var(--shadow-theme-xl)",
                "theme-md": "var(--shadow-theme-md)",
            },
        },
    },
    plugins: [],
};