export const GetChangedFields = (newVal: Record<string, any>, oldVal: Record<string, any> = {}): Record<string, any> => {
    const changed: Record<string, any> = {};
    const isEmpty = (v: any) => v === "" || v === null || v === undefined;
    Object.keys(newVal).forEach((key) => {
        const newValue = newVal[key];
        const oldValue = oldVal[key];
        if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
            const nestedChanged = GetChangedFields(newValue, oldValue ?? {});
            if (Object.keys(nestedChanged).length > 0) {
                changed[key] = newValue;
            }
            return;
        }
        if (isEmpty(newValue) && isEmpty(oldValue)) return;
        if (newValue !== oldValue) {
            changed[key] = newValue;
        }
    });
    return changed;
};

export const RemoveEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
    const result: Partial<T> = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;
        if (typeof value === "object" && !Array.isArray(value)) {
            const cleaned = RemoveEmptyFields(value);
            if (Object.keys(cleaned).length > 0) {
                result[key as keyof T] = cleaned as T[keyof T];
            }
            return;
        }
        result[key as keyof T] = value;
    });
    return result;
};