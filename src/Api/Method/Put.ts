import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import CryptoJS from "crypto-js";
import { getToken } from "../../Utils";

export async function Put<TInput, TResponse>(url: string, data?: TInput, isToken: boolean = true): Promise<TResponse> {
    const authToken = getToken();
    const isFormData = data instanceof FormData;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let tokenPayload: { apiKey?: string; secretKey?: string; _id?: string; exp?: number } | null;

    try {
        tokenPayload = authToken ? JSON.parse(atob(authToken.split(".")[1] || "")) : null;
    } catch {
        tokenPayload = null;
    }

    const apiKey = tokenPayload?.apiKey;
    const secretKey = tokenPayload?.secretKey;
    const signature =
        apiKey && secretKey && !isFormData
            ? CryptoJS.HmacSHA256(JSON.stringify(data || {}), secretKey).toString(CryptoJS.enc.Hex)
            : undefined;

    const config: AxiosRequestConfig = {
        method: "PUT",
        url: BASE_URL + url,
        headers: {
            ...(isToken ? { Authorization: authToken } : {}),
            ...(apiKey ? { "x-api-key": apiKey } : {}),
            ...(signature ? { "x-signature": signature } : {}),
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
        data,
    };
    if (import.meta.env.DEV && isToken) {
        console.log("PUT auth debug:", {
            url,
            hasToken: !!authToken,
            hasApiKey: !!apiKey,
            hasSignature: !!signature,
            tokenUserId: tokenPayload?._id,
            expiresAt: tokenPayload?.exp ? new Date(tokenPayload.exp * 1000).toLocaleString() : null,
        });
    }

    try {
        const response = await axios(config);
        const resData = response.data;

        // if (response.status === HTTP_STATUS.OK) {
        if (response.status === 200 || response.status === 204) {
            console.log(resData.message, "success");
            return resData;
        } else {
            return null as TResponse;
        }
    } catch (error) {
        const axiosError = error as AxiosError<any>;
        const backendData = axiosError.response?.data;
        const message =
            backendData?.message ||
            backendData?.error ||
            axiosError.message ||
            "Something went wrong";

        if (import.meta.env.DEV) {
            console.log("PUT error response:", {
                url,
                status: axiosError.response?.status,
                message,
                data: backendData,
            });
        }

        return Promise.reject({
            status: axiosError.response?.status,
            message,
            data: backendData,
        });
    }
}
