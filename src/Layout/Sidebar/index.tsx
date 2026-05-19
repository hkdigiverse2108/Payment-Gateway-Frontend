import { Button, Drawer, Layout, Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAppSelector } from "../../Store";
import { useMediaQuery } from "react-responsive";
import { CloseOutlined } from "@ant-design/icons";
import type { SidebarProps } from "../../Types";
import { pageRoutes } from "../../Routes/PageRoutes";
import { sidebarIconMap } from "../../Data";
import type { SidebarIconKey } from "../../Types";

const { Sider } = Layout;
const Sidebar = ({ openDrawer, setOpenDrawer }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded } = useAppSelector((state) => state.layout);
  const { user } = useAppSelector((state) => state.auth);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const role = user?.role;
  const menuItems: MenuProps['items'] = useMemo(() => {
    return pageRoutes .filter( (route) => route.showInSidebar && route.roles?.includes(role) )
      .map((route) => ({ key: route.path, icon: sidebarIconMap[route.sidebarKey as SidebarIconKey], label: route.name, }))}, [role]);
  const menu = (
    <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={(e) => { navigate(e.key); if (isMobile) setOpenDrawer(false);  }} className="sidebar-menu" />
  );
  return (
    <>
      {!isMobile && (
        <Sider collapsed={!isExpanded} trigger={null} className="sidebar" width={260} >
          <div className="sidebar-logo-wrapper flex items-center gap-3 px-4 h-16 border-b border-border/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-500/25 flex-shrink-0">
              PG
            </div>
            {isExpanded && (
              <span className="sidebar-logo-text font-bold text-foreground text-sm tracking-wide">
                Payment Gateway
              </span>
            )}
          </div>
          {menu}
        </Sider>
      )}
      {isMobile && (
        <Drawer placement="right" open={openDrawer} onClose={() => setOpenDrawer(false)} closable={false} rootClassName="mobile-sidebar-drawer" destroyOnHidden mask={{ closable: true }} styles={{ body: { padding: 12 }, }} >
          <div className="sidebar-header flex items-center justify-between pb-4 border-b border-border/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-500/25">
                PG
              </div>
              <span className="font-bold text-foreground text-sm tracking-wide">
                Payment Gateway
              </span>
            </div>
            <Button icon={<CloseOutlined />} type="text" onClick={() => setOpenDrawer(false)} className="text-muted hover:text-foreground" />
          </div>
          {menu}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;