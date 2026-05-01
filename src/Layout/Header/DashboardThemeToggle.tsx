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
      className="
        w-10 h-10 flex items-center justify-center
        rounded-xl
        bg-surface!
        text-(--foreground)!
        border border-(--border)
        hover:bg-surface!
        hover:text-(--foreground)!
      "
      icon={
        <span className="text-(--foreground)">
          {isDark ? <MoonOutlined /> : <SunOutlined />}
        </span>
      }
    />
  );
};

export default DashboardThemeToggle;