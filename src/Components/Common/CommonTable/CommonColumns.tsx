import type { ColumnFormatType, CommonObjectNameColumnOptions } from "../../../Types";
// import { FormatCountryCode, FormatDate, FormatDateTime, FormatPayment } from "@/utils";
import type { ColumnsType } from "antd/es/table";

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const formatValues = (values: (string | number)[], type?: ColumnFormatType): string => {
  if (!values.length) return "-";

  const value = values[0];

  switch (type) {
    // case "phone": {
    //   const [code, number] = values;
    //   if (!code || !number) return "-";
    //   return `${FormatCountryCode(code.toString())} ${number}`;
    // }

    // case "date":
    //   return value ? FormatDate(value) : "-";

    // case "datetime":
    //   return value ? FormatDateTime(value) : "-";

    // case "format":
    //   return value ? FormatPayment(value.toString()) : "-";

    case "status":
      return value ? value.toString() : "-";

    case "createdBy": {
      const [fullName, userType] = values;

      if (userType?.toString().toLowerCase() === "super-admin") {
        return "System Generated";
      }

      return fullName?.toString() || "-";
    }

    default:
      return values.join(" ");
  }
};

export const CommonObjectPropertyColumn = <T extends object>(dataIndex: string, sourceField: string, properties: string[], options?: CommonObjectNameColumnOptions): ColumnsType<T>[number] => ({
  title: options?.title ?? dataIndex,
  dataIndex,
  width: options?.width,
  ellipsis: options?.ellipsis ?? true,

  render: (_, record) => {
    const obj = getNestedValue(record, sourceField);

    if (typeof obj === "string" || typeof obj === "number") {
      const formatted = formatValues([obj], options?.type);
      return renderByType(formatted, options?.type);
    }

    if (typeof obj !== "object" || obj === null) return "-";

    const values = properties.map((prop) => obj?.[prop]).filter((val) => typeof val === "string" || typeof val === "number");

    const formatted = formatValues(values, options?.type);

    return renderByType(formatted, options?.type);
  },
});

const renderByType = (value: string, type?: ColumnFormatType) => {
  if (type === "status") {
    const formatted = value?.toLowerCase().replace(/\s+/g, "_");
    return <span className={`status-${formatted}`}>{value}</span>;
  }

  return value || "-";
};
