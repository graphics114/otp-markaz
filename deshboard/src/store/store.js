import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice.js";
import extraReducer from "./slices/extraSlice.js";
import adminReducer from "./slices/adminSlice.js";
import studentsReducer from "./slices/studentsSlice.js";
import admissionsReducer from "./slices/admitionSlice.js";
import deshboardReducer from "./slices/deshboarSlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        extra: extraReducer,
        admin: adminReducer,
        std: studentsReducer,
        admition: admissionsReducer,
        desh: deshboardReducer,
    },
});