import type { ColumnFormatType, CommonObjectNameColumnOptions } from "../../../Types";
import type { ColumnsType } from "antd/es/table";

const getValue = (obj: any, path: string) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);
const format = (values: (string | number)[], type?: ColumnFormatType) => {
  if (!values.length) return "-";
  const value = values.join(" ");
  if (type === "status") {
    const formatted = String(value).toLowerCase().replace(/\s+/g, "_");
    return <span className={`status-${formatted}`}>{value}</span>;
  }
  return value;
};

export const CommonObjectPropertyColumn = <T extends object>( dataIndex: string, sourceField: string, properties: string[], options?: CommonObjectNameColumnOptions
): ColumnsType<T>[number] => ({
  title: options?.title ?? dataIndex,
  dataIndex,
  width: options?.width,
    ellipsis: options?.ellipsis ?? true,
  render: (_, record) => {
    const obj = getValue(record, sourceField);
    if (!obj || typeof obj !== "object") return "-";
    const values = properties
      .map((p) => (obj as any)[p])
      .filter((v): v is string | number =>
        typeof v === "string" || typeof v === "number"
      );
    return format(values, options?.type);
  },
});