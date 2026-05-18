import { KEYS, URL_KEYS } from "../Constants";
import type { Params, TransactionApiResponse, TransactionStatusResponse } from "../Types";
import type { UserApiResponse } from "../Types/User";
import type { WalletActivityApiResponse, WalletBalanceResponse } from "../Types/Wallet";
import { Get } from "./Method";
import { useQueries } from "./ReactQuery";

export const Queries = {

    //user
    useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.GET, params)),

    //transaction
    useGetTransaction: (params?: Params) => useQueries<TransactionApiResponse>([KEYS.TRANSACTION.BASE, params], () => Get(URL_KEYS.TRANSACTION.GET, params, undefined, false)),
    // useExportTransaction: (params?: Params) => useQueries<TransactionApiResponse>([KEYS.TRANSACTION.EXPORT, params], () => Get(URL_KEYS.TRANSACTION.EXPORT, params)),
    useTransactionStatus: (params?: Params) => useQueries<TransactionStatusResponse>([KEYS.TRANSACTION.STATUS, params], () => Get(URL_KEYS.TRANSACTION.STATUS, params, undefined, true, true), { enabled: !!params?.orderId }),
    exportTransaction: (params?: Params) => Get(URL_KEYS.TRANSACTION.EXPORT, params, { responseType: "blob", }),

    //wallet
    useGetWalletActivity: (params?: Params) => useQueries<WalletActivityApiResponse>([KEYS.WALLET.ACTIVITY, params], () => Get(URL_KEYS.WALLET.ACTIVITY, params ?? {}, undefined, true, true)),
    useGetWalletBalance: (params?: Params) => useQueries<WalletBalanceResponse>( [KEYS.WALLET.BALANCE], () => Get(URL_KEYS.WALLET.BALANCE, params ?? {}, undefined, true, true)),
};