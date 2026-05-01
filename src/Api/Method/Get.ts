import axios from "axios";
import CryptoJS from "crypto-js";
import { getToken } from "../../Utils";

export async function Get<T>(url: string, params?: any, isToken = true): Promise<T> {
    const authToken = getToken();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let tokenPayload: any;

    try {
        tokenPayload = authToken ? JSON.parse(atob(authToken.split(".")[1] || "")) : null;
    } catch {
        tokenPayload = null;
    }

    const apiKey = tokenPayload?.apiKey;
    const secretKey = tokenPayload?.secretKey;

    // ✅ MUST MATCH BACKEND EXACTLY
    const payloadObj = {
        method: "GET",
        url,
        params: params || {}
    };

    const payload = JSON.stringify(payloadObj);

    const signature =
        apiKey && secretKey
            ? CryptoJS.HmacSHA256(payload, secretKey).toString(CryptoJS.enc.Hex)
            : undefined;

    return axios.get(BASE_URL + url, {
        params,
        headers: {
            ...(isToken ? { Authorization: authToken } : {}),
            ...(apiKey ? { "x-api-key": apiKey } : {}),
            ...(signature ? { "x-signature": signature } : {}),
            "Content-Type": "application/json"
        }
    }).then(res => res.data);
}

// import axios, { AxiosError, type AxiosRequestConfig } from "axios";
// import CryptoJS from "crypto-js";
// import { getToken } from "../../Utils";



// export async function Get<T>(url: string, params?: any, isToken = true): Promise<T> {
//     const authToken = getToken();
//     const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//     let tokenPayload: any;

//     try {
//         tokenPayload = authToken ? JSON.parse(atob(authToken.split(".")[1] || "")) : null;
//     } catch {
//         tokenPayload = null;
//     }

//     const apiKey = tokenPayload?.apiKey;
//     const secretKey = tokenPayload?.secretKey;

//     const payloadObj = {
//         method: "GET",
//         url,
//         params: params || {}
//     };

//     const payload = JSON.stringify(payloadObj);

//     const signature =
//         apiKey && secretKey
//             ? CryptoJS.HmacSHA256(payload, secretKey).toString(CryptoJS.enc.Hex)
//             : undefined;

//     return axios.request({
//         method: "GET",
//         url: BASE_URL + url,
//         params,
//         data: payloadObj, // 👈 THIS IS THE TRICK
//         headers: {
//             ...(isToken ? { Authorization: authToken } : {}),
//             ...(apiKey ? { "x-api-key": apiKey } : {}),
//             ...(signature ? { "x-signature": signature } : {}),
//             "Content-Type": "application/json"
//         }
//     }).then(res => res.data);
// }

// import axios, { AxiosError, type AxiosRequestConfig } from "axios";
// import { HTTP_STATUS, ROUTES } from "../../Constants";
// import type { Params } from "../../Types";
// import { getToken, Storage } from "../../Utils";

// let isRedirecting = false;

// export async function Get<T>(url: string, params?: Params, headers?: Record<string, string>): Promise<T> {
//     const authToken = getToken();
//     const BASE_URL = import.meta.env.VITE_API_BASE_URL;
//     const config: AxiosRequestConfig = {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${authToken}`,
//             "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
//             Pragma: "no-cache",
//             Expires: "0",
//             ...headers,
//         },
//         params,
//     };

//     try {
//         const response = await axios.get<T>(BASE_URL + url, config);

//         return response.data;
//     } catch (error) {
//         const axiosError = error as AxiosError<{ status?: string }>;

//         if (axiosError?.response?.status === HTTP_STATUS.UNAUTHORIZED && !isRedirecting) {
//             Storage.clear();
//             isRedirecting = true;
//             window.location.href = ROUTES.HOME;
//             setTimeout(() => (isRedirecting = false), 1000);
//         } else {
//             console.error("GET request failed:", error);
//             // ShowNotification(ErrorMessage(error), "error");
//         }
//         throw null;
//     }
// }
