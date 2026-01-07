import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import axios from "axios";
import { toast } from "react-toastify";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        isUserLoading: false,
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
            state.isUserLoading = true;
        },
        getUserSuccess(state, action) {
            state.isUserLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        getUserFailed(state) {
            state.isUserLoading = false;
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

        updatePasswordRequest(state) {
            state.loading = true;
        },
        updatePasswordSuccess(state) {
            state.loading = false;
        },
        updatePasswordFailed(state) {
            state.loading = false;
        },

        resetAuthSlice(state) {
            state.loading = false;
            state.isUserLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        },

        userRegisterRequest(state) {
            state.loading = true;
        },
        userRegisterSuccess(state) {
            state.loading = false;
        },
        userRegisterFailed(state) {
            state.loading = false;
        },
    },
});

export const login = (data) => async (dispatch) => {
    dispatch(authSlice.actions.loginRequest());
    try {
        await axiosInstance.post("/auth/login", data).then(res => {
            if (res.data.user.role === "Admin" || res.data.user.role === "Hifiz" || res.data.user.role === "Dawa") {
                dispatch(authSlice.actions.loginSuccess(res.data.user));
                toast.success(res.data.message);
            } else {
                dispatch(authSlice.actions.loginFailed());
                toast.error("Access Denied: You do not have permission to access the dashboard.");
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
        dispatch(authSlice.actions.getUserFailed());
        toast.error(error?.response?.data?.message);
    }
}

export const logout = () => async (dispatch) => {
    dispatch(authSlice.actions.logoutRequest());
    try {
        const res = await axiosInstance.get("/auth/logout");
        dispatch(authSlice.actions.logoutSuccess());
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

export const updatePassword = (data) => async (dispatch) => {
    dispatch(authSlice.actions.updatePasswordRequest());
    try {
        const res = await axiosInstance.put("/auth/password/update", data);
        dispatch(authSlice.actions.updatePasswordSuccess());
        toast.success(res.data.message);
    } catch (error) {
        dispatch(authSlice.actions.updatePasswordFailed());
        toast.error(error.response.data.message || "Failed to update password")
    }
}

export const registerUser = (data) => async (dispatch) => {
    dispatch(authSlice.actions.userRegisterRequest());
    try {
        // Use a non-credential axios instance for registration so the server
        // doesn't overwrite the current admin session cookie by setting a
        // new auth cookie for the created user.
        const noCred = axios.create({
            baseURL: axiosInstance.defaults.baseURL,
            withCredentials: false,
        });
        const res = await noCred.post("/auth/register", data);
        dispatch(authSlice.actions.userRegisterSuccess(res.data.user));
        toast.success(res.data.message || "User registered successfully");
    } catch (error) {
        dispatch(authSlice.actions.userRegisterFailed());
        toast.error(error?.response?.data?.message || "Registration failed")
    }
}

export default authSlice.reducer;