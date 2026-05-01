import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Store";
import { setSignOut } from "../../Store/Slices/AuthSlice";
import DashboardThemeToggle from "./DashboardThemeToggle";
import CommonIconButton from "../../Components/Common/CommonIconButton";
import CommonDropdown from "../../Components/Common/CommonDropdown";
import { Link } from "react-router-dom";
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import CommonProfileButton from "../../Components/Common/CommonProfileButton";
import { ROUTES } from "../../Constants";
import type { MenuProps } from "antd";

const HeaderActions = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [openProfile, setOpenProfile] = useState(false);

  const notifItems: MenuProps["items"] = [
    {
      key: "empty",
      label: (
        <p className="header-dropdown-empty">
          No new notifications
        </p>
      ),
    },
  ];

  const profileItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <Link
          to={ROUTES.PROFILE.BASE}
          className="header-dropdown-item"
          onClick={() => setOpenProfile(false)}
        >
          Profile
        </Link>
      ),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: (
        <Link
          to={ROUTES.SETTINGS.CHANGE_PASSWORD}
          className="header-dropdown-item"
          onClick={() => setOpenProfile(false)}
        >
          Settings
        </Link>
      ),
    },
    {
      type: "divider",
      key: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: (
        <button
          onClick={() => {
            dispatch(setSignOut());
            setOpenProfile(false);
          }}
          className="header-dropdown-logout"
        >
          Logout
        </button>
      ),
    },
  ];

  return (
    <div className="header-actions">
      
      {/* NOTIFICATION */}
      <div className="relative">
        <CommonDropdown
          items={notifItems}
          trigger={["click"]}
        >
          <CommonIconButton
            badge
            icon={BellOutlined}
          />
        </CommonDropdown>
      </div>

      {/* THEME */}
      <DashboardThemeToggle />

      {/* PROFILE */}
      <div className="relative">
        <CommonDropdown
          items={profileItems}
          trigger={["click"]}
          open={openProfile}
          onOpenChange={setOpenProfile}
        >
          <CommonProfileButton
            name={user?.name}
            role={user?.role}
          />
        </CommonDropdown>
      </div>

    </div>
  );
};

export default HeaderActions;