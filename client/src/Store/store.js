import { configureStore } from "@reduxjs/toolkit";
import popupReducer from "./slices/popupSlice";
import authReducer from "./slices/authSlice";
import examReducer from "./slices/examResultSlice";

export const store = configureStore({
    reducer:{
        popup: popupReducer,
        auth: authReducer,
        exam: examReducer,
    },
});