import { RouterProvider } from "react-router-dom";
import { Router } from "./Routes";
// import { useAppSelector } from "./Store";
import { App as AntdApp, ConfigProvider } from "antd";
import { antdTheme } from "./Theme";
import { ToastProvider } from "./Components/Common";

function App() {
  // const { isToggleTheme } = useAppSelector((state) => state.layout);

  // useEffect(() => {
  //   document.documentElement.classList.toggle(
  //     "dark",
  //     isToggleTheme === "dark"
  //   );
  // }, [isToggleTheme]);

  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <ToastProvider>
          <RouterProvider router={Router} />
        </ToastProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;