import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slices/AuthSlice";
import LayoutSlice from "./Slices/LayoutSlice";

const Store = configureStore({
    reducer: {
        auth: AuthSlice,
        layout: LayoutSlice,
    },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
