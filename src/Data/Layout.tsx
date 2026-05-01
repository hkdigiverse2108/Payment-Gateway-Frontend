import { PAGE_TITLE, ROUTES } from "../Constants";
import type { NavItem } from "../Types";
import { IoHome, IoSettingsSharp  } from "react-icons/io5";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { MdPayment } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { BsFillWalletFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";



export const NavItems: NavItem[] = [
    {
        icon: <IoHome />,
        name: PAGE_TITLE.DASHBOARDUSER,
        path: ROUTES.DASHBOARDUSER,
        roles: ["user"],
    },
    {
        icon: <IoHome />,
        name: PAGE_TITLE.DASHBOARDADMIN,
        path: ROUTES.DASHBOARDADMIN,
        roles: ["admin"],
    },
    {
        icon: <AiOutlineUnorderedList />,
        name: PAGE_TITLE.ORDER.BASE,
        path: ROUTES.ORDER.BASE,
        roles: ["admin", "user"],
    },

    // USER FEATURES (based on backend routes)
    {
        icon: <MdPayment />,
        name: PAGE_TITLE.PAYMENT.BASE,
        path: ROUTES.PAYMENT.BASE,
        roles: ["user"],
    },
    {
        icon: <GrTransaction />,
        name: PAGE_TITLE.TRANSACTION.ALL,
        path: ROUTES.TRANSACTION.ALL,
        roles: ["user"],
    },
    {
        icon: <BsFillWalletFill />,
        name: PAGE_TITLE.WALLET.BALANCE,
        path: ROUTES.WALLET.BALANCE,
        roles: ["user"],
    },
    // {
    //     icon: <Send />,
    //     name: "Withdraw",
    //     path: ROUTES.WITHDRAW.BULK_HISTORY,
    //     roles: ["user"],
    // },

    // ADMIN FEATURES
    {
        icon: <FaUser />,
        name: PAGE_TITLE.USERS.ALL,
        path: ROUTES.USERS.ALL,
        roles: ["admin"],
    },

    // OPTIONAL
    {
        icon: <IoSettingsSharp />,
        name: PAGE_TITLE.SETTING.BASE,
        path: ROUTES.SETTING.BASE,
        roles: ["admin", "user"],
    },
];