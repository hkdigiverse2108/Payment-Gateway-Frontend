import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { getToken } from "../../Utils";
import { HTTP_STATUS } from "../../Constants";
import { showNotification } from "../../Attribute/Notification";

export async function Post<TInput, TResponse>(url: string, data?: TInput, isToken: boolean = true): Promise<TResponse> {
    const authToken = getToken();
    const isFormData = data instanceof FormData;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const config: AxiosRequestConfig = {
        method: "POST",
        url: BASE_URL + url,
        headers: {
            ...(isToken ? { Authorization: authToken } : {}),
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
        data,
    };
    try {
        const response = await axios(config);
        const resData = response.data;
        if (response.status === HTTP_STATUS.CREATED || response.status === HTTP_STATUS.OK) {
            showNotification("success", resData.message );
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
        return Promise.reject({
            status: axiosError.response?.status,
            message,
            data: backendData,
        });
    }
}
