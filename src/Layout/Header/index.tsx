import { MenuFoldOutlined, MenuUnfoldOutlined, MenuOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../Store";
import { setToggleSidebar } from "../../Store/Slices/LayoutSlice";
import HeaderBrand from "./HeaderBrand";
import HeaderActions from "./HeaderActions";
import { useMediaQuery } from "react-responsive";
import { CommonButton } from "../../Attribute";
import type { HeaderProps } from "../../Types";

const Header = ({ onOpenDrawer }: HeaderProps) => {
  const dispatch = useAppDispatch()
  const { isExpanded } = useAppSelector((state) => state.layout);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <header className="app-header">
      <div className="app-header-left">
        {isMobile ? (
          <CommonButton
            onClick={onOpenDrawer}
            icon={
              <span className="text-foreground">
                <MenuOutlined />
              </span>
            }
          />
        ) : (
          <CommonButton
            onClick={() => dispatch(setToggleSidebar())}
            icon={
              <span className="text-foreground">
                {isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              </span>
            }
          />
        )}
        <HeaderBrand />
      </div>
      <div className="app-header-right">
        <HeaderActions />
      </div>
    </header>
  );
};

export default Header;