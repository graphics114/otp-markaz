import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import axios from "axios";

const admissionsSlice = createSlice({
    name: "admition",
    initialState: {
        loading: false,
        totalAdmissions: 0,
        admissions: [],
        totalAdmissionsCount: 0,
        selectedAdmition: null,
    },
    reducers: {
        admissionRegisterRequest(state) {
            state.loading = true;
        },
        admissionRegisterSuccess(state) {
            state.loading = false;
        },
        admissionRegisterFailed(state) {
            state.loading = false;
        },
    },
});

export const registerAdmition = (data) => async (dispatch) => {
    dispatch(admissionsSlice.actions.admissionRegisterRequest());
    try {
        // Use a non-credential axios instance for registration so the server
        // doesn't overwrite the current admin session cookie by setting a
        // new auth cookie for the created user.
        const noCred = axios.create({
            baseURL: axiosInstance.defaults.baseURL,
            withCredentials: false,
        });
        const res = await noCred.post("/admition/new/admition", data);
        dispatch(admissionsSlice.actions.admissionRegisterSuccess(res.data.admission));
        toast.success(res.data.message || "Candidate registered successfully");
        return res.data;
    } catch (error) {
        dispatch(admissionsSlice.actions.admissionRegisterFailed());
        const errorMessage = error?.response?.data?.message || "Registration failed";
        if (errorMessage.toLowerCase().includes("duplicate key") || errorMessage.toLowerCase().includes("unique constraint")) {
            toast.error("You are already registered");
        } else {
            toast.error(errorMessage);
        }
        throw error;
    }
}

export default admissionsSlice.reducer;