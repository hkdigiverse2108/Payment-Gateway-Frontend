// import React from "react";
// import { Table } from "antd";
// import type { TableProps } from "antd";

// export type CommonTableProps<T> = TableProps<T>;

// const CommonTable = React.forwardRef(<T extends object>(
//   props: CommonTableProps<T>,
//   ref: React.Ref<any>
// ) => {
//   return <Table<T> ref={ref} {...props} />;
// });

// export default CommonTable;
import React from "react";
import { Table, ConfigProvider } from "antd";
import type { TableProps, ThemeConfig } from "antd";

export type CommonTableProps<T> = TableProps<T> & {
  variant?: "default" | "bordered" | "soft";
  useTheme?: boolean;
};

const getTableTheme = (mode: "light" | "dark"): ThemeConfig => ({
  components: {
    Table: {
      headerBg: mode === "dark" ? "#111827" : "#f3f4f6",
      headerColor: mode === "dark" ? "#ffffff" : "#111827",
      headerSplitColor: "rgba(148, 163, 184, 0.4)",
      rowHoverBg: mode === "dark" ? "#1f2937" : "#f9fafb",
      borderColor: "rgba(148, 163, 184, 0.4)",
    },
  },
});

function CommonTable<T extends object>({
  variant = "default",
  useTheme = true,
  className,
  ...props
}: CommonTableProps<T>) {
  // Detect theme from system (you can replace with redux/context later)
  const isDark =
    document.documentElement.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const mode: "light" | "dark" = isDark ? "dark" : "light";

  const table = (
    <Table<T>
      {...props}
      bordered={false}   // IMPORTANT: always false
          className={`common-table ${variant === "bordered" ? "table-bordered" : ""} ${className || ""}`}
          
    //   className={`common-table ${className || ""}`}
    //   bordered={variant === "bordered"}
    />
  );

  if (!useTheme) return table;

  return (
    <ConfigProvider theme={getTableTheme(mode)}>
      {table}
    </ConfigProvider>
  );
}

export default CommonTable;