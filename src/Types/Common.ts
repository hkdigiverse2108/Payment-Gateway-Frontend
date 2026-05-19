/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode, FocusEvent } from "react";
import * as Yup from "yup";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { ColProps, InputProps, TableProps, MenuProps, ButtonProps } from "antd";
import type { SorterResult, FilterValue } from "antd/es/table/interface";

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
    label?: string;
    required?: boolean;
    type?: "text" | "password" | "email" | "number";
    placeholder?: string;
    allowClear?: boolean;
    showPasswordToggle?: boolean;
    clearable?: boolean;
    className?: string;
};

export interface CommonDropDownProps {
    items: MenuProps["items"];
    children: ReactNode;
    trigger?: ("click" | "hover")[];
    placement?: "bottomRight" | "bottomLeft";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

export interface CommonProfileButtonProps {
    name?: string;
    role?: string;
    onClick?: () => void;
    avatar?: ReactNode;
}

export interface CommonButtonProps extends Omit<ButtonProps, "variant"> {
  loading?: boolean;
  title?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger" | "icon-only";
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
    onAddLabel?: string;
    pagination?: {
        current?: number;
        pageSize?: number;
        total?: number;
        showSizeChanger?: boolean;
    };
    onPaginationChange?: (page: number, pageSize: number) => void;
    rowKey?: string | ((record: T) => string);
    sort?: {
        default?: string; // "amount:asc"
        onChange?: (sort: { field?: string; order?: "asc" | "desc" }) => void;
    };
    onExportExcel?: () => void;
    onExportPDF?: () => void;
    bordered?: boolean;
    size?: "small" | "middle" | "large";

    scroll?: TableProps<T>["scroll"];
    
    onSearch?: SearchControl;
    onActive?: ActiveControl;
    onAdd?: () => void;
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
    onHandle: (row: T) => void;
    isPermission?: (row: T) => boolean;
}
export interface CommonActionColumnProps<T> {
    editRoute?: string;
    permissionRoute?: string;
    onEdit?: ActionHandler<T>;
    onDelete?: ActionHandler<T>;
    onActive?: ActionHandler<T>;
    onFeatured?: ActionHandler<T>;
    onRefund?: (row: T) => void;
}

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbHeaderProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    maxItems?: number;
}


export interface CommonValidationTextFieldProps {
    label?: string;
    name: string;
    type?: InputProps["type"];
    placeholder?: string;
    required?: boolean;
    isFormLabel?: boolean;
    autoComplete?: string;
    validating?: boolean;
    clearable?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    showPasswordToggle?: boolean;
    disabled?: boolean;
    currencyDisabled?: boolean;
    isCurrency?: boolean;
    onCurrencyLog?: (value: string) => void;
    maxDigits?: number;
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    helperText?: string;
    multiline?: boolean;
    rows?: number;
    readOnly?: boolean;
}
export interface CommonTextFieldProps
    extends Omit<CommonValidationTextFieldProps, "name"> {
    value: string | number;
    onChange?: (value: string) => void;
}


export interface CommonPhoneNumberProps {
    name: string;
    label?: string;
    required?: boolean;
}

export type AppTableColumn<T extends object> = ColumnType<T> & {
    exportFormatter?: (value: unknown, row: T) => string | number;
    isSummary?: boolean;
};

export type NotificationType = | "success" | "info" | "warning" | "error";

export type SelectOptionType = {
    label: string;
    value: string;
    [key: string]: any;
};

export interface CommonSelectProps {
    label?: string;
    options: SelectOptionType[];
    value?: string | string[];
    onChange: (values: string | string[]) => void;
    multiple?: boolean;
    limitTags?: number;
    size?: "small" | "middle" | "large";
    grid?: ColProps; 
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    isLoading?: boolean;
    searchKeys?: string[];
}


export interface CommonValidationSelectProps extends Omit<CommonSelectProps, "onChange" | "value"> {
    name: string;
    syncFieldName?: string;
}

export interface CommonValidationCreatableSelectProps {
    name: string;
    label: string;
    options: string[];
    required?: boolean;
    disabled?: boolean;
    grid?: ColProps;
}
export const TRANSACTION_TYPE = {
    DEPOSIT: "deposit",
    WITHDRAW: "withdraw"
} as const;

export const STATUS = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    EXPIRED: "expired",
    PROCESSING: "processing",
    REJECTED: "rejected"
} as const;

export const PAYMENT_STATUS = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    EXPIRED: "expired",
    APPROVED: "approved",
    PROCESSING: "processing"
} as const;

