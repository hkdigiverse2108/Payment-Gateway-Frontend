import { PAGE_TITLE, ROUTES } from "../Constants";

export const BREADCRUMBS = {
    CHANGE_PASSWORD: {
        BASE: [{ label: PAGE_TITLE.SETTING.CHANGE_PASSWORD }],
    },
    SETTING: {
        BASE: [{ label: PAGE_TITLE.SETTING.BASE }],
    },
    USERS: {
        BASE: [{ label: PAGE_TITLE.USERS.BASE }],
        ADD: [{ label: PAGE_TITLE.USERS.BASE, href: ROUTES.USERS.BASE }, { label: PAGE_TITLE.USERS.ADD }],
        EDIT: [{ label: PAGE_TITLE.USERS.BASE, href: ROUTES.USERS.BASE }, { label: PAGE_TITLE.USERS.EDIT }],
    },
    PROFILE: {
        BASE: [{ label: PAGE_TITLE.PROFILE.BASE }],
    },
};
