import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../Constants";
import { Storage } from "../../Utils";
// const StoredUser = Storage.getItem(STORAGE_KEYS.USER)
//     ? JSON.parse(Storage.getItem(STORAGE_KEYS.USER)!)
//     : null;
let StoredUser = null;
const StoredToken = Storage.getItem(STORAGE_KEYS.TOKEN);

try {
    const rawUser = Storage.getItem(STORAGE_KEYS.USER);

    if (rawUser && rawUser !== "undefined") {
        StoredUser = JSON.parse(rawUser);
    }
} catch (error) {
    console.error("Invalid user in storage, clearing...", error);
    Storage.removeItem(STORAGE_KEYS.USER);
}
const initialState = {
    token: StoredToken || StoredUser?.token || null,
    user: StoredUser || null,
    role: StoredUser?.role || null,
    apiKey: StoredUser?.apiKey || null,
    secretKey: StoredUser?.secretKey || null,
    isAuthenticated: !!(StoredToken || StoredUser?.token),
};
const normalizeUser = (u: any) => ({
    _id: u?._id,
    name: u?.name || "",
    email: u?.email || "",
    mobileNumber: u?.mobileNumber ?? "",
    userName: u?.userName || "",
    username: u?.username || "",
    websiteName: u?.websiteName || "",
    websiteUrl: u?.websiteUrl || "",
    payinCallbackUrl: u?.payinCallbackUrl || "",
    payoutCallbackUrl: u?.payoutCallbackUrl || "",
    token: u?.token || null,
    role: u?.role || null,
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // setLogin: (state, action) => {
        //     const data = action.payload;

        //     if (!data?.token) return;

        //     // state.token = data.token;
        //     // state.user = data.user || data;
        //     // state.role = data.role;
        //     // state.isAuthenticated = true;

        //     // Storage.setItem(STORAGE_KEYS.TOKEN, data.token);
        //     // Storage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
        //     state.token = data.token;
        //     state.user = data.user || data;
        //     state.role = data.user?.role;
        //     state.isAuthenticated = true;

        //     Storage.setItem(STORAGE_KEYS.TOKEN, data.token);
        //     Storage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user || data));
        //     console.log("SET LOGIN DATA:", data);
        //     console.log("STORED USER:", state.user);
        // },
        setLogin: (state, action) => {
            const data = action.payload;

            if (!data?.token) return;

            const user = {
                ...normalizeUser(data.user || data),
                token: data.token,
            };

            state.token = data.token;
            state.user = user;
            state.role = user.role;
            state.isAuthenticated = true;

            Storage.setItem(STORAGE_KEYS.TOKEN, data.token);
            Storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        },

        setSignOut(state) {
            state.token = null;
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;

            Storage.clear();
        },
        setUserUpdate: (state, action) => {
            const updatedUser = normalizeUser(action.payload);

            state.user = {
                ...state.user,
                ...updatedUser,
                token: state.token,
                apiKey: state.user?.apiKey,
                secretKey: state.user?.secretKey,
            };

            Storage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
        }
    },
});

export const { setSignOut, setLogin, setUserUpdate } = authSlice.actions;
export default authSlice.reducer;
