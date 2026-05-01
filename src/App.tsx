import { RouterProvider } from "react-router-dom"
import { Router } from "./Routes"
import { useAppSelector } from "./Store"
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./Theme";
import { useEffect, useMemo } from "react";


function App() {
  const { isToggleTheme } = useAppSelector((state) => state.layout);
  const theme = useMemo(
    () => getTheme(isToggleTheme === "light" ? "light" : "dark"),
    [isToggleTheme]
  );
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      isToggleTheme === "dark"
    );
  }, [isToggleTheme]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </>
  )
}

export default App
