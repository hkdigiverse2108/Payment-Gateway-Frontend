import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../Constants";
import { Storage, Stringify } from "../../Utils";
import type { LoginResponse } from "../../Types";

const StoredUser = JSON.parse( Storage.getItem(STORAGE_KEYS.USER) || "null");
const StoredToken = Storage.getItem(STORAGE_KEYS.TOKEN) || null;
const initialState = {
    token: StoredToken,
    user: StoredUser,
    role: StoredUser?.role || null,
    isAuthenticated: !!StoredUser,
    signinResponse: null as {
        email: string;
        responseData?: LoginResponse["data"];
    } | null,
};  

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            const payload = action.payload;

            if (!payload?.token) return;

            const token = payload.token;

            let decodedUser = {};

            try {
                decodedUser = JSON.parse(
                    atob(token.split(".")[1])
                );
            } catch (error) {
                console.log("Token decode error", error);
            }

            const user = {
                ...payload,
                ...decodedUser,
            };

            state.token = token;
            state.user = user;
            state.role = user?.role || null;
            state.isAuthenticated = true;

            Storage.setItem(
                STORAGE_KEYS.TOKEN,
                token
            );

            Storage.setItem(
                STORAGE_KEYS.USER,
                Stringify(user)
            );
        },
        setUser: (state, action) => {
            state.user = action.payload;
            Storage.setItem( STORAGE_KEYS.USER, Stringify(action.payload) );
        },
        setLoginResponse: (state, action) => {
            state.signinResponse = action.payload;
        },
        setSignOut: (state) => {
            state.token = null;
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
            state.signinResponse = null;
            Storage.clear();
            window.location.reload();
        },
        setUserUpdate: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload,
            };
            Storage.setItem( STORAGE_KEYS.USER, Stringify(state.user) );
        },
    },
});

export const { setLogin, setUser, setLoginResponse, setSignOut, setUserUpdate } = authSlice.actions;
export default authSlice.reducer;
