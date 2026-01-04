import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-toastify";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        users: [],
        isAuthenticated: false,
    },
    reducers: {
        loginRequest(state) {
            state.loading = true;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        loginFailed(state) {
            state.loading = false;
        },

        getUserRequest(state) {
            state.loading = true;
        },
        getUserSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        getUserFailed(state) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },

        logoutRequest(state) {
            state.loading = true;
        },
        logoutSuccess(state) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },
        logoutFailed(state) {
            state.loading = false;
        },

        updateProfileRequest(state) {
            state.loading = true;
        },
        updateProfileSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
        },
        updateProfileFailed(state) {
            state.loading = false;
        },

        resetAuthSlice(state) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const login = (data) => async (dispatch) => {
    dispatch(authSlice.actions.loginRequest());
    try {
        await axiosInstance.post("/auth/clint/login", data).then(res => {
            if (res.data.user.role === "Admin" || res.data.user.role === "Staff" || res.data.user.role === "Student") {
                dispatch(authSlice.actions.loginSuccess(res.data.user));
            } else {
                dispatch(authSlice.actions.loginFailed());
            }
        });
    } catch (error) {

        dispatch(authSlice.actions.loginFailed());
        toast.error(error?.response?.data?.message || "Login Failed");
    };
}

export const getUser = () => async (dispatch) => {
    dispatch(authSlice.actions.getUserRequest());
    try {
        const res = await axiosInstance.get("/auth/me")
        dispatch(authSlice.actions.getUserSuccess(res.data.user));
    } catch (error) {
        dispatch(authSlice.actions.loginFailed());
        toast.error(error?.response?.data?.message || "Authentication failed");
    }
}

export const logout = () => async (dispatch) => {
    dispatch(authSlice.actions.loginRequest());
    try {
        const res = await axiosInstance.get("/auth/logout");
        dispatch(authSlice.actions.loginSuccess());
        toast.success(res.data.message);
        dispatch(authSlice.actions.resetAuthSlice());
    } catch (error) {
        dispatch(authSlice.actions.logoutFailed());
        toast.error(error?.response?.data?.message || "Logout Failed");
        dispatch(authSlice.actions.resetAuthSlice());
    }
}

export const updateProfile = (data) => async (dispatch) => {
    dispatch(authSlice.actions.updateProfileRequest());
    try {
        const res = await axiosInstance.put("/auth/profile/update", data);
        dispatch(authSlice.actions.updateProfileSuccess(res.data.user));
        toast.success(res.data.message);
    } catch (error) {
        dispatch(authSlice.actions.updateProfileFailed());
        toast.error(error.response.data.message || "Failed to update profile")
    }
}

export default authSlice.reducer;