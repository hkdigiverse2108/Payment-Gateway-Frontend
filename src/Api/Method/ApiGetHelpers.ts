import CryptoJS from "crypto-js";
import { Storage } from "../../Utils";

export const getApiHeaders = (
    data?: unknown
) => {

    const user = Storage.get("user");

    const apiKey =
        user?.apiKey || "";

    const secretKey =
        user?.secretKey || "";

    // IMPORTANT
    const payload =
        data !== undefined
            ? JSON.stringify(data)
            : "";

    const signature =
        CryptoJS.HmacSHA256(
            payload,
            secretKey
        ).toString();

    console.log("API Key:", apiKey);
    console.log("Secret Key:", secretKey);
    console.log("Payload:", payload);
    console.log("Signature:", signature);

    return {
        "x-api-key": apiKey,
        "x-signature": signature,
    };
};