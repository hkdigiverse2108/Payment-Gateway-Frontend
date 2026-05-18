import { PAGE_TITLE, ROUTES } from "../Constants";

export const BREADCRUMBS = {
    CHANGE_PASSWORD: {
        BASE: [{ label: PAGE_TITLE.SETTING.CHANGE_PASSWORD }],
    },
    SETTING: {
        BASE: [{ label: PAGE_TITLE.SETTING.BASE }],
    },
    USERS: {
        BASE: [{ label: PAGE_TITLE.USERS.ALL }],
        ADD: [{ label: PAGE_TITLE.USERS.ALL, href: ROUTES.USERS.ALL }, { label: PAGE_TITLE.USERS.ADD }],
        EDIT: [{ label: PAGE_TITLE.USERS.ALL, href: ROUTES.USERS.ALL }, { label: PAGE_TITLE.USERS.EDIT }],
    },
    PROFILE: {
        BASE: [{ label: PAGE_TITLE.PROFILE.BASE }],
    },
    TRANSACTIONS: {
        BASE: [{ label: PAGE_TITLE.TRANSACTIONS.BASE }],
        STATUS: [{ label: PAGE_TITLE.TRANSACTIONS.STATUS }],
        PAYIN: [{ label: PAGE_TITLE.TRANSACTIONS.BASE, href: ROUTES.TRANSACTIONS.BASE }, { label: PAGE_TITLE.TRANSACTIONS.PAYIN }],
        DETAILS: [{ label: PAGE_TITLE.TRANSACTIONS.BASE, href: ROUTES.TRANSACTIONS.BASE }, { label: PAGE_TITLE.TRANSACTIONS.DETAILS }],
    },
    WALLET: {
        BALANCE: [{ label: PAGE_TITLE.WALLET.BALANCE}],
    },
};
