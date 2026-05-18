export * from "./FormHelpers";
import { STORAGE_KEYS } from "../Constants";
import type { Params } from "../Types";
import type { SelectProps } from "antd";

export * from "./ValidationSchemas";
export * from "./Hooks";

export const Stringify = (value: object): string => {
    try {
        return JSON.stringify(value);
    } catch {
        return "";
    }
};

export const Storage = localStorage;

export const getToken = () => {
    const token = Storage.getItem(STORAGE_KEYS.TOKEN);
    return token;
};

export const CleanParams = (params?: Params): Params | undefined => {
    if (!params) return undefined;
    return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
};

export const FormatCountryCode = (code?: string) => {
    if (!code) return "";
    return code.startsWith("+") ? code : `+${code}`;
};

export const GenerateOptions = (data?: { userId: string; name?: string; title?: string; fullName?: string; orderNo?: string | null; estimateNo?: string | null }[]) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => {
        const label = item.name?.trim() ||  item.title?.trim() || item.fullName?.trim() || item.orderNo?.trim() || item.estimateNo?.trim() || "Unnamed";

        return {
            value: item.userId,
            label,
        };
    });
};
export const CreateFilter = ( label: string, filterKey: string, advancedFilter: Record<string, string[]>, updateAdvancedFilter: (key: string, value: string[]) => void, options: SelectProps["options"], isLoading?: boolean, grid?: any, multiple?: boolean, limitTags?: number ) => ({
    label,
    options,
    value: advancedFilter[filterKey] || [],
    mode: multiple ? "multiple" : undefined,
    maxTagCount: limitTags, 
    loading: isLoading,
    onChange: (val: string[]) => updateAdvancedFilter(filterKey, val),
    grid,
});