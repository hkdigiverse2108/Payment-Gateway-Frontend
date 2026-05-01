/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MenuProps } from "antd";
import type { ComponentType, ReactNode } from "react";
import * as Yup from "yup";
import type { TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

export type ApiResponse<T = unknown> = {
    status: number;
    message: string;
    data: T;
    error?: unknown;
};

export interface MessageStatus {
    status: number;
    message: string;
    error: Record<string, unknown>;
}
export interface CommonDataType {
    _id: string;
    isDeleted: boolean;
    createdBy: null;
    updatedBy: null;
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
}
export type Primitive = string | number;
export interface FieldOptions<T> {
    required?: boolean;
    extraRules?: (schema: T) => T;
    minItems?: number;
}
export type FieldSchemaArgs<K extends keyof FieldTypeMap> = [type: K, options?: FieldOptions<FieldTypeMap[K]>] | [type: K, label: string, options?: FieldOptions<FieldTypeMap[K]>];


export type FieldTypeMap = {
    string: Yup.StringSchema<string | null | undefined>;
    number: Yup.NumberSchema<number | null | undefined>;
    boolean: Yup.BooleanSchema<boolean | null | undefined>;
    array: Yup.ArraySchema<any[], Yup.AnyObject>;
};
export type MutationResponse<T = unknown> = ApiResponse<T>;

export type Params = Record<
    string,
    string | number | boolean | null | undefined
>;


export interface PageState {
    page: number;
    limit: number;
    totalPages: number;
}
export interface PageStatus {
    totalData: number;
    state: PageState;
}

export interface MessageStatus {
    status: number;
    message: string;
    error: Record<string, unknown>;
}


export interface PhoneNumberType {
    countryCode?: string;
    number?: string;
}

export interface CommonCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
    required?: boolean;
    error?: string;
    disabled?: boolean;
}

export interface CommonInputProps {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    type?: string;
    disabled?: boolean;
}

export interface CommonDropDownProps {
    items: MenuProps["items"];
    children: ReactNode;
    trigger?: ("click" | "hover")[];
    placement?: "bottomRight" | "bottomLeft";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

export interface CommonIconButtonProps {
    icon: ComponentType<any>;
    onClick?: () => void;
    badge?: boolean;
}

export interface CommonProfileButtonProps {
    name?: string;
    role?: string;
    onClick?: () => void;
    avatar?: ReactNode;
}

// export interface CommonButtonProps {
//     text: string;
//     type?: "primary" | "default" | "dashed" | "link" | "text";
//     htmlType?: "button" | "submit" | "reset";
//     loading?: boolean;
//     disabled?: boolean;
//     onClick?: () => void;
//     className?: string;
// }
export interface CommonButtonProps {
    text?: string;

    type?: "primary" | "default" | "dashed" | "link" | "text";

    htmlType?: "button" | "submit" | "reset";

    loading?: boolean;
    disabled?: boolean;

    onClick?: () => void;

    className?: string;

    icon?: React.ReactNode;
    size?: "small" | "middle" | "large";

    color?: string;

    variant?: "solid" | "outlined" | "dashed" | "filled" | "text";
}

export type SearchControl = {
    value?: string;
    onChange?: (value: string) => void;
};

export type ActiveControl = {
    value?: boolean;
    onChange?: (checked: boolean) => void;
};
export interface CommonTableProps<T extends object>
    extends Omit<TableProps<T>, "columns" | "dataSource"> {
    loading?: boolean;
    dataSource: T[];
    columns?: TableProps<T>["columns"];

    pagination?: {
        current?: number;
        pageSize?: number;
        total?: number;
        showSizeChanger?: boolean;
    };

    rowKey?: string | ((record: T) => string);

    bordered?: boolean;
    size?: "small" | "middle" | "large";

    scroll?: TableProps<T>["scroll"];

    onSearch?: SearchControl;
    onActive?: ActiveControl;

    children?: ReactNode;
}


export type ColumnFormatType =
    | "phone"
    | "date"
    | "datetime"
    | "format"
    | "status"
    | "createdBy";

export interface CommonObjectNameColumnOptions {
    title?: string;
    width?: number | string;
    ellipsis?: boolean;
    type?: ColumnFormatType;
}

export type CommonColumn<T> = ColumnsType<T>[number];

export interface ActionHandler<T> {
    onHandle: (record: T) => void;
    isPermission?: (record: T) => boolean;
}
export interface CommonActionColumnProps<T> {
    onActive?: ActionHandler<T>;
    onEdit?: ActionHandler<T>;
    onDelete?: ActionHandler<T>;
}
