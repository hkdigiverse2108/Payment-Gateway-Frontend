import { MenuFoldOutlined, MenuUnfoldOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../Store";
import { setToggleSidebar } from "../../Store/Slices/LayoutSlice";
import HeaderBrand from "./HeaderBrand";
import HeaderActions from "./HeaderActions";
import { useMediaQuery } from "react-responsive";
import { CommonButton } from "../../Attribute";
import type { HeaderProps } from "../../Types";
import { useEffect, useRef } from "react";
import { Input } from "antd";

const Header = ({ onOpenDrawer }: HeaderProps) => {
  const dispatch = useAppDispatch()
  const { isExpanded } = useAppSelector((state) => state.layout);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="app-header flex items-center justify-between px-4 sm:px-6">
      <div className="app-header-left flex items-center gap-3">
        {isMobile ? (
          <CommonButton
            onClick={onOpenDrawer}
            variant="icon-only"
            icon={
              <span className="text-foreground">
                <MenuOutlined />
              </span>
            }
          />
        ) : (
          <CommonButton
            onClick={() => dispatch(setToggleSidebar())}
            variant="icon-only"
            icon={
              <span className="text-foreground">
                {isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              </span>
            }
          />
        )}
        <HeaderBrand />
      </div>

      {!isMobile && (
        <div className="flex-1 max-w-md mx-8">
          <Input
            ref={searchInputRef}
            placeholder="Search dashboard..."
            prefix={<SearchOutlined className="text-muted mr-1.5" />}
            suffix={
              <kbd className="bg-tableback/50 px-1.5 py-0.5 rounded text-[10px] font-mono text-muted border border-border/20 shadow-sm pointer-events-none select-none">
                ⌘K
              </kbd>
            }
            className="h-10 w-full rounded-xl bg-surface border-border/20 text-foreground placeholder:text-muted focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      )}

      <div className="app-header-right">
        <HeaderActions />
      </div>
    </header>
  );
};

export default Header;