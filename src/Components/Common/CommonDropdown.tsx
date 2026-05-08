import { Dropdown } from "antd";
import type { CommonDropDownProps } from "../../Types";

const CommonDropdown = ({ items, children, trigger = ["click"], placement = "bottomRight" }: CommonDropDownProps) => {
  return (
    <Dropdown
      menu={{
        items,
        className: "common-dropdown",
      }}
      trigger={trigger}
      placement={placement}
    >
      <div className="app-dropdown-trigger">{children}</div>
    </Dropdown>
  );
};

export default CommonDropdown;