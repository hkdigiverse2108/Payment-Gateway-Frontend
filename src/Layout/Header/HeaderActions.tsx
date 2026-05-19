import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Store";
import { setSignOut } from "../../Store/Slices/AuthSlice";
import DashboardThemeToggle from "./DashboardThemeToggle";
import CommonDropdown from "../../Components/Common/CommonDropdown";
import { BellOutlined, UserOutlined, KeyOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { Badge, type MenuProps } from "antd";
import { CommonButton } from "../../Attribute";
import CommonProfileAvatar from "../../Components/Common/CommonProfileAvatar";

const HeaderActions = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [openProfile, setOpenProfile] = useState(false);
  
  const notifItems: MenuProps["items"] = [
    {
      key: "notif-1",
      label: (
        <div className="p-2 max-w-xs">
          <p className="font-semibold text-xs text-foreground">Transaction Approved</p>
          <p className="text-[11px] text-muted mt-0.5">Deposit transaction of ₹25,000 has been processed successfully.</p>
        </div>
      ),
    },
    {
      key: "notif-2",
      label: (
        <div className="p-2 max-w-xs border-t border-border/10">
          <p className="font-semibold text-xs text-foreground">Security Alert</p>
          <p className="text-[11px] text-muted mt-0.5">New login detected from Mumbai, India.</p>
        </div>
      ),
    },
  ];

  const profileItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined className="text-muted" />,
      label: (
        <Link to={ROUTES.PROFILE.BASE} className="header-profile-link font-medium">
          Profile Settings
        </Link>
      ),
    },
    {
      key: "settings",
      icon: <KeyOutlined className="text-muted" />,
      label: (
        <Link to={ROUTES.SETTINGS.CHANGE_PASSWORD} className="header-profile-link font-medium">
          Change Password
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-500" />,
      danger: true,
      label: (
        <span
          onClick={() => dispatch(setSignOut())}
          className="header-profile-out font-semibold text-red-500 hover:text-red-600 cursor-pointer"
        >
          Logout
        </span>
      ),
    },
  ];

  return (
    <div className="header-actions flex items-center gap-3">
      <CommonDropdown items={notifItems} trigger={["click"]} placement="bottomRight">
        <Badge count={2} size="small" offset={[-2, 4]} color="#8B5CF6">
          <CommonButton
            variant="icon-only"
            icon={<BellOutlined className="text-lg text-foreground" />}
          />
        </Badge>
      </CommonDropdown>

      <DashboardThemeToggle />

      <CommonDropdown
        items={profileItems}
        trigger={["hover"]}
        open={openProfile}
        onOpenChange={setOpenProfile}
        placement="bottomRight"
      >
        <div className="cursor-pointer flex items-center gap-2.5 p-1 rounded-xl hover:bg-tableback/30 transition-all select-none border border-transparent hover:border-border/10">
          <CommonProfileAvatar fullName={`${user?.name || ""}`} />
          <div className="hidden sm:flex flex-col items-start leading-none pr-1">
            <span className="text-xs font-bold text-foreground">{user?.name || "Admin"}</span>
            <span className="text-[9px] font-black text-brand-500 uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
              {user?.role || "Administrator"}
            </span>
          </div>
        </div>
      </CommonDropdown>
    </div>
  );
};

export default HeaderActions;