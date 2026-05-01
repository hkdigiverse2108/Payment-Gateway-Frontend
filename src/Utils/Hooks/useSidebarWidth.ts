import { useEffect, useState } from "react";
import { useAppSelector } from "../../Store";

export const useSidebarWidth = () => {
    const { isExpanded, isHovered, isMobileOpen } = useAppSelector(
        (state) => state.layout
    );

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isDesktopExpanded = isExpanded || isHovered;

    const sidebarWidth =
        width < 1024 ? (isMobileOpen ? 260 : 0) : isDesktopExpanded ? 260 : 80;

    return {
        sidebarWidth,
        isMobileOpen,
        isDesktopExpanded,
        isCollapsed: !isMobileOpen && !isDesktopExpanded,
    };
};