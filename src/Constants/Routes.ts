export const ROUTES = {
    HOME: "/",
    DASHBOARD: "/dashboard",
    AUTH: {
        LOGIN: "/auth/login",
    },
    USER: {
        HOME: "/user/home",
    },
    SETTINGS: {
        BASE: "/settings",
        CHANGE_PASSWORD: "/settings/change-password",
        ADMIN: "/settings/admin",
    },
    PROFILE: {
        BASE: "/profile",
    },
    ORDER: {
        BASE: "/order",
        HISTORY: "/order/history",
    },
    PAYMENT: {
        BASE: "/payment",
    },
    TRANSACTIONS: {
        BASE: "/transaction/all",
        DEPOSIT: "/transaction/create-deposit",
        DETAILS: "/transaction/details"
    },
    WALLET: {
        BALANCE: "/wallet/balance",
        ACTIVITY: "/wallet/activity",
    },
    USERS: {
        BASE: "/user",
        ALL: "/user/all",
        ADD_EDIT: "/user/add-edit",
    },
    SETTING: {
        BASE: "/settings",
        CHANGE_PASSWORD: "/settings/change-password",
        ADMIN: "/settings/admin",
    },
} as const;