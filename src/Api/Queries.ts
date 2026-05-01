import { KEYS, URL_KEYS } from "../Constants";
import type { Params } from "../Types";
import type { TransactionApiResponse } from "../Types/Transaction";
import type { UserApiResponse } from "../Types/User";
import { Get } from "./Method";
import { useQueries } from "./ReactQuery";

export const Queries = {

    useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.GET, params)),

    useGetTransaction: (params?: Params) => useQueries<TransactionApiResponse>([KEYS.TRANSACTION.BASE, params], () => Get(URL_KEYS.TRANSACTION.GET_ALL, params)),

};
