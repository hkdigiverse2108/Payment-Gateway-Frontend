import type { ColumnsType } from "antd/es/table";
import type { ColumnFormatType, CommonObjectNameColumnOptions } from "../../../Types";

/** ---------------------------
 * Safe nested value getter
 * --------------------------*/
const getNestedValue = (obj: any, path: string) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

/** ---------------------------
 * Format helper (same idea as MUI system)
 * --------------------------*/
const formatValues = (values: (string | number)[], type?: ColumnFormatType): any => {
  if (!values.length) return "-";

  const value = values[0];

  switch (type) {
    case "date":
      return value ? new Date(value).toLocaleDateString() : "-";

    case "datetime":
      return value ? new Date(value).toLocaleString() : "-";

    case "status": {
      const formatted = String(value).toLowerCase().replace(/\s+/g, "_");
      return <span className={`status-${formatted}`}>{value}</span>;
    }

    default:
      return values.join(" ");
  }
};

/** ---------------------------
 * Core reusable column builder (LIKE MUI version)
 * --------------------------*/
export const CommonObjectPropertyColumn = <T extends object>(
  dataIndex: string,
  sourceField: string,
  properties: string[],
  options?: CommonObjectNameColumnOptions
): ColumnsType<T>[number] => ({
  title: options?.title ?? dataIndex,
  dataIndex,
  width: options?.width,
  render: (_, record: any) => {
    const obj = getNestedValue(record, sourceField);

    if (!obj || typeof obj !== "object") return "-";

    const values = properties
      .map((p) => obj?.[p])
      .filter((v): v is string | number => typeof v === "string" || typeof v === "number");

    return formatValues(values, options?.type);
  },
});

/** ---------------------------
 * Safe column wrapper (fallback like MUI DataGrid)
 * --------------------------*/
export const withColumnFallback = <T extends object>(col: ColumnsType<T>[number]): ColumnsType<T>[number] => {
  if (col.render) return col;

  return {
    ...col,
    render: (value: any) => {
      if (value === null || value === undefined || value === "") return "-";
      return value;
    },
  };
};