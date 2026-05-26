
import { KEYS, URL_KEYS } from "../Constants";
import type { Params, TransactionApiResponse, TransactionStatusResponse } from "../Types";
import type { UserApiResponse } from "../Types/User";
import type { WalletActivityApiResponse, WalletBalanceResponse } from "../Types/Wallet";
import { Get } from "./Method";
import { getApiHeaders } from "./Method/ApiGetHelpers";
import { useQueries } from "./ReactQuery";

export const Queries = {

  //user
  useGetUser: (params?: Params) => useQueries<UserApiResponse>([KEYS.USER.BASE, params], () => Get(URL_KEYS.USER.GET, params)),

  //transaction
  useGetTransaction: (params?: Params) => useQueries<TransactionApiResponse>([KEYS.TRANSACTION.BASE, params], () => Get(URL_KEYS.TRANSACTION.GET, params, undefined, false)),
    
  useTransactionStatus: (params?: Params, customKeys?: { apiKey: string; secretKey: string }, options?: any) => useQueries<TransactionStatusResponse>([KEYS.TRANSACTION.STATUS, params, customKeys], () => { const signatureHeaders = getApiHeaders("", customKeys); return Get(URL_KEYS.TRANSACTION.STATUS, params, signatureHeaders, false, true) }, { enabled: !!params?.orderId, ...options }),
    
  exportTransaction: (params?: Params) => Get(URL_KEYS.TRANSACTION.EXPORT, params, { responseType: "blob", }),

  //wallet
  useGetWalletActivity: (params?: Params) => useQueries<WalletActivityApiResponse>([KEYS.WALLET.ACTIVITY, params], () => { const authHeaders = getApiHeaders(""); return Get(URL_KEYS.WALLET.ACTIVITY, params ?? {}, authHeaders, true, true) }),

  useGetWalletBalance: (params?: Params) => useQueries<WalletBalanceResponse>([KEYS.WALLET.BALANCE], () => { const authHeaders = getApiHeaders(""); return Get( URL_KEYS.WALLET.BALANCE, params ?? {}, authHeaders, true, true )}),
};
