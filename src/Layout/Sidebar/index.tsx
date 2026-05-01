import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { IoIosArrowDown } from "react-icons/io";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

import { NavItems } from "../../Data";
import { useAppDispatch, useAppSelector } from "../../Store";
import {
  setIsHovered,
  setToggleMobileSidebar,
  setToggleSidebar,
} from "../../Store/Slices/LayoutSlice";

import type { NavItem } from "../../Types";
import { ThemeTitle } from "../../Constants";
import { useWindowWidth } from "../../Utils/Hooks";
import { useSidebarWidth } from "../../Utils/Hooks/useSidebarWidth";

const filterNavItems = (navItems: NavItem[], role?: string): NavItem[] => {
  if (!role) return [];

  return navItems
    .filter((item) => item.roles.includes(role as any))
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) => !child.roles || child.roles.includes(role as any)
      ),
    }));
};

const Sidebar = () => {
  const { isExpanded, isMobileOpen, isHovered } = useAppSelector(
    (state) => state.layout
  );

  const { sidebarWidth } = useSidebarWidth();
  const { user } = useAppSelector((state) => state.auth);

  const role = user?.role;
  const dispatch = useAppDispatch();
  const width = useWindowWidth();
  const location = useLocation();

  const sidebarRef = useRef<HTMLElement | null>(null);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allowedNavItems = useMemo(() => {
    return filterNavItems(NavItems, role).sort(
      (a, b) => (a.number || 0) - (b.number || 0)
    );
  }, [role]);

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path ||
      location.pathname.startsWith(path + "/"),
    [location.pathname]
  );

  useEffect(() => {
    allowedNavItems.forEach((menu, index) => {
      if (
        menu.children?.some(
          (sub) =>
            location.pathname === sub.path ||
            location.pathname.startsWith(sub.path + "/")
        )
      ) {
        setOpenSubmenu({ type: "main", index });
      }
    });
  }, [location.pathname, allowedNavItems]);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      dispatch(setToggleSidebar());
    } else {
      dispatch(setToggleMobileSidebar());
    }
  };

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) =>
      prev && prev.index === index ? null : { type: "main", index }
    );
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="menu-list">
      {items.map((nav, index) => {
        const isOpen = openSubmenu?.index === index;

        return (
          <li key={nav.name}>
            {nav.children ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`
                  menu-btn
                  ${isOpen ? "menu-active" : "menu-inactive"}
                  ${!isExpanded && !isHovered ? "menu-center" : "menu-gap"}
                `}
              >
                <span className="menu-icon">{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-text">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <IoIosArrowDown
                    className={`menu-arrow ${
                      isOpen ? "menu-rotate" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`
                    menu-btn
                    ${
                      isActive(nav.path)
                        ? "menu-active menu-shadow"
                        : "menu-inactive"
                    }
                    ${!isExpanded && !isHovered ? "menu-center" : "menu-gap"}
                  `}
                >
                  <span className="menu-icon">{nav.icon}</span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* SUBMENU */}
            {nav.children && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${index}`] = el;
                }}
                className="submenu-wrapper"
                style={{
                  height: isOpen
                    ? `${subMenuHeight[index] || 0}px`
                    : "0px",
                }}
              >
                <ul className="submenu-list">
                  {nav.children.map((child) => (
                    <li key={child.name}>
                      <Link
                        to={child.path}
                        className={`
                          submenu-item
                          ${
                            isActive(child.path)
                              ? "submenu-active"
                              : "submenu-inactive"
                          }
                        `}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        window.innerWidth < 1024 &&
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        dispatch(setToggleMobileSidebar());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen, dispatch]);

  return (
    <aside
      ref={sidebarRef}
      className={`
        sidebar
        ${isMobileOpen ? "sidebar-open" : "sidebar-closed"}
      `}
      style={{
        width: width >= 1024 ? sidebarWidth : "220px", paddingLeft: "10px", paddingRight: "10px"
      }}
      onMouseEnter={() => !isExpanded && dispatch(setIsHovered(true))}
      onMouseLeave={() => dispatch(setIsHovered(false))}
    >
      {/* HEADER */}
      <div
        className={`sidebar-header ${
          !isExpanded && !isHovered
            ? "sidebar-header-center"
            : "sidebar-header-between"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="sidebar-logo">PA</div>

          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="sidebar-title">{ThemeTitle}</span>
          )}
        </Link>

        {isMobileOpen && (
          <button
            onClick={() => dispatch(setToggleMobileSidebar())}
            className="sidebar-close-btn lg:hidden"
          >
            <IoClose size={20} />
          </button>
        )}

        {width >= 1024 && (isMobileOpen || isExpanded) && (
          <button className="sidebar-close-btn" onClick={handleToggle}>
            ☰
          </button>
        )}
      </div>

      {/* MENU */}
      <div className="sidebar-menu-wrapper">
        <nav className="sidebar-nav">
          <h2 className="sidebar-section-title">
            {isExpanded || isHovered || isMobileOpen ? (
              "Menu"
            ) : (
              <BiDotsHorizontalRounded className="sidebar-three-dot" />
            )}
          </h2>

          {renderMenuItems(allowedNavItems)}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;