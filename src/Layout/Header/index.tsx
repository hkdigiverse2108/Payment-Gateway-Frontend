import { FiMenu } from "react-icons/fi";
import { useAppDispatch } from "../../Store";
import { setToggleMobileSidebar } from "../../Store/Slices/LayoutSlice";

import HeaderBrand from "./HeaderBrand";
import HeaderActions from "./HeaderActions";
import { useSidebarWidth } from "../../Utils/Hooks/useSidebarWidth";

const Header = () => {
  const dispatch = useAppDispatch();
  const { sidebarWidth } = useSidebarWidth();

  return (
    <header
      className="header"
      style={{
        "--sidebar-width": `${sidebarWidth}px`,
      } as React.CSSProperties}
    >
      {/* LEFT SIDE */}
      <div className="header-left">
        <button
          className="header-mobile-btn"
          onClick={() => dispatch(setToggleMobileSidebar())}
        >
          <FiMenu />
        </button>

        <HeaderBrand />
      </div>

      {/* RIGHT SIDE */}
      <HeaderActions />
    </header>
  );
};

export default Header;