import axios, { AxiosError, type AxiosRequestConfig, } from "axios";
import type { Params } from "../../Types";
import { ErrorMessage, showNotification, } from "../../Attribute";
import { getApiHeaders } from "./ApiGetHelpers";
import { getToken } from "../../Utils";

export async function Get<T>( url: string, params?: Params, headers?: Record<string, string>, useApiSignature: boolean = false, isToken: boolean = true ): Promise<T> {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const authToken = getToken();
    const config: AxiosRequestConfig = {
        method: "GET",
        headers: { ...(isToken ? { Authorization: authToken,}: {}),
            ...(useApiSignature ? getApiHeaders(params) : {}),
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            ...headers,
        },
        params,
    };
    try {
        const response = await axios.get<T>( BASE_URL + url, config );
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string; }>;
        console.error( "GET request failed:", axiosError.response?.data || error);
        showNotification(
            "error",
            axiosError.response?.data?.message ||
            ErrorMessage(error)
        );
        throw error;
    }
}