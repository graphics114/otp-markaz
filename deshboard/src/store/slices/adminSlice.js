import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleResetPassword, toggleUpdateUser } from "./extraSlice";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        totalUsers: 0,
        users: [],
        totalUsersCount: 0,
        selectedUser: null,
        isAuthenticated: false,
    },
    reducers: {
        getAllUsersRequest(state){
            state.loading = true;
        },
        getAllUsersSuccess(state, action){
            state.loading = false;
            state.users = action.payload.users;
            // server returns total count in `count`
            state.totalUsers = action.payload.count || (action.payload.totalUsers || 0);
        },
        getAllUsersFailed(state){
            state.loading = false;
        },

        deleteUserRequest(state){
            state.loading = true;
        },
        deleteUserSuccess(state, action){
            state.loading = false;
            state.users = state.users.filter(user => user.id !== action.payload);
            state.totalUsers = Math.max(0, state.totalUsers -1);
        },
        deleteUserFailed(state){
            state.loading = false;
        },

        updateUserRequest(state){
            state.loading = true;
        },
        updateUserSuccess(state, action){
            state.loading = false;
            state.users = state.users.map((user) => 
                user.id === action.payload.id ? action.payload : user);
        },
        updateUserFailed(state){
            state.loading = false;
        },

        resetUserPasswordRequest(state){
            state.loading = true;
        },
        resetUserPasswordSuccess(state){
            state.loading = false;
        },
        resetUserPasswordFailed(state){
            state.loading = false;
        },
    },
});

export const fetchAllUsers = (page) => async (dispatch) => {
    dispatch(adminSlice.actions.getAllUsersRequest());
    try {
        const res = await axiosInstance.get(`/admin/users?page=${page}`);
        dispatch(adminSlice.actions.getAllUsersSuccess(res.data));
    } catch (error) {
        dispatch(adminSlice.actions.getAllUsersFailed());
        toast.error(error?.response?.data?.message || "Failed to get users");
    }
};

export const deleteUser = (id, page) => async (dispatch, getState) => {
    dispatch(adminSlice.actions.deleteUserRequest());
    try {
        const res = await axiosInstance.delete(`/admin/users/delete/${id}`)
        dispatch(adminSlice.actions.deleteUserSuccess(id));
        toast.success(res.data.message || "Deleted successfully");
        const state = getState();
        const updatedTotal = state.admin.totalUsers;
        const updatedMaxPage = Math.ceil(updatedTotal / 10) || 1;
        const validPage = Math.min(page, updatedMaxPage);
        dispatch(fetchAllUsers(validPage));
    } catch (error) {
        dispatch(adminSlice.actions.deleteUserFailed());
        toast.error(error.response?.data?.message || "Failed to delete user");
    }
};

export const updateUser = (id, data) => async (dispatch) => {
    dispatch(adminSlice.actions.updateUserRequest());
    try {
        const res = await axiosInstance.put(`/auth/update/user/${id}`, data);
        // server returns updated user in `res.data.user`
        dispatch(adminSlice.actions.updateUserSuccess(res.data.user));
        toast.success(res.data.message || "Updated successfully");
        dispatch(toggleUpdateUser());
    } catch (error) {
        dispatch(adminSlice.actions.updateUserFailed());
        toast.error(error.response?.data?.message || "Failed to update");
    }
};

export const resetUserPassword = (id, data) => async (dispatch) => {
    dispatch(adminSlice.actions.resetUserPasswordRequest());
    try {
        const res = await axiosInstance.put(`/auth/password/reset/${id}`, data);
        dispatch(adminSlice.actions.resetUserPasswordSuccess(res.data.user));
        toast.success(res.data.message || "Password reset successfully");
        dispatch(toggleResetPassword());
    } catch (error) {
        dispatch(adminSlice.actions.resetUserPasswordFailed());
        toast.error(error.response?.data?.message || "Failed to reset password");
    }
};

export default adminSlice.reducer;