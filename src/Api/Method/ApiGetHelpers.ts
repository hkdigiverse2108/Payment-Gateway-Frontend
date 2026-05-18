import CryptoJS from "crypto-js";
import { Storage } from "../../Utils";
import { STORAGE_KEYS } from "../../Constants";

export const getApiHeaders = ( data?: unknown ) => {
    const user = JSON.parse(Storage.getItem(STORAGE_KEYS.USER) || "null");

    // console.log("API HEADER USER ID:", user?._id);
    // console.log("USER API KEYYYY:", user?.apiKey);
    const apiKey = user?.apiKey || "";
    const secretKey = user?.secretKey || "";
    const payload =
        data === undefined ? "undefined" : JSON.stringify(data);
    const signature = CryptoJS.HmacSHA256(payload, secretKey)
        .toString(CryptoJS.enc.Hex);
    // console.log("API Key:", apiKey);
    // console.log("Secret Key:", secretKey);
    // console.log("Params:", data);
    // console.log("Payload:", payload);
    // console.log("Signature:", signature);
    return {
        "x-api-key": apiKey,
        "x-signature": signature,
    };
};