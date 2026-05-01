export const ROUTES = {
    HOME: "/",
    DASHBOARDUSER: "/user",
    DASHBOARDADMIN: "/admin/dashboard",
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
    TRANSACTION: {
        ALL: "/transaction/all",
    },
    WALLET: {
        BALANCE: "/wallet/balance",
    },
    USERS: {
        ALL: "/user/all",
    },
    SETTING: {
        BASE: "/settings",
        CHANGE_PASSWORD: "/settings/change-password",
        ADMIN: "/settings/admin",
    },
} as const;