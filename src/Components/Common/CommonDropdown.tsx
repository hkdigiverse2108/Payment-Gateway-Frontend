import { Dropdown } from "antd";
import type { CommonDropDownProps } from "../../Types";

const CommonDropdown = ({
  items,
  children,
  trigger = ["click"],
  placement = "bottomRight",
  className,
}: CommonDropDownProps) => {
  return (
    <Dropdown
      menu={{ items }}
      trigger={trigger}
      placement={placement}
      overlayClassName={`header-dropdown ${className || ""}`}
    >
      <div className="dropdown-trigger">{children}</div>
    </Dropdown>
  );
};

export default CommonDropdown;