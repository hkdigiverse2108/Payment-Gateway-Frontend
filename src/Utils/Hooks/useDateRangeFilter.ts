import { useState, useMemo } from "react";

export const useDateRangeFilter = () => {
    const [dateRange, setDateRange] = useState<any>(null);

    const dateQuery = useMemo(() => {
        if (!dateRange?.[0] || !dateRange?.[1]) return {};

        return {
            startDate: dateRange[0].toISOString(),
            endDate: dateRange[1].toISOString(),
        };
    }, [dateRange]);

    return {
        dateRange,
        setDateRange,
        dateQuery,
    };
};