export interface AdvancedSearchFilterOption {
    label: string;
    options: SelectOptionType[];
    value?: string | string[];
    onChange: (values: string | string[]) => void;
    multiple?: boolean;
    limitTags?: number;
    grid?: ColProps; 
    isLoading?: boolean;
}

export interface AdvancedSearchProps {
    children?: ReactNode;
    filter?: AdvancedSearchFilterOption[];
    defaultExpanded?: boolean;
}


export interface CommonTableSummaryProps {
    pageData: any[];
    fields: string[];
    columns: any[];
    label?: string;
}


export interface CommonValidationSwitchProps {
    name: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    isFormLabel?: boolean;
    grid?: ColProps;
    switchPlacement?: "start" | "between";
    syncFieldName?: string;
}
export interface CommonSwitchProps extends CommonValidationSwitchProps {
    // For NON-FORMIK switch
    value?: boolean;
    onChange?: (val: boolean) => void;
}



export interface CommonDataGridProps {
    columns: ColumnsType<any>;
    rows: any[];
    rowCount: number;
    loading?: boolean;
    handleAdd?: () => void;

    isActive?: boolean;
    setActive?: (active: boolean) => void;
    paginationModel?: {
        page: number;
        pageSize: number;
    };
    onPaginationModelChange?: (model: {
        page: number;
        pageSize: number;
    }) => void;

    pageSizeOptions?: number[];
    pagination?: boolean;
    sortModel: SorterResult<any> | SorterResult<any>[];

    onSortModelChange: (model: SorterResult<any> | SorterResult<any>[]) => void;
    filterModel: Record<string, FilterValue | null>;

    onFilterModelChange: (model: Record<string, FilterValue | null>) => void;
    defaultHidden?: string[];
    BoxClass?: string;
    isExport?: boolean;
    fileName: string;
    isToolbar?: boolean;
    slots?: {
        noRowsOverlay?: React.ReactNode;
        bottomContainer?: (props: {
            rows: any[];
            rowCount: number;
        }) => React.ReactNode;
    };
    slotProps?: any;
    onExportAll?: {
        onExportAll: () => void;
        isFetching: boolean;
    };
}

export interface CustomToolbarProps<T = any> {
    columns: ColumnsType<T>;
    data: T[];
    total?: number;
    search?: string;
    setSearch?: (value: string) => void;
    isActive?: boolean;
    setActive?: (active: boolean) => void;
    handleAdd?: () => void;
    isExport?: boolean;
    fileName?: string;
    onExportAll?: {
        onExportAll: () => void;
        isFetching: boolean;
    };
}

export type AppGridColDef<T = any> = ColumnsType<T>[number] & {
    exportFormatter?: (value: unknown, row: T) => string | number;
    isSummary?: boolean;
};

export type SidebarProps = {
    openDrawer: boolean;
    setOpenDrawer: (val: boolean) => void;
};

export type LoaderProps = {
    loading: boolean;
    delay?: number;
};

export interface CommonCardProps {
  title?: string;
  children: ReactNode;
  hideDivider?: boolean;
  topContent?: ReactNode;
  btnHref?: string;
  className?: string;
}

export interface CommonBottomActionBarProps {
  children?: ReactNode;
  isLoading?: boolean;
  save?: boolean;
  clear?: boolean;
  submit?: boolean;
  disabled?: boolean;
  onClear?: () => void;
  onSave?: () => void;
  onSaveAndNew?: () => void;
}


export interface CommonProfileAvatarProps {
    fullName?: string;
    profileImage?: string;
    className?: string;
}


export interface HeaderProps {
    onOpenDrawer: () => void;
};

export interface LayoutStateProps {
    isExpanded: boolean;
    isMobileOpen: boolean;
    isMobile: boolean;
    isHovered: boolean;
    isApplicationMenuOpen: boolean;
    openSubmenu: string | null;
    isToggleTheme: string;
};

export interface CommonModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    subTitle?: string;
    className?: string;
    width?: number | string; 
}

export interface CommonDeleteModalProps {
    open: boolean;
    title?: string;
    description?: string;
    itemName?: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

export type PrivateRoutesProps = {
    allowedRoles: string[];
    children: React.ReactNode;
};

export type SidebarIconKey =
  | "dashboard"
  | "orders"
  | "payments"
  | "transactions"
  | "wallet"
  | "users"
  | "settings";
  
export const statusColorMap: Record<string, "success" | "warning" | "error" | "default"> = {
    success: "success",
    pending: "warning",
    failed: "error",
};
export type CommonLoaderProps = {
  fullPage?: boolean;
  size?: "small" | "default" | "large";
  tip?: string;
  className?: string;
};

export const WALLETFILTERS = ["all", "credit", "debit"];