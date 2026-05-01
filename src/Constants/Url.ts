export const URL_KEYS = {
    AUTH: {
        LOGIN: "/auth/login",
        RESET_PASSWORD: "/auth/reset-password",
        CHANGE_PASSWORD: "/auth/change-password",
    },
    DASHBOARD: {
        BASE: "/dashboard",
    },
    USER: {
        UPDATE_PROFILE: "/user/profile",
        UPDATE: "/user/edit",
        BASE: "/user",
        GET: "/user/all",
    },
    TRANSACTION: {
        BASE: "/transaction",
        GET_ALL: "/transaction/all",
        EXPORT: "/transaction/export",
        PAYIN: "/transaction/payin",
        STATUS: "/transaction/status",
    },
} as const;
