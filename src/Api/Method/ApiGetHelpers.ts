import CryptoJS from "crypto-js";
import { Storage } from "../../Utils";
import { STORAGE_KEYS } from "../../Constants";

export const getApiHeaders = ( data?: unknown, customKeys?: { apiKey: string; secretKey: string } ) => {
    const user = JSON.parse(Storage.getItem(STORAGE_KEYS.USER) || "null");
    const selectedUserKeys = JSON.parse(localStorage.getItem("selectedUserKeys") || "null");

    const apiKey = customKeys?.apiKey || selectedUserKeys?.apiKey || user?.apiKey || "";
    const secretKey = customKeys?.secretKey || selectedUserKeys?.secretKey || user?.secretKey || "";
    const payload =
        data === undefined ? "undefined" : JSON.stringify(data);
    const signature = CryptoJS.HmacSHA256(payload, secretKey)
        .toString(CryptoJS.enc.Hex);
    return {
        "x-api-key": apiKey,
        "x-signature": signature,
    };
};