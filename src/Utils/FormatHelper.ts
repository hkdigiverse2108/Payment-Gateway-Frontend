export const formatCurrency = (amount: number = 0) =>
    Number(amount || 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });

export const formatDay = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
};

export const formatNumber = (value: number = 0) =>
    Number(value || 0).toLocaleString("en-IN");

export const formatDateLabel = (date: string) => {
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return date;

        return parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
        });
    };