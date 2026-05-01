// theme.ts
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,
            primary:
                mode === "light"
                    ? {
                        light: "#444444",
                        main: "#000000",
                        dark: "#000000",
                        contrastText: "#FFFFFF",
                    }
                    : {
                        light: "#DDD6FE",
                        main: "#8B5CF6",
                        dark: "#6D28D9",
                        contrastText: "#000000",
                    },
        },
        breakpoints: {
            values: {
                xs: 0,
                xxs: 375, // --breakpoint-2xsm
                xsm: 425, // --breakpoint-xsm
                sm: 640, // --breakpoint-sm
                md: 768, // --breakpoint-md
                lg: 1024, // --breakpoint-lg
                xl: 1280, // --breakpoint-xl
                xxl: 1536, // --breakpoint-2xl
                xxxl: 2000, // --breakpoint-3xl
            },
        },
        typography: {
            fontFamily: ["Outfit", "sans-serif"].join(","),
        },
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    // root: {
                    //   height: 42,
                    //   borderRadius: "7px",
                    // },
                    // input: {
                    //   height: "25px",
                    //   borderRadius: "7px",
                    // },
                },
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        border: "none",
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        minHeight: 48,
                        height: 48,
                        justifyContent: "start",
                        textTransform: "none",
                    },
                },
            },
        },
    });
