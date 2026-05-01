import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { setToggleMobileSidebar, useAppDispatch, useAppSelector } from "../Store";
import { useSidebarWidth } from "../Utils/Hooks/useSidebarWidth";

const Layout = () => {
  const { isMobileOpen } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const { sidebarWidth } = useSidebarWidth();

  return (
    <div className="flex bg-surface text-foreground min-h-screen">

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setToggleMobileSidebar())}
        />
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

        <div
          className={`transition-all duration-300 ${
            isMobileOpen
              ? "blur-sm pointer-events-none lg:blur-none lg:pointer-events-auto"
              : ""
          }`}
        >
          <Header />
        <main
            className="p-4"
            style={{ marginLeft: window.innerWidth >= 1024 ? sidebarWidth : 0 }}
          >
        <Outlet />
      </main>
    </div>

  </div>

</div>
  );
};

export default Layout;