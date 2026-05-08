import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Store";
import { setSignOut } from "../../Store/Slices/AuthSlice";
import DashboardThemeToggle from "./DashboardThemeToggle";
import CommonDropdown from "../../Components/Common/CommonDropdown";
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";
import type { MenuProps } from "antd";
import { CommonButton } from "../../Attribute";
import CommonProfileAvatar from "../../Components/Common/CommonProfileAvatar";

const HeaderActions = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [openProfile, setOpenProfile] = useState(false);
  const notifItems: MenuProps["items"] = [
    {
      key: "empty",
      label: (
        <span className="header-notification">
          No notifications
        </span>
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
          className="header-profile-link"
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
          className="header-profile-link"
        >
          Settings
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: (
        <span
          onClick={() => dispatch(setSignOut())}
          className="header-profile-out"
        >
          Logout
        </span>
      ),
    },
  ];

  return (
    <div className="header-actions">
      <CommonDropdown items={notifItems} trigger={["click"]}>
        <CommonButton
          icon={<BellOutlined />}
        />
      </CommonDropdown>
      <DashboardThemeToggle />
      <CommonDropdown
        items={profileItems}
        trigger={["hover"]}
        open={openProfile}
        onOpenChange={setOpenProfile}
      >
        <div className="cursor-pointer">
          <CommonProfileAvatar fullName={`${user?.name || ""}`}  className="max-xsm:text-sm h-11 w-11 max-xsm:h-9 max-xsm:w-9" />
        </div>
      </CommonDropdown>
    </div>
  );
};

export default HeaderActions;