import type { ColumnsType } from "antd/es/table";

const get = (obj: any, path: string) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

export const CommonColumnFactory = <T extends object>(
  config: {
    title: string;
    dataIndex?: string;
    key: string;
    render?: (value: any, record: T) => React.ReactNode;
    width?: number;
  }[]
): ColumnsType<T> => {
  return config.map((col) => ({
    title: col.title,
    dataIndex: col.dataIndex,
    key: col.key,
    width: col.width,
    render: col.render
      ? (_, record) => col.render?.(get(record, col.dataIndex || ""), record)
      : (value) => value ?? "-",
  }));
};