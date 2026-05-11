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
          <div className="sidebar-logo-wrapper">
            <div className="sidebar-logo-text">
              {isExpanded ? "PAYMENT GATEWAY" : "PG"}
            </div>
          </div>
          {menu}
        </Sider>
      )}
      {isMobile && (
        <Drawer placement="right" open={openDrawer} onClose={() => setOpenDrawer(false)} closable={false} rootClassName="mobile-sidebar-drawer" destroyOnHidden mask={{ closable: true }} styles={{ body: { padding: 12 }, }} >
          <div className="sidebar-header">
            <div> PAYMENT GATEWAY </div>
            <Button icon={<CloseOutlined />} type="text" onClick={() => setOpenDrawer(false)} />
          </div>
          {menu}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;