import { useAppDispatch, useAppSelector } from "../../Store";
import { setToggleTheme } from "../../Store/Slices/LayoutSlice";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

const DashboardThemeToggle = () => {
  const dispatch = useAppDispatch();
  const { isToggleTheme } = useAppSelector((state) => state.layout);
  const isDark = isToggleTheme === "dark";
  const handleToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    dispatch(setToggleTheme(newTheme));
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  return (
    <Button
      type="default"
      onClick={handleToggle}
      className="dashboard-theme"
      icon={
        <span>
          {isDark ? <MoonOutlined /> : <SunOutlined />}
        </span>
      }
    />
  );
};

export default DashboardThemeToggle;