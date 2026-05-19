import { useCallback, useMemo, useState } from "react";
import { CleanParams } from "..";
import { useDebounce } from "./useDebounce";

export const useAntTable = ({
    page = 1,
    pageSize = 10,
    active = true,
    debounceDelay = 0,
    defaultFilterKey = {},
} = {}) => {
    const [pagination, setPagination] = useState({
        page: page - 1,
        pageSize,
    });
    const [sorter, setSorter] = useState<{
        field?: string;
        order?: "ascend" | "descend";
    }>({});
    const [isActive, setActive] = useState(true);
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search, debounceDelay);
    const [advancedFilter, setAdvancedFilter] =
        useState<Record<string, string[]>>(defaultFilterKey || {});
    const normalizeFilterValue = (value?: string[]) => {
        if (!value || value.length === 0) return undefined;
        return value.length === 1 ? value[0] : value;
    };
    const normalizedAdvancedFilter = Object.fromEntries(
        Object.entries(advancedFilter).map(([key, value]) => [
            key,
            normalizeFilterValue(value),
        ])
    );
    const updateAdvancedFilter = (key: string, value: string[]) => {
        setAdvancedFilter((prev) => ({ ...prev, [key]: value }));
    };
    const [rowToDelete, setRowToDelete] = useState<{
        userId?: string;
        title?: string;
    } | null>(null);
    const { page: currentPage, pageSize: pageLimit } = pagination;
    const { field, order } = sorter;
    const params = useMemo(() => {
        return CleanParams({
            page: currentPage + 1,
            limit: pageLimit,
            ...(active && { activeFilter: isActive }),
            ...normalizedAdvancedFilter,
            search: debouncedSearch,
            sortField: field,
            sortOrder:
                order === "ascend"
                    ? "asc"
                    : order === "descend"
                        ? "desc"
                        : undefined,
        });
    }, [
        currentPage,
        pageLimit,
        debouncedSearch,
        isActive,
        normalizedAdvancedFilter,
        field,
        order,
        active,
    ]);
    const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
        setPagination({
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
        });

        setSorter({
            field: sorter.field,
            order: sorter.order,
        });
    };
    const reset = useCallback(() => {
        setPagination({ page: page, pageSize });
        setSorter({});
        setSearch("");
        setAdvancedFilter(defaultFilterKey || {});
    }, [page, pageSize, defaultFilterKey]);

    return {
        pagination,
        setPagination,
        sorter,
        search,
        setSearch,
        isActive,
        setActive,
        advancedFilter,
        updateAdvancedFilter,
        rowToDelete,
        setRowToDelete,
        params,
        handleTableChange,
        reset,
    };
